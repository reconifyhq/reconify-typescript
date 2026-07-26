# @reconifyhq/sdk

Typed TypeScript client for the Reconify Public API.

The SDK exposes 50 public operations through a single `ReconifyClient`. It includes generated OpenAPI types, request cancellation, timeouts, retries, structured API errors, and cursor pagination helpers.

## Installation

```sh
npm install @reconifyhq/sdk
```

The package supports Node.js 18 or newer and runtimes with a standard `fetch` implementation.

## Ingest your first event

```ts
import { ReconifyClient } from "@reconifyhq/sdk";

const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
});

const result = await client.ingestion.ingestIntegrityEvents({
  body: {
    events: [
      {
        amountMinor: 1500,
        currency: "USD",
        eventType: "payment.succeeded",
        occurredAt: "2026-07-26T12:00:00Z",
        sourceEventId: "payment-123",
        sourceId: "source-123",
        externalReference: "order-123",
      },
    ],
  },
});

console.log(result);
```

Keep API keys in environment variables or a secret manager. The client sends the key as a Bearer token. `baseUrl` may be `https://api.reconify.com` or include `/v1`; the client appends `/v1` when it is not already present.

For a typed first-use walkthrough, see [Getting started](docs/getting-started.md). For ingestion and downstream workflows, see [Workflows](docs/workflows.md).

## Public API

Each module is available as a property on `ReconifyClient`:

| Module | Use it for |
| --- | --- |
| `client.ingestion` | Integrity event ingestion and isolated test events |
| `client.alerts` | Alert rules |
| `client.events` | Canonical events and audited field reveal |
| `client.issues` | Issue search, details, notes, resolution, and deliveries |
| `client.ledger` | Ledger sources, periods, and transactions |
| `client.reconciliations` | Sources, schedules, reconciliation runs, and status |
| `client.search` | Cross-resource integrity search |
| `client.setup` | Integrations, sources, and test sessions |
| `client.transactions` | Wallet transactions |
| `client.wallets` | Wallets and balances |

The complete operation and export list is in the [API reference](docs/api-reference.md). Import public classes, errors, and types from `@reconifyhq/sdk`; internal source paths are not part of the supported interface.

## Requests

Operations accept one typed argument object. Use `path`, `query`, `headers`, and `body` according to the operation's OpenAPI contract:

```ts
const event = await client.events.getEvent({
  path: { id: "event-123" },
});

const filtered = await client.events.listEvents({
  query: {
    source_id: "source-123",
    processing_status: "processed",
    limit: 25,
  },
});
```

Request-specific cancellation, timeout, and retry settings are passed through `request`:

```ts
const controller = new AbortController();

const events = await client.events.listEvents({
  query: { limit: 25 },
  request: {
    signal: controller.signal,
    timeoutMs: 10_000,
    retry: { maxAttempts: 2 },
  },
});

controller.abort();
```

The default timeout is 30 seconds. Retries apply to idempotent requests for `429`, `503`, and transient fetch failures. Configure client-wide defaults or opt into non-idempotent retries explicitly:

```ts
const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
  timeoutMs: 30_000,
  retry: {
    maxAttempts: 3,
    baseDelayMs: 250,
    maxDelayMs: 5_000,
    retryNonIdempotent: false,
  },
});
```

See [Request options](docs/request-options.md) for the complete request contract.

## Event ingestion

### Ingest integrity events

```ts
import type { IngestEventsInputBody } from "@reconifyhq/sdk";

const eventBatch: IngestEventsInputBody = {
  events: [
    {
      amountMinor: 1500,
      currency: "USD",
      eventType: "payment.succeeded",
      occurredAt: "2026-07-26T12:00:00Z",
      sourceEventId: "payment-123",
      sourceId: "source-123",
      externalReference: "order-123",
    },
  ],
};

const result = await client.ingestion.ingestIntegrityEvents({
  body: eventBatch,
});
```

The `events` array contains `PublicEvent` objects. Each event requires `amountMinor`, `currency`, `eventType`, `occurredAt`, `sourceEventId`, and `sourceId`; optional references and metadata can be added as needed. The endpoint validates and durably publishes the batch.

For isolated test data, create a test session first and pass the required `X-Integrity-Test-Session` header to `ingestIntegrityTestEvents`.

## Other workflows

### Work with a ledger

```ts
const sources = await client.ledger.listLedgerSources({
  query: { limit: 50 },
});

const transactions = await client.ledger.listTransactions({
  path: { id: "source-123" },
  query: { period_key: "2026-01", limit: 100 },
});
```

### Iterate cursor-paginated collections

```ts
for await (const event of client.events.iterateEvents({
  query: { limit: 100 },
})) {
  console.log(event.id);
}
```

Cursor iterators are currently provided for events, issues, and wallet transactions. Offset-paginated operations accept their typed `offset` and `limit` query parameters directly.

More examples are grouped in [Workflows](docs/workflows.md).

## Errors

API failures throw `ReconifyApiError`, which exposes the HTTP `status`, API `code`, optional `field`, parsed response `body`, and message:

```ts
import { ReconifyApiError } from "@reconifyhq/sdk";

try {
  await client.events.getEvent({ path: { id: "missing" } });
} catch (error) {
  if (error instanceof ReconifyApiError) {
    console.error(error.status, error.code, error.field, error.body);
  }
}
```

Timeouts throw `ReconifyTimeoutError`. Abort signals preserve the signal's cancellation reason.

## Alternate fetch implementations

Pass a compatible `fetch` implementation for tests, polyfilled runtimes, or custom HTTP behavior:

```ts
const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
  fetch: myFetch,
});
```

## Supported API boundary

The SDK intentionally excludes deep reconciliation adjustment, lifecycle, evidence, report-item, and signoff operations. They remain represented in the generated OpenAPI types for coverage checks but are not exposed through `ReconifyClient`. See the [API reference](docs/api-reference.md) for the exact boundary.

## Development

```sh
npm install
npm run typecheck
npm test
npm run build
npm run verify
```

The OpenAPI document is intentionally maintained outside this repository. To regenerate the typed source and verify API coverage, provide it externally:

```sh
RECONIFY_OPENAPI_SPEC=/path/to/reconify.openapi.json npm run generate
RECONIFY_OPENAPI_SPEC=/path/to/reconify.openapi.json npm run verify:openapi
```

`npm run verify` also checks the Context7 configuration, documentation links, and npm package contents.

## Release

Versions are bumped with npm's built-in tooling:

```sh
npm version patch   # or minor / major
git push --follow-tags
```

`npm version` runs the full verification suite before updating `package.json` and `package-lock.json`. A GitHub release from the resulting tag triggers `.github/workflows/publish.yml`, which builds, verifies, and publishes to npm with provenance.
