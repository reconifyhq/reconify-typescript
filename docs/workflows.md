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

const request: RequestParams<"ingest-integrity-events"> = {
  body: eventBatch,
};

const result = await client.ingestion.ingestIntegrityEvents(request);
```

`eventBatch` must satisfy the generated `IngestEventsInputBody` contract. For isolated test data, use `client.setup.createTestSession`, then submit events with `client.setup.submitTestSessionEvents` and its required test-session header.

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
