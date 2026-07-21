import type { operations } from "./openapi-types.js";

export const EXCLUDED_DEEP_RECONCILIATION_PATHS = [
  "/reconciliations/{id}/adjustments",
  "/reconciliations/{id}/adjustments/{adjustment_id}",
  "/reconciliations/{id}/close",
  "/reconciliations/{id}/reopen",
  "/reconciliations/{id}/evidence",
  "/reconciliations/{id}/evidence/{evidence_id}",
  "/reconciliations/{id}/reports/reconciliation/items",
  "/reconciliations/{id}/signoffs",
  "/reconciliations/{id}/signoffs/{role}",
] as const;

export const publicOperations = [
  {"method":"GET","path":"/alerts/rules","operationId":"list-alert-rules","methodName":"listAlertRules","tag":"Alerts","requiresArgs":false},
  {"method":"PUT","path":"/alerts/rules","operationId":"put-alert-rule","methodName":"putAlertRule","tag":"Alerts","requiresArgs":true},
  {"method":"GET","path":"/events","operationId":"list-events","methodName":"listEvents","tag":"Events","requiresArgs":false},
  {"method":"GET","path":"/events/{id}","operationId":"get-event","methodName":"getEvent","tag":"Events","requiresArgs":true},
  {"method":"GET","path":"/events/{id}/reveal","operationId":"reveal-event-field","methodName":"revealEventField","tag":"Events","requiresArgs":true},
  {"method":"POST","path":"/integrity/events","operationId":"ingest-integrity-events","methodName":"ingestIntegrityEvents","tag":"Ingestion","requiresArgs":true},
  {"method":"GET","path":"/integrity/sources","operationId":"list-integrity-sources-for-reconciliation","methodName":"listIntegritySourcesForReconciliation","tag":"Reconciliations","requiresArgs":false},
  {"method":"POST","path":"/integrity/test-events","operationId":"ingest-integrity-test-events","methodName":"ingestIntegrityTestEvents","tag":"Ingestion","requiresArgs":true},
  {"method":"GET","path":"/issues","operationId":"list-issues","methodName":"listIssues","tag":"Issues","requiresArgs":false},
  {"method":"GET","path":"/issues/summary","operationId":"get-issue-summary","methodName":"getIssueSummary","tag":"Issues","requiresArgs":false},
  {"method":"GET","path":"/issues/{id}","operationId":"get-issue","methodName":"getIssue","tag":"Issues","requiresArgs":true},
  {"method":"PATCH","path":"/issues/{id}","operationId":"update-issue","methodName":"updateIssue","tag":"Issues","requiresArgs":true},
  {"method":"GET","path":"/issues/{id}/deliveries","operationId":"list-issue-deliveries","methodName":"listIssueDeliveries","tag":"Issues","requiresArgs":true},
  {"method":"POST","path":"/issues/{id}/deliveries/{deliveryId}/retry","operationId":"retry-issue-delivery","methodName":"retryIssueDelivery","tag":"Issues","requiresArgs":true},
  {"method":"POST","path":"/issues/{id}/notes","operationId":"add-issue-note","methodName":"addIssueNote","tag":"Issues","requiresArgs":true},
  {"method":"POST","path":"/issues/{id}/resolve","operationId":"resolve-issue","methodName":"resolveIssue","tag":"Issues","requiresArgs":true},
  {"method":"GET","path":"/ledger/sources","operationId":"list-ledger-sources","methodName":"listLedgerSources","tag":"Ledger","requiresArgs":false},
  {"method":"POST","path":"/ledger/sources","operationId":"create-ledger-source","methodName":"createLedgerSource","tag":"Ledger","requiresArgs":true},
  {"method":"DELETE","path":"/ledger/sources/{id}","operationId":"delete-ledger-source","methodName":"deleteLedgerSource","tag":"Ledger","requiresArgs":true},
  {"method":"GET","path":"/ledger/sources/{id}","operationId":"get-ledger-source","methodName":"getLedgerSource","tag":"Ledger","requiresArgs":true},
  {"method":"PATCH","path":"/ledger/sources/{id}","operationId":"update-ledger-source","methodName":"updateLedgerSource","tag":"Ledger","requiresArgs":true},
  {"method":"GET","path":"/ledger/sources/{id}/periods","operationId":"list-source-periods","methodName":"listSourcePeriods","tag":"Ledger","requiresArgs":true},
  {"method":"GET","path":"/ledger/sources/{id}/transactions","operationId":"list-transactions","methodName":"listTransactions","tag":"Ledger","requiresArgs":true},
  {"method":"POST","path":"/ledger/sources/{id}/transactions","operationId":"ingest-transactions","methodName":"ingestTransactions","tag":"Ledger","requiresArgs":true},
  {"method":"GET","path":"/reconciliation-schedules","operationId":"list-reconciliation-schedules","methodName":"listReconciliationSchedules","tag":"Reconciliations","requiresArgs":false},
  {"method":"POST","path":"/reconciliation-schedules","operationId":"create-reconciliation-schedule","methodName":"createReconciliationSchedule","tag":"Reconciliations","requiresArgs":true},
  {"method":"DELETE","path":"/reconciliation-schedules/{id}","operationId":"delete-reconciliation-schedule","methodName":"deleteReconciliationSchedule","tag":"Reconciliations","requiresArgs":true},
  {"method":"GET","path":"/reconciliation-schedules/{id}","operationId":"get-reconciliation-schedule","methodName":"getReconciliationSchedule","tag":"Reconciliations","requiresArgs":true},
  {"method":"PATCH","path":"/reconciliation-schedules/{id}","operationId":"update-reconciliation-schedule","methodName":"updateReconciliationSchedule","tag":"Reconciliations","requiresArgs":true},
  {"method":"GET","path":"/reconciliations","operationId":"list-reconciliations","methodName":"listReconciliations","tag":"Reconciliations","requiresArgs":false},
  {"method":"POST","path":"/reconciliations","operationId":"create-reconciliation","methodName":"createReconciliation","tag":"Reconciliations","requiresArgs":true},
  {"method":"GET","path":"/reconciliations/{id}","operationId":"get-reconciliation","methodName":"getReconciliation","tag":"Reconciliations","requiresArgs":true},
  {"method":"GET","path":"/search","operationId":"search-integrity-resources","methodName":"searchIntegrityResources","tag":"Search","requiresArgs":false},
  {"method":"GET","path":"/setup/integrations","operationId":"list-setup-integrations","methodName":"listSetupIntegrations","tag":"Setup","requiresArgs":false},
  {"method":"GET","path":"/setup/integrations/{id}","operationId":"get-setup-integration","methodName":"getSetupIntegration","tag":"Setup","requiresArgs":true},
  {"method":"GET","path":"/setup/sources","operationId":"list-setup-sources","methodName":"listSetupSources","tag":"Setup","requiresArgs":false},
  {"method":"POST","path":"/setup/sources","operationId":"create-setup-source","methodName":"createSetupSource","tag":"Setup","requiresArgs":true},
  {"method":"DELETE","path":"/setup/sources/{id}","operationId":"disable-setup-source","methodName":"disableSetupSource","tag":"Setup","requiresArgs":true},
  {"method":"GET","path":"/setup/sources/{id}","operationId":"get-setup-source","methodName":"getSetupSource","tag":"Setup","requiresArgs":true},
  {"method":"PATCH","path":"/setup/sources/{id}","operationId":"update-setup-source","methodName":"updateSetupSource","tag":"Setup","requiresArgs":true},
  {"method":"POST","path":"/setup/test-sessions","operationId":"create-test-session","methodName":"createTestSession","tag":"Setup","requiresArgs":true},
  {"method":"GET","path":"/setup/test-sessions/{id}","operationId":"get-test-session","methodName":"getTestSession","tag":"Setup","requiresArgs":true},
  {"method":"GET","path":"/setup/test-sessions/{id}/result","operationId":"get-test-session-result","methodName":"getTestSessionResult","tag":"Setup","requiresArgs":true},
  {"method":"POST","path":"/setup/test-sessions/{id}/retry","operationId":"retry-test-session","methodName":"retryTestSession","tag":"Setup","requiresArgs":true},
  {"method":"POST","path":"/setup/test-sessions/{id}/submit","operationId":"submit-test-session-events","methodName":"submitTestSessionEvents","tag":"Setup","requiresArgs":true},
  {"method":"GET","path":"/transactions","operationId":"list-wallet-transactions","methodName":"listWalletTransactions","tag":"Transactions","requiresArgs":false},
  {"method":"GET","path":"/transactions/{id}","operationId":"get-wallet-transaction","methodName":"getWalletTransaction","tag":"Transactions","requiresArgs":true},
  {"method":"GET","path":"/wallets","operationId":"list-wallets","methodName":"listWallets","tag":"Wallets","requiresArgs":false},
  {"method":"GET","path":"/wallets/{id}","operationId":"get-wallet","methodName":"getWallet","tag":"Wallets","requiresArgs":true},
  {"method":"GET","path":"/wallets/{id}/balance","operationId":"get-wallet-balance","methodName":"getWalletBalance","tag":"Wallets","requiresArgs":true},
] as const satisfies readonly PublicOperation[];

