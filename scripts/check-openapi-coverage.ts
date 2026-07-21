import fs from "node:fs";
import { excludedOperations, EXCLUDED_DEEP_RECONCILIATION_PATHS, publicOperations } from "../src/operations.js";
import { ReconifyClient } from "../src/client.js";

const spec = JSON.parse(fs.readFileSync("openapi/reconify.openapi.json", "utf8")) as {
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

const methodNames = new Set(Object.getOwnPropertyNames(ReconifyClient.prototype));
for (const operation of publicOperations) {
  if (!methodNames.has(operation.methodName)) throw new Error(`Missing client method ${operation.methodName}`);
}
for (const operation of excludedOperations) {
  const methodName = operation.operationId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  if (methodNames.has(methodName)) throw new Error(`Excluded client method ${methodName} is present`);
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
