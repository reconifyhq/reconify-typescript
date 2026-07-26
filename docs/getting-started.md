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

## Ingest your first event

The primary SDK workflow is submitting a typed batch of integrity events:

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

The `events` array contains `PublicEvent` objects. Each event requires `amountMinor`, `currency`, `eventType`, `occurredAt`, `sourceEventId`, and `sourceId`. Use `ingestIntegrityTestEvents` with the required test-session header for isolated test data.

Every operation is grouped by resource and receives one typed argument object. For example, read an event after ingestion with:

```ts
const event = await client.events.getEvent({
  path: { id: "event-123" },
});
```

The public modules are `ingestion`, `alerts`, `events`, `issues`, `ledger`, `reconciliations`, `search`, `setup`, `transactions`, and `wallets`.

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
