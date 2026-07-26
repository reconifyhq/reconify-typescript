# Workflows

All examples assume a configured client:

```ts
import { ReconifyClient } from "@reconifyhq/sdk";

const client = new ReconifyClient({
  apiKey: process.env.RECONIFY_API_KEY!,
  baseUrl: "https://api.reconify.com",
});
```

## Ingest integrity events

```ts
import type { RequestParams } from "@reconifyhq/sdk";

const eventBatch: RequestParams<"ingest-integrity-events">["body"] = {
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

The `events` array contains `PublicEvent` objects. Each event requires `amountMinor`, `currency`, `eventType`, `occurredAt`, `sourceEventId`, and `sourceId`; optional references and metadata can be added as needed. For isolated test data, use `client.setup.createTestSession`, then submit events with `client.setup.submitTestSessionEvents` and its required test-session header.

## Manage ledger sources and transactions

```ts
const sources = await client.ledger.listLedgerSources({
  query: { limit: 50 },
});

const transactions = await client.ledger.listTransactions({
  path: { id: "source-123" },
  query: { period_key: "2026-01", limit: 100 },
});
```

Create or update sources with `createLedgerSource` and `updateLedgerSource`. Push transactions with `ingestTransactions`, which accepts the source ID in `path.id` and a typed JSON body.

## Run and inspect reconciliations

```ts
const availableSources = await client.reconciliations.listIntegritySourcesForReconciliation();

const runs = await client.reconciliations.listReconciliations({
  query: { status: "completed", limit: 25 },
});

const reconciliation = await client.reconciliations.getReconciliation({
  path: { id: "reconciliation-123" },
});
```

Schedules are managed with `listReconciliationSchedules`, `createReconciliationSchedule`, `getReconciliationSchedule`, `updateReconciliationSchedule`, and `deleteReconciliationSchedule`. The public client intentionally does not expose deep adjustment, lifecycle, evidence, report-item, or signoff operations.

## Investigate issues

```ts
for await (const issue of client.issues.iterateIssues({
  query: { limit: 100 },
})) {
  console.log(issue.id, issue.status);
}

const summary = await client.issues.getIssueSummary();
const detail = await client.issues.getIssue({ path: { id: "issue-123" } });
```

Use `updateIssue`, `addIssueNote`, `resolveIssue`, `listIssueDeliveries`, and `retryIssueDelivery` for issue workflows.

## Setup and test sessions

Use the `setup` module to discover integrations and manage integrity sources:

```ts
const integrations = await client.setup.listSetupIntegrations();
const sources = await client.setup.listSetupSources({
  query: { limit: 25 },
});
```

Test sessions use `createTestSession`, `getTestSession`, `getTestSessionResult`, `retryTestSession`, and `submitTestSessionEvents`.

## Wallets and search

```ts
const wallets = await client.wallets.listWallets({
  query: { limit: 25 },
});

const balance = await client.wallets.getWalletBalance({
  path: { id: "wallet-123" },
});

const results = await client.search.searchIntegrityResources({
  query: { q: "invoice-123" },
});
```

Wallet transaction pages can be traversed with `client.transactions.iterateWalletTransactions`.
