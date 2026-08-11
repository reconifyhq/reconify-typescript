# Request options

## Operation arguments

Every operation accepts one generated object whose fields come from OpenAPI:

- path contains required path parameters such as event_id;
- query contains filters and cursor fields such as limit and after;
- headers contains operation-specific headers;
- body contains a typed JSON request body;
- request contains transport controls.

    await client.events.getEvent({
      path: { event_id: "event-123" },
      request: { timeoutMs: 10_000 },
    });

## Cancellation and timeouts

Use AbortSignal to cancel work and timeoutMs to bound a request. A timeout
throws ReconifyTimeoutError; caller cancellation preserves the abort reason.
The client default timeout is 30 seconds. Set the client or request timeout to
0 to disable it.

## Retries

Retries apply to idempotent methods for 429, 503, and transient fetch failures.
Unsafe methods are not retried unless retryNonIdempotent: true is explicitly
set. Ingestion retries should use stable event IDs.

    const client = new ReconifyClient({
      apiKey: process.env.RECONIFY_API_KEY!,
      retry: { maxAttempts: 3, baseDelayMs: 250, maxDelayMs: 5_000 },
    });

## Pagination and errors

    for await (const issue of client.issues.iterateIssues({ query: { limit: 100 } })) {
      console.log(issue.id);
    }

Cursor helpers follow the response next_cursor value. API failures throw
ReconifyApiError with status, code, field, details, body, and the original
response.

## Custom fetch

Pass a compatible fetch implementation for tests, polyfills, or alternate
runtimes through ReconifyClient options.
