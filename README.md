# @reconifyhq/sdk

Typed TypeScript client for the public Reconify v2 API.

## Quickstart

```sh
npm install @reconifyhq/sdk
```

```ts
import { ReconifyClient } from "@reconifyhq/sdk";

const client = new ReconifyClient({ apiKey: "rk_..." });
const events = await client.events.listEvents({ query: { limit: 25 } });
```

The API key and URL can also come from `RECONIFY_API_KEY` and
`RECONIFY_API_URL`. The default URL is `https://api.reconifyhq.com/v2`; a base
URL ending in `/v2` is also accepted. The SDK never accepts internal
`/business/v1` routes.

## Public modules

The current public contract contains exactly 14 operations:

| Module | Operations |
| --- | --- |
| `client.metadata` | API information and health |
| `client.events` | List events, get an event, and list issue events |
| `client.ingestion` | Submit monitoring events and register on-chain evidence sources |
| `client.issues` | List/get/update issues and manage notes |
| `client.organization` | Get organization and list members |

All operation parameters and response types are derived from the versioned
OpenAPI contract. The v2 release renames generated operation IDs and
machine-friendly tags while keeping resource behavior unchanged; see
[UPGRADING.md](UPGRADING.md).

## Requests and resilience

Operations accept one typed argument object using `path`, `query`, `headers`,
and `body` as defined by OpenAPI. Requests support `AbortSignal`, per-request
timeouts, custom headers, and bounded retries. GET requests retry transient
`429`, `503`, and transport failures by default; unsafe retries require
explicit configuration. Ingestion retries should use stable event IDs.

Cursor-paginated event and issue collections provide async iterators:

```ts
for await (const event of client.events.iterateEvents({ query: { limit: 100 } })) {
  console.log(event.id);
}
```

API failures raise `ReconifyApiError` with status, code, field, details, body,
and the original response. Timeout failures raise `ReconifyTimeoutError`.

## Development and contract synchronization

```sh
npm ci
npm run verify
npm run fetch-contract
npm run sync-contract
npm run verify:openapi
```

The default contract comes from the public docs manifest at
<https://docs.reconifyhq.com/openapi/manifest.json>. For local SaaS changes,
set `RECONIFY_OPENAPI_SPEC` to an explicit OpenAPI JSON file. The SDK never
depends on another checkout or an absolute workspace path.

Generated files include `src/openapi-types.ts`, `src/models.ts`,
`src/operations.ts`, and `src/apis/*.ts`. Change the generator or handwritten
transport/client layer instead of editing generated files directly.

For the typed first-use walkthrough and request examples, see
[Getting started](docs/getting-started.md), [Request options](docs/request-options.md),
and [Workflows](docs/workflows.md).

To register an on-chain evidence source for an accepted monitoring event, use a
stable idempotency key:

```ts
const source = await client.ingestion.registerOnchainSource({
  headers: { "Idempotency-Key": "source-order-123" },
  body: {
    flow: "payment_to_wallet",
    kind: "transaction",
    operation_reference: "order-123",
    source_event_id: "event-123",
    locator: { network: "ethereum-mainnet", transaction_reference: "0x..." },
  },
});
```

## Release

Use `npm version major`, `minor`, or `patch` only after `npm run verify` and
`npm run verify:openapi` pass. Publishing is performed by the GitHub release
workflow with npm provenance. Additive contract changes require a minor SDK
release; SDK fixes require a patch release; breaking public API changes require
a new API version and SDK major release.
