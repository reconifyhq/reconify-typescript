# API reference

The package's supported entrypoint is `@reconifyhq/sdk`. Event ingestion is the primary workflow. Every public operation has an example below; replace placeholder IDs and input values with values from your application.

## Ingestion

Use a typed `IngestEventsInputBody` containing required `PublicEvent` fields:

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
```

| Operation | Example |
| --- | --- |
| `ingestIntegrityEvents` | `await client.ingestion.ingestIntegrityEvents({ body: eventBatch });` |
| `ingestIntegrityTestEvents` | `await client.ingestion.ingestIntegrityTestEvents({ headers: { "X-Integrity-Test-Session": sessionId }, body: eventBatch });` |

## Alerts

| Operation | Example |
| --- | --- |
| `listAlertRules` | `await client.alerts.listAlertRules({ query: { limit: 25 } });` |
| `putAlertRule` | `await client.alerts.putAlertRule({ body: alertRule });` |

## Events

| Operation | Example |
| --- | --- |
| `listEvents` | `await client.events.listEvents({ query: { limit: 25 } });` |
| `getEvent` | `await client.events.getEvent({ path: { id: "event-123" } });` |
| `revealEventField` | `await client.events.revealEventField({ path: { id: "event-123" }, query: { field: "amount" } });` |

The cursor helper is an async iterator rather than an API operation:

```ts
for await (const event of client.events.iterateEvents({ query: { limit: 100 } })) {
  console.log(event.id);
}
```

## Issues

| Operation | Example |
| --- | --- |
| `listIssues` | `await client.issues.listIssues({ query: { limit: 25 } });` |
| `getIssueSummary` | `await client.issues.getIssueSummary();` |
| `getIssue` | `await client.issues.getIssue({ path: { id: "issue-123" } });` |
| `updateIssue` | `await client.issues.updateIssue({ path: { id: "issue-123" }, body: issueUpdate });` |
| `listIssueDeliveries` | `await client.issues.listIssueDeliveries({ path: { id: "issue-123" } });` |
| `retryIssueDelivery` | `await client.issues.retryIssueDelivery({ path: { id: "issue-123", deliveryId: "delivery-123" } });` |
| `addIssueNote` | `await client.issues.addIssueNote({ path: { id: "issue-123" }, body: note });` |
| `resolveIssue` | `await client.issues.resolveIssue({ path: { id: "issue-123" }, body: resolution });` |

The cursor helper is an async iterator rather than an API operation:

```ts
for await (const issue of client.issues.iterateIssues({ query: { limit: 100 } })) {
  console.log(issue.id);
}
```

## Ledger

| Operation | Example |
| --- | --- |
| `listLedgerSources` | `await client.ledger.listLedgerSources({ query: { limit: 25 } });` |
| `createLedgerSource` | `await client.ledger.createLedgerSource({ body: sourceInput });` |
| `deleteLedgerSource` | `await client.ledger.deleteLedgerSource({ path: { id: "source-123" } });` |
| `getLedgerSource` | `await client.ledger.getLedgerSource({ path: { id: "source-123" } });` |
| `updateLedgerSource` | `await client.ledger.updateLedgerSource({ path: { id: "source-123" }, body: sourceUpdate });` |
| `listSourcePeriods` | `await client.ledger.listSourcePeriods({ path: { id: "source-123" } });` |
| `listTransactions` | `await client.ledger.listTransactions({ path: { id: "source-123" }, query: { period_key: "2026-01", limit: 100 } });` |
| `ingestTransactions` | `await client.ledger.ingestTransactions({ path: { id: "source-123" }, body: transactionBatch });` |

## Reconciliations

| Operation | Example |
| --- | --- |
| `listIntegritySourcesForReconciliation` | `await client.reconciliations.listIntegritySourcesForReconciliation();` |
| `listReconciliationSchedules` | `await client.reconciliations.listReconciliationSchedules({ query: { limit: 25 } });` |
| `createReconciliationSchedule` | `await client.reconciliations.createReconciliationSchedule({ body: schedule });` |
| `deleteReconciliationSchedule` | `await client.reconciliations.deleteReconciliationSchedule({ path: { id: "schedule-123" } });` |
| `getReconciliationSchedule` | `await client.reconciliations.getReconciliationSchedule({ path: { id: "schedule-123" } });` |
| `updateReconciliationSchedule` | `await client.reconciliations.updateReconciliationSchedule({ path: { id: "schedule-123" }, body: scheduleUpdate });` |
| `listReconciliations` | `await client.reconciliations.listReconciliations({ query: { status: "completed", limit: 25 } });` |
| `createReconciliation` | `await client.reconciliations.createReconciliation({ body: reconciliationInput });` |
| `getReconciliation` | `await client.reconciliations.getReconciliation({ path: { id: "reconciliation-123" } });` |

## Search

| Operation | Example |
| --- | --- |
| `searchIntegrityResources` | `await client.search.searchIntegrityResources({ query: { q: "invoice-123" } });` |

## Setup

| Operation | Example |
| --- | --- |
| `listSetupIntegrations` | `await client.setup.listSetupIntegrations();` |
| `getSetupIntegration` | `await client.setup.getSetupIntegration({ path: { id: "integration-123" } });` |
| `listSetupSources` | `await client.setup.listSetupSources({ query: { limit: 25 } });` |
| `createSetupSource` | `await client.setup.createSetupSource({ body: setupSource });` |
| `disableSetupSource` | `await client.setup.disableSetupSource({ path: { id: "source-123" } });` |
| `getSetupSource` | `await client.setup.getSetupSource({ path: { id: "source-123" } });` |
| `updateSetupSource` | `await client.setup.updateSetupSource({ path: { id: "source-123" }, body: setupSourceUpdate });` |
| `createTestSession` | `await client.setup.createTestSession({ body: testSession });` |
| `getTestSession` | `await client.setup.getTestSession({ path: { id: "session-123" } });` |
| `getTestSessionResult` | `await client.setup.getTestSessionResult({ path: { id: "session-123" } });` |
| `retryTestSession` | `await client.setup.retryTestSession({ path: { id: "session-123" } });` |
| `submitTestSessionEvents` | `await client.setup.submitTestSessionEvents({ path: { id: "session-123" }, headers: { "X-Integrity-Test-Session": "session-123" }, body: eventBatch });` |

## Wallet transactions

| Operation | Example |
| --- | --- |
| `listWalletTransactions` | `await client.transactions.listWalletTransactions({ query: { limit: 25 } });` |
| `getWalletTransaction` | `await client.transactions.getWalletTransaction({ path: { id: "transaction-123" } });` |

The cursor helper is an async iterator rather than an API operation:

```ts
for await (const transaction of client.transactions.iterateWalletTransactions({ query: { limit: 100 } })) {
  console.log(transaction.id);
}
```

## Wallets

| Operation | Example |
| --- | --- |
| `listWallets` | `await client.wallets.listWallets({ query: { limit: 25 } });` |
| `getWallet` | `await client.wallets.getWallet({ path: { id: "wallet-123" } });` |
| `getWalletBalance` | `await client.wallets.getWalletBalance({ path: { id: "wallet-123" } });` |

## Exported types and classes

The package exports:

- `ReconifyClient`;
- `ReconifyApiError` and `ReconifyTimeoutError`;
- API classes for each module;
- `RequestParams`, `ResponseBody`, `ReconifyClientOptions`, `FetchLike`, and `OperationId`;
- generated model types such as `Event`, `Issue`, `Transaction`, `Wallet`, `Reconciliation`, and their response/page types;
- `PublicOperation`, `PublicOperationId`, `publicOperations`, and `operationById` for operation metadata.

Every method also accepts the common `request` controls described in [Request options](request-options.md).

## Excluded operations

The OpenAPI source includes 12 deep reconciliation operations that are intentionally not part of the public client:

- reconciliation adjustments;
- reconciliation close and reopen lifecycle actions;
- reconciliation evidence;
- reconciliation report items;
- reconciliation signoffs.

These operations remain available to coverage checks through generated OpenAPI types, but no corresponding public client methods are exposed.
