import { describe, expect, it } from "vitest";
import { ReconifyApiError, ReconifyClient, ReconifyTimeoutError } from "../src/index.js";

const response = (body: unknown, status = 200, headers: Record<string, string> = { "content-type": "application/json" }) =>
  new Response(body === undefined ? undefined : JSON.stringify(body), { status, headers });

describe("ReconifyClient", () => {
  it("uses the v2 URL, encodes path values, serializes queries, and authenticates", async () => {
    let request: Request | undefined;
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async (input, init) => {
        request = new Request(input, init);
        return response({ id: "event-1" });
      },
    });

    await client.events.getEvent({ path: { event_id: "event/with space" } });

    expect(request?.url).toBe("https://api.example.test/v2/events/event%2Fwith%20space");
    expect(request?.method).toBe("GET");
    expect(request?.headers.get("authorization")).toBe("Bearer rk_test");
  });

  it("supports environment defaults and serializes request bodies", async () => {
    let request: Request | undefined;
    const previousKey = process.env.RECONIFY_API_KEY;
    const previousUrl = process.env.RECONIFY_API_URL;
    process.env.RECONIFY_API_KEY = "rk_environment";
    process.env.RECONIFY_API_URL = "https://api.example.test/v2/";
    try {
      const client = new ReconifyClient({
        fetch: async (input, init) => {
          request = new Request(input, init);
          return response({ results: [] }, 202);
        },
      });

      await client.ingestion.ingestMonitoringEvents({ body: { events: [] } });
      expect(request?.url).toBe("https://api.example.test/v2/events");
      expect(request?.method).toBe("POST");
      expect(request?.headers.get("content-type")).toBe("application/json");
      expect(await request?.json()).toEqual({ events: [] });
    } finally {
      if (previousKey === undefined) delete process.env.RECONIFY_API_KEY;
      else process.env.RECONIFY_API_KEY = previousKey;
      if (previousUrl === undefined) delete process.env.RECONIFY_API_URL;
      else process.env.RECONIFY_API_URL = previousUrl;
    }
  });

  it("registers an on-chain source with idempotency and typed payloads", async () => {
    let request: Request | undefined;
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async (input, init) => {
        request = new Request(input, init);
        return response({ id: "source-1", duplicate: false, status: "queued" }, 202);
      },
    });

    await expect(client.ingestion.registerOnchainSource({
      headers: { "Idempotency-Key": "source-123" },
      body: {
        flow: "payment_to_wallet",
        kind: "transaction",
        operation_reference: "order-123",
        source_event_id: "event-123",
        locator: { network: "ethereum-mainnet", transaction_reference: "0xabc" },
      },
    })).resolves.toEqual({ id: "source-1", duplicate: false, status: "queued" });
    expect(request?.url).toBe("https://api.example.test/v2/onchain-sources");
    expect(request?.method).toBe("POST");
    expect(request?.headers.get("idempotency-key")).toBe("source-123");
    expect(await request?.json()).toMatchObject({ source_event_id: "event-123" });
  });

  it("raises a typed error with the problem response body", async () => {
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async () => response({ code: "not_found", message: "Not found" }, 404),
    });

    const error = await client.events.getEvent({ path: { event_id: "missing" } }).catch((value) => value);
    expect(error).toBeInstanceOf(ReconifyApiError);
    expect(error).toMatchObject({ status: 404, code: "not_found", body: { message: "Not found" }, message: "Not found" });
  });

  it("retries idempotent requests for 429 and 503 responses", async () => {
    let attempts = 0;
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      retry: { maxAttempts: 3, baseDelayMs: 0, maxDelayMs: 0 },
      fetch: async () => {
        attempts += 1;
        if (attempts === 1) return response({ message: "rate limited" }, 429);
        if (attempts === 2) return response({ message: "temporarily unavailable" }, 503);
        return response({ id: "event-1" });
      },
    });

    await expect(client.events.getEvent({ path: { event_id: "event-1" } })).resolves.toEqual({ id: "event-1" });
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

    await expect(client.events.getEvent({ path: { event_id: "event-1" }, request: { timeoutMs: 5 } })).rejects.toBeInstanceOf(ReconifyTimeoutError);
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
          ? response({ events: [{ id: "event-1" }], limit: 1, next_cursor: "page-2" })
          : response({ events: [{ id: "event-2" }], limit: 1 });
      },
    });

    const ids: string[] = [];
    for await (const event of client.events.iterateEvents({ query: { limit: 1 } })) ids.push(event.id);
    expect(ids).toEqual(["event-1", "event-2"]);
    expect(requestedCursors).toEqual([null, "page-2"]);
  });
});
