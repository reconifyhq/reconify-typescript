# @reconifyhq/sdk

Typed TypeScript client for the public Reconify v1 API.

## Quickstart

Install the package:

    npm install @reconifyhq/sdk

Create a client with an API key. The key and URL can also come from
RECONIFY_API_KEY and RECONIFY_API_URL.

    import { ReconifyClient } from "@reconifyhq/sdk";

    const client = new ReconifyClient({ apiKey: "rk_..." });
    const events = await client.events.listEvents({ query: { limit: 25 } });

The default URL is https://api.reconifyhq.com/v1. A base URL ending in /v1 is
also accepted. The SDK never accepts internal /business/v1 routes.

## Public modules

The client exposes metadata, events, ingestion, issues, and organization
modules. The public contract currently contains 13 operations. All operation
parameters and response types are derived from the versioned OpenAPI contract.

Cursor-paginated event and issue collections provide async iterators:

    for await (const event of client.events.iterateEvents({ query: { limit: 100 } })) {
      console.log(event.id);
    }

Requests support AbortSignal, per-request timeouts, custom headers, and
bounded retries. GET requests retry transient 429, 503, and transport failures
by default. Unsafe retries require explicit configuration. Ingestion retries
should use stable event IDs.

API failures raise ReconifyApiError with status, code, field, details, body,
and the original response. Timeout failures raise ReconifyTimeoutError.

## Development and contract synchronization

    npm ci
    npm run verify
    npm run fetch-contract
    npm run sync-contract
    npm run verify:openapi

The default contract comes from the public docs manifest at
https://docs.reconifyhq.com/openapi/manifest.json. For local SaaS changes,
set RECONIFY_OPENAPI_SPEC to an explicit OpenAPI JSON file.

Generated files include src/openapi-types.ts, src/models.ts,
src/operations.ts, and src/apis/*.ts. Change the generator or handwritten
transport/client layer instead of editing generated files directly.

## Migration from 0.x

Version 1.0.0 targets the current public monitoring and issue-investigation
API. The former ledger, wallet, setup, search, alert, and reconciliation
methods are not part of the public contract and are removed. See
UPGRADING.md for the migration boundary.

## Release

Use npm version major, minor, or patch only after npm run release-check passes.
Publishing is performed by the GitHub release workflow with npm provenance.
