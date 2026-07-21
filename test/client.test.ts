import { describe, expect, it } from "vitest";
import { ReconifyApiError, ReconifyClient } from "../src/index.js";

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

    await client.getEvent({ path: { id: "event/with space" } });

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

    await client.listEvents({ query: { source_id: "source-1", limit: 10 } });
    expect(request?.url).toBe("https://api.example.test/v1/events?source_id=source-1&limit=10");

    await client.putAlertRule({
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

    await expect(client.deleteLedgerSource({ path: { id: "source-1" } })).resolves.toBeUndefined();
  });

  it("raises a typed error with the problem response body", async () => {
    const client = new ReconifyClient({
      apiKey: "rk_test",
      baseUrl: "https://api.example.test",
      fetch: async () => response({ detail: "Not found" }, 404),
    });

    const error = await client.getEvent({ path: { id: "missing" } }).catch((value) => value);
    expect(error).toBeInstanceOf(ReconifyApiError);
    expect(error).toMatchObject({ status: 404, body: { detail: "Not found" }, message: "Not found" });
  });
});
