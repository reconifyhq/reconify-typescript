import { describe, expect, it } from "vitest";
import { ReconifyApiError, ReconifyClient, ReconifyTimeoutError } from "../src/index.js";

const response = (body: unknown, status = 200, headers: Record<string, string> = { "content-type": "application/json" }) =>
  new Response(body === undefined ? undefined : JSON.stringify(body), { status, headers });

describe("ReconifyClient", () => {
  it("builds the v1 URL, encodes path values, serializes queries, and authenticates", async () => {
    let request: Request | undefined;
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async (input, init) => {
        request = new Request(input, init);
        return response({ id: "event-1" });
      },
    });

    await client.events.getEvent({ path: { id: "event/with space" } });

    expect(request?.url).toBe("https://api.example.test/v1/events/event%2Fwith%20space");
    expect(request?.method).toBe("GET");
    expect(request?.headers.get("authorization")).toBe("Bearer rk_test");
  });

  it("serializes request bodies and query parameters", async () => {
    let request: Request | undefined;
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test/v1/",
      fetch: async (input, init) => {
        request = new Request(input, init);
        return response({ ok: true });
      },
    });

    await client.events.listEvents({ query: { source_id: "source-1", limit: 10 } });
    expect(request?.url).toBe("https://api.example.test/v1/events?source_id=source-1&limit=10");

    await client.alerts.putAlertRule({
      body: {
        breachEnabled: true,
        channels: [],
        controlId: "control-1",
        dedupWindowSeconds: 60,
        destinations: {},
        resolutionEnabled: true,
        severityMin: "medium",
      },
    });
    expect(request?.method).toBe("PUT");
    expect(request?.headers.get("content-type")).toBe("application/json");
    expect(await request?.json()).toEqual({
      breachEnabled: true,
      channels: [],
      controlId: "control-1",
      dedupWindowSeconds: 60,
      destinations: {},
      resolutionEnabled: true,
      severityMin: "medium",
    });
  });

  it("returns void for 204 responses", async () => {
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async () => new Response(undefined, { status: 204 }),
    });

    await expect(client.ledger.deleteLedgerSource({ path: { id: "source-1" } })).resolves.toBeUndefined();
  });

  it("raises a typed error with the problem response body", async () => {
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async () => response({ detail: "Not found" }, 404),
    });

    const error = await client.events.getEvent({ path: { id: "missing" } }).catch((value) => value);
    expect(error).toBeInstanceOf(ReconifyApiError);
    expect(error).toMatchObject({ status: 404, code: "not_found", body: { detail: "Not found" }, message: "Not found" });
  });

  it("retries idempotent requests for 429 and 503 responses", async () => {
    let attempts = 0;
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      retry: { maxAttempts: 3, baseDelayMs: 0, maxDelayMs: 0 },
      fetch: async () => {
        attempts += 1;
        if (attempts === 1) return response({ detail: "rate limited" }, 429);
        if (attempts === 2) return response({ detail: "temporarily unavailable" }, 503);
        return response({ id: "event-1" });
      },
    });

    await expect(client.events.getEvent({ path: { id: "event-1" } })).resolves.toEqual({ id: "event-1" });
    expect(attempts).toBe(3);
  });

  it("supports per-request timeouts", async () => {
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      retry: { maxAttempts: 1 },
      fetch: async (_input, init) => new Promise((_, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
      }),
    });

    await expect(client.events.getEvent({ path: { id: "event-1" }, request: { timeoutMs: 5 } })).rejects.toBeInstanceOf(ReconifyTimeoutError);
  });

  it("iterates cursor-paginated events naturally", async () => {
    const requestedCursors: Array<string | null> = [];
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async (input) => {
        const cursor = new URL(String(input)).searchParams.get("after");
        requestedCursors.push(cursor);
        return cursor === null
          ? response({ events: [{ id: "event-1" }], limit: 1, nextCursor: "page-2" })
          : response({ events: [{ id: "event-2" }], limit: 1 });
      },
    });

    const ids: string[] = [];
    for await (const event of client.events.iterateEvents({ query: { limit: 1 } })) ids.push(event.id);
    expect(ids).toEqual(["event-1", "event-2"]);
    expect(requestedCursors).toEqual([null, "page-2"]);
  });
});