export const excludedOperations = [
  {"method":"GET","path":"/reconciliations/{id}/adjustments","operationId":"list-reconciliation-adjustments"},
  {"method":"POST","path":"/reconciliations/{id}/adjustments","operationId":"create-reconciliation-adjustment"},
  {"method":"GET","path":"/reconciliations/{id}/adjustments/{adjustment_id}","operationId":"get-reconciliation-adjustment"},
  {"method":"POST","path":"/reconciliations/{id}/close","operationId":"close-reconciliation"},
  {"method":"GET","path":"/reconciliations/{id}/evidence","operationId":"list-reconciliation-evidence"},
  {"method":"POST","path":"/reconciliations/{id}/evidence","operationId":"create-reconciliation-evidence"},
  {"method":"GET","path":"/reconciliations/{id}/evidence/{evidence_id}","operationId":"get-reconciliation-evidence"},
  {"method":"POST","path":"/reconciliations/{id}/reopen","operationId":"reopen-reconciliation"},
  {"method":"GET","path":"/reconciliations/{id}/reports/reconciliation/items","operationId":"list-reconciliation-items"},
  {"method":"GET","path":"/reconciliations/{id}/signoffs","operationId":"list-reconciliation-signoffs"},
  {"method":"DELETE","path":"/reconciliations/{id}/signoffs/{role}","operationId":"delete-reconciliation-signoff"},
  {"method":"PUT","path":"/reconciliations/{id}/signoffs/{role}","operationId":"upsert-reconciliation-signoff"},
] as const;

export interface PublicOperation {
  readonly method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly path: string;
  readonly operationId: keyof operations & string;
  readonly methodName: string;
  readonly tag: string;
  readonly requiresArgs: boolean;
}

export type PublicOperationId = (typeof publicOperations)[number]["operationId"];
export type PublicMethodName = (typeof publicOperations)[number]["methodName"];
