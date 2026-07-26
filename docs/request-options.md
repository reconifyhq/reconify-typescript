# Request options

## Operation arguments

Every operation accepts a single object whose fields are generated from the OpenAPI contract:

- `path` contains required path parameters such as `{ id }`.
- `query` contains optional query parameters such as `limit`, `offset`, or `after`.
- `headers` contains operation-specific headers.
- `body` contains a typed JSON request body when the operation accepts one.
- `request` contains transport controls.

```ts
await client.ledger.listTransactions({
  path: { id: "source-123" },
  query: {
    period_key: "2026-01",
    direction: "debit",
    limit: 100,
  },
});
```

## Cancellation and timeouts

Use an `AbortSignal` to cancel work and `timeoutMs` to bound an individual request. A request timeout throws `ReconifyTimeoutError`.

```ts
import { ReconifyTimeoutError } from "@reconifyhq/sdk";

const controller = new AbortController();

try {
  await client.events.listEvents({
    request: {
      signal: controller.signal,
      timeoutMs: 10_000,
    },
  });
} catch (error) {
  if (error instanceof ReconifyTimeoutError) {
    console.error("The request timed out");
  }
}

controller.abort();
```

The client default timeout is 30 seconds. Set the client option or request option to `0` to disable a timeout.

## Retries

Configure defaults when constructing the client or override them on one request:

```ts
const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
  retry: {
    maxAttempts: 3,
    baseDelayMs: 250,
    maxDelayMs: 5_000,
  },
});

await client.events.getEvent({
  path: { id: "event-123" },
  request: { retry: { maxAttempts: 1 } },
});
```

Retries are enabled for idempotent methods when the response is `429` or `503`, and for transient fetch failures. POST, PUT, PATCH, and DELETE requests are not retried unless `retryNonIdempotent: true` is set.

## Pagination

Cursor helpers are available for events, issues, and wallet transactions:

```ts
for await (const issue of client.issues.iterateIssues({
  query: { limit: 100 },
})) {
  console.log(issue.id);
}
```

The helper follows each response's `nextCursor`. Other collection operations expose their typed pagination query fields directly, commonly `limit` and `offset`.

## Structured errors

```ts
import { ReconifyApiError } from "@reconifyhq/sdk";

try {
  await client.events.getEvent({ path: { id: "missing" } });
} catch (error) {
  if (error instanceof ReconifyApiError) {
    console.error({
      status: error.status,
      code: error.code,
      field: error.field,
      details: error.details,
      body: error.body,
    });
  }
}
```

## Custom fetch

Provide a compatible `fetch` function for tests, polyfills, or alternate runtimes:

```ts
const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
  fetch: myFetch,
});
```
