import fs from "node:fs";
import { excludedOperations, EXCLUDED_DEEP_RECONCILIATION_PATHS, publicOperations } from "../src/operations.js";
import { AlertsApi } from "../src/apis/alerts.js";
import { EventsApi } from "../src/apis/events.js";
import { IngestionApi } from "../src/apis/ingestion.js";
import { IssuesApi } from "../src/apis/issues.js";
import { LedgerApi } from "../src/apis/ledger.js";
import { ReconciliationsApi } from "../src/apis/reconciliations.js";
import { SearchApi } from "../src/apis/search.js";
import { SetupApi } from "../src/apis/setup.js";
import { TransactionsApi } from "../src/apis/transactions.js";
import { WalletsApi } from "../src/apis/wallets.js";

const specPath = process.env.RECONIFY_OPENAPI_SPEC;
if (!specPath) {
  throw new Error("Set RECONIFY_OPENAPI_SPEC to the external OpenAPI JSON path before checking coverage.");
}
const spec = JSON.parse(fs.readFileSync(specPath, "utf8")) as {
  paths: Record<string, Record<string, { operationId?: string }>>;
};
const methods = new Set(["get", "post", "put", "patch", "delete"]);
const key = (method: string, path: string) => `${method.toUpperCase()} ${path}`;

const allOperations = Object.entries(spec.paths).flatMap(([path, pathItem]) =>
  Object.entries(pathItem)
    .filter(([method, operation]) => methods.has(method) && operation.operationId)
    .map(([method, operation]) => ({ method: method.toUpperCase(), path, operationId: operation.operationId! })),
);
const expected = allOperations.filter(({ path }) => !EXCLUDED_DEEP_RECONCILIATION_PATHS.includes(path as never));
const actual = publicOperations.map(({ method, path }) => key(method, path));
const expectedKeys = expected.map(({ method, path }) => key(method, path));
const excludedKeys = excludedOperations.map(({ method, path }) => key(method, path));

const assertEqualSets = (label: string, left: string[], right: string[]) => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const missing = [...leftSet].filter((value) => !rightSet.has(value));
  const extra = [...rightSet].filter((value) => !leftSet.has(value));
  if (missing.length || extra.length) {
    throw new Error(`${label}: missing=[${missing.join(", ")}] extra=[${extra.join(", ")}]`);
  }
};

if (allOperations.length !== 62) throw new Error(`Expected 62 OpenAPI operations, found ${allOperations.length}`);
if (expected.length !== 50) throw new Error(`Expected 50 retained operations, found ${expected.length}`);
if (excludedKeys.length !== 12) throw new Error(`Expected 12 excluded operations, found ${excludedKeys.length}`);
assertEqualSets("OpenAPI coverage", expectedKeys, actual);
if (excludedKeys.some((operation) => actual.includes(operation))) {
  throw new Error("An excluded operation is present in the public operation registry");
}

const moduleConstructors = {
  alerts: AlertsApi,
  events: EventsApi,
  ingestion: IngestionApi,
  issues: IssuesApi,
  ledger: LedgerApi,
  reconciliations: ReconciliationsApi,
  search: SearchApi,
  setup: SetupApi,
  transactions: TransactionsApi,
  wallets: WalletsApi,
};
for (const operation of publicOperations) {
  const apiModule = moduleConstructors[operation.module as keyof typeof moduleConstructors];
  if (!apiModule || !Object.getOwnPropertyNames(apiModule.prototype).includes(operation.methodName)) {
    throw new Error(`Missing ${operation.module}.${operation.methodName}`);
  }
}
for (const operation of excludedOperations) {
  const methodName = operation.operationId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  if (Object.values(moduleConstructors).some((apiModule) => Object.getOwnPropertyNames(apiModule.prototype).includes(methodName))) {
    throw new Error(`Excluded API method ${methodName} is present`);
  }
}

const retainedReconciliationKeys = [
  "GET /integrity/sources",
  "GET /reconciliations",
  "POST /reconciliations",
  "GET /reconciliations/{id}",
  "GET /reconciliation-schedules",
  "POST /reconciliation-schedules",
  "DELETE /reconciliation-schedules/{id}",
  "GET /reconciliation-schedules/{id}",
  "PATCH /reconciliation-schedules/{id}",
];
for (const operation of retainedReconciliationKeys) {
  if (!actual.includes(operation)) throw new Error(`Missing retained reconciliation operation ${operation}`);
}

console.log(`OpenAPI coverage passed: ${expected.length} retained operations, ${excludedKeys.length} excluded operations.`);
