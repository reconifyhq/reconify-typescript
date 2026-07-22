# @reconify/sdk

Typed TypeScript client for the Reconify Public API.

```ts
import { ReconifyApiError, ReconifyClient } from "@reconify/sdk";

const client = new ReconifyClient({
  apiKey: "rk_...",
  baseUrl: "https://api.reconify.com",
});

const events = await client.events.listEvents({ query: { limit: 25 } });
```

The client appends `/v1` to `baseUrl` unless it already ends in `/v1`. A custom `fetch` implementation can be supplied for testing or alternate runtimes.

The SDK exposes 50 public operations. Deep reconciliation adjustment, lifecycle, evidence, report-item, and signoff operations are intentionally excluded. The OpenAPI document is intentionally maintained outside this repository and is only needed when regenerating the typed source.

## Requests

Every operation accepts typed path, query, header, and body parameters. Requests can be cancelled with `AbortSignal` and bounded with a per-request timeout:

```ts
const controller = new AbortController();

const events = await client.events.listEvents({
  query: { limit: 25 },
  request: { signal: controller.signal, timeoutMs: 10_000 },
});

controller.abort();
```

The default timeout is 30 seconds. Retries apply to idempotent requests for `429`, `503`, and transient fetch failures. Configure them explicitly when constructing the client; non-idempotent retries are opt-in:

```ts
const client = new ReconifyClient({
  apiKey: "rk_...",
  baseUrl: "https://api.reconify.com",
  retry: { maxAttempts: 3, baseDelayMs: 250, maxDelayMs: 5_000 },
});
```

Cursor-based collections provide async iterators, so callers can process every page naturally:

```ts
for await (const event of client.events.iterateEvents({ query: { limit: 100 } })) {
  console.log(event.id);
}
```

API failures are structured. `ReconifyApiError` exposes `status`, `code`, `field`, `details`, and the parsed response `body`:

```ts
try {
  await client.events.getEvent({ path: { id: "missing" } });
} catch (error) {
  if (error instanceof ReconifyApiError) {
    console.error(error.code, error.field, error.message);
  }
}
```

All public methods include generated JSDoc with their operation summary, parameter contract, and a usage example. API modules are exposed as named properties such as `client.events`, `client.reconciliations`, and `client.transactions` to keep operation names predictable.

## Development

```sh
npm install
npm run typecheck
npm test
npm run build
```

The OpenAPI document is intentionally not stored in this repository. To regenerate the typed source and verify coverage, provide it externally:

```sh
RECONIFY_OPENAPI_SPEC=/path/to/reconify.openapi.json npm run generate
RECONIFY_OPENAPI_SPEC=/path/to/reconify.openapi.json npm run verify:openapi
```

## Release

Versions are bumped with npm's built-in tooling — no extra dependency required:

```sh
npm version patch   # or minor / major
git push --follow-tags
```

`npm version` runs `preversion` (the full `verify` suite) before touching anything, then bumps `package.json` and `package-lock.json`, and creates a `vX.Y.Z` commit and tag. Pushing the tag alone does **not** publish anything — create a GitHub release from that tag (or run `gh release create vX.Y.Z --generate-notes`) to trigger `.github/workflows/publish.yml`, which builds, verifies, and publishes to npm with provenance.

The package is published from a GitHub release by `.github/workflows/publish.yml`. Configure an npm automation token as the repository environment secret `NPM_TOKEN`; the workflow uses npm provenance and never stores API credentials.
