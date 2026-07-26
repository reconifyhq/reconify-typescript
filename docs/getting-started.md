# Getting started

## Install

```sh
npm install @reconifyhq/sdk
```

The SDK requires Node.js 18 or newer. It uses the platform `fetch` API by default.

## Configure a client

```ts
import { ReconifyClient } from "@reconifyhq/sdk";

const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
});
```

The API key is sent as `Authorization: Bearer <apiKey>`. Store it in an environment variable or secret manager; never commit it to source control.

The client normalizes the base URL by removing trailing slashes and appending `/v1` unless the URL already ends in `/v1`:

```ts
new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com/v1/",
});
```

## Make a request

Each operation is grouped by resource and receives one typed argument object:

```ts
const event = await client.events.getEvent({
  path: { id: "event-123" },
});

const page = await client.events.listEvents({
  query: { source_id: "source-123", limit: 25 },
});
```

The public modules are `alerts`, `events`, `ingestion`, `issues`, `ledger`, `reconciliations`, `search`, `setup`, `transactions`, and `wallets`.

## Use generated types

Import exported model types and generic request/response types from the package entrypoint:

```ts
import type {
  EventPage,
  RequestParams,
  ResponseBody,
} from "@reconifyhq/sdk";

const params: RequestParams<"list-events"> = {
  query: { limit: 25 },
};

const page: ResponseBody<"list-events"> = await client.events.listEvents(params);
const typedPage: EventPage = page;
```

For request controls and failure handling, continue with [Request options](request-options.md). For resource-specific examples, see [Workflows](workflows.md).
