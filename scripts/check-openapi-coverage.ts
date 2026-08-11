import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publicOperations } from "../src/operations.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = process.env.RECONIFY_OPENAPI_SPEC ?? path.join(root, ".contract", "reconify.openapi.json");
if (!fs.existsSync(specPath)) {
  throw new Error("OpenAPI contract not found at " + specPath + ". Run npm run fetch-contract first.");
}

const spec = JSON.parse(fs.readFileSync(specPath, "utf8")) as {
  openapi?: string;
  paths?: Record<string, Record<string, { operationId?: string }>>;
};
if (spec.openapi !== "3.1.0") throw new Error("Expected OpenAPI 3.1.0, found " + (spec.openapi ?? "missing"));

const methods = new Set(["get", "post", "put", "patch", "delete"]);
const key = (method: string, route: string) => method.toUpperCase() + " " + route;
const allOperations = Object.entries(spec.paths ?? {}).flatMap(([route, pathItem]) =>
  Object.entries(pathItem)
    .filter(([method, operation]) => methods.has(method) && operation.operationId)
    .map(([method, operation]) => ({ method: method.toUpperCase(), route, operationId: operation.operationId! })),
);
const expected = allOperations.map(({ method, route }) => key(method, route));
const actual = publicOperations.map(({ method, path: route }) => key(method, route));

const assertEqualSets = (label: string, left: string[], right: string[]) => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const missing = [...leftSet].filter((value) => !rightSet.has(value));
  const extra = [...rightSet].filter((value) => !leftSet.has(value));
  if (missing.length || extra.length) {
    throw new Error(label + ": missing=[" + missing.join(", ") + "] extra=[" + extra.join(", ") + "]");
  }
};

const assertUnique = (label: string, values: string[]) => {
  if (new Set(values).size !== values.length) throw new Error(label + " contains duplicates");
};

if (allOperations.some(({ route }) => route.startsWith("/business/"))) {
  throw new Error("The public SDK contract must not contain internal /business routes");
}
assertUnique("OpenAPI operations", expected);
assertUnique("OpenAPI operation IDs", allOperations.map(({ operationId }) => operationId));
assertUnique("SDK operations", actual);
assertUnique("SDK operation IDs", publicOperations.map(({ operationId }) => operationId));
assertEqualSets("OpenAPI coverage", expected, actual);

const modulePaths = new Set(["metadata", "events", "ingestion", "issues", "organization"]);
for (const operation of publicOperations) {
  if (!modulePaths.has(operation.module)) throw new Error("Unsupported SDK module " + operation.module);
}

console.log("OpenAPI coverage passed: " + expected.length + " public operations.");
