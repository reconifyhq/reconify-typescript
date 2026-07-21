# @reconify/sdk

Typed TypeScript client for the Reconify Public API.

```ts
import { ReconifyClient } from "@reconify/sdk";

const client = new ReconifyClient({
  apiKey: "rk_...",
  baseUrl: "https://api.reconify.com",
});

const events = await client.listEvents({ query: { limit: 25 } });
```

The client appends `/v1` to `baseUrl` unless it already ends in `/v1`. A custom `fetch` implementation can be supplied for testing or alternate runtimes.

The SDK exposes 50 public operations. Deep reconciliation adjustment, lifecycle, evidence, report-item, and signoff operations are intentionally excluded. The complete OpenAPI document is stored in `openapi/reconify.openapi.json`.

## Development

```sh
npm install
npm run generate
npm run check-generated
npm run typecheck
npm run coverage
npm test
npm run build
```

The package is published from a GitHub release by `.github/workflows/publish.yml`. Configure an npm automation token as the repository environment secret `NPM_TOKEN`; the workflow uses npm provenance and never stores API credentials.
