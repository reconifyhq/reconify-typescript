# Reconify TypeScript SDK agent guide

This repository publishes @reconifyhq/sdk, a typed client for the public
Reconify /v2 API.

## Contract authority

The SaaS Go API owns the contract. Use the public docs manifest and versioned
artifact with npm run fetch-contract or npm run sync-contract.

For local SaaS work, set RECONIFY_OPENAPI_SPEC to an explicit OpenAPI JSON
file. Do not use sibling repositories or absolute workspace paths.

Generated files are src/openapi-types.ts, src/models.ts, src/operations.ts,
and src/apis/*.ts. Edit the generator or ergonomic transport/client code
instead of hand-editing generated output.

## Supported surface

The SDK exposes only the current public operations for metadata, events,
ingestion, issues, and organization reads. Internal /business/v1 routes and
the former ledger, wallet, setup, search, alert, and reconciliation surface
are not public SDK APIs.

## Verification

Run npm run verify, npm run verify:openapi, and npm run release-check before
releasing. Keep operation coverage exact, keep credentials out of errors and
logs, and update examples and migration notes when the public contract
changes.
