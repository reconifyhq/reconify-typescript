import fs from "node:fs";

const specPath = process.env.RECONIFY_OPENAPI_SPEC ?? process.argv[2];
if (!specPath) {
  throw new Error("Set RECONIFY_OPENAPI_SPEC to the external OpenAPI JSON path before generating.");
}

const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const excludedPaths = new Set([
  "/reconciliations/{id}/adjustments",
  "/reconciliations/{id}/adjustments/{adjustment_id}",
  "/reconciliations/{id}/close",
  "/reconciliations/{id}/reopen",
  "/reconciliations/{id}/evidence",
  "/reconciliations/{id}/evidence/{evidence_id}",
  "/reconciliations/{id}/reports/reconciliation/items",
  "/reconciliations/{id}/signoffs",
  "/reconciliations/{id}/signoffs/{role}",
]);
const httpMethods = new Set(["get", "post", "put", "patch", "delete"]);
const moduleNames = {
  Alerts: ["alerts", "AlertsApi"],
  Events: ["events", "EventsApi"],
  Ingestion: ["ingestion", "IngestionApi"],
  Issues: ["issues", "IssuesApi"],
  Ledger: ["ledger", "LedgerApi"],
  Reconciliations: ["reconciliations", "ReconciliationsApi"],
  Search: ["search", "SearchApi"],
  Setup: ["setup", "SetupApi"],
  Transactions: ["transactions", "TransactionsApi"],
  Wallets: ["wallets", "WalletsApi"],
};
const camelCase = (value) => value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
const operations = [];

for (const [path, pathItem] of Object.entries(spec.paths)) {
  if (excludedPaths.has(path)) continue;
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!httpMethods.has(method)) continue;
    const tag = operation.tags?.[0] ?? "Other";
    const [module, className] = moduleNames[tag] ?? ["other", "OtherApi"];
    operations.push({
      method: method.toUpperCase(),
      path,
      operationId: operation.operationId,
      methodName: camelCase(operation.operationId),
      tag,
      module,
      className,
      requiresArgs: Boolean(
        operation.requestBody ||
          operation.parameters?.some((parameter) => parameter.in === "path" && parameter.required),
      ),
    });
  }
}

const excludedOperations = Object.entries(spec.paths)
  .filter(([path]) => excludedPaths.has(path))
  .flatMap(([path, pathItem]) =>
    Object.entries(pathItem)
      .filter(([method]) => httpMethods.has(method))
      .map(([method, operation]) => ({ method: method.toUpperCase(), path, operationId: operation.operationId })),
  );

const operationsSource = `import type { operations } from "./openapi-types.js";

export const EXCLUDED_DEEP_RECONCILIATION_PATHS = [
${[...excludedPaths].map((path) => `  ${JSON.stringify(path)},`).join("\n")}
] as const;

export const publicOperations = [
${operations.map((operation) => `  ${JSON.stringify(operation)},`).join("\n")}
] as const satisfies readonly PublicOperation[];

export const operationById = Object.fromEntries(
  publicOperations.map((operation) => [operation.operationId, operation]),
) as { [Id in PublicOperationId]: Extract<(typeof publicOperations)[number], { operationId: Id }> };

export const excludedOperations = [
${excludedOperations.map((operation) => `  ${JSON.stringify(operation)},`).join("\n")}
] as const;

export interface PublicOperation {
  readonly method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly path: string;
  readonly operationId: keyof operations & string;
  readonly methodName: string;
  readonly tag: string;
  readonly module: string;
  readonly className: string;
  readonly requiresArgs: boolean;
}

export type PublicOperationId = (typeof publicOperations)[number]["operationId"];
export type PublicMethodName = (typeof publicOperations)[number]["methodName"];
`;

const modelAliases = Object.keys(spec.components?.schemas ?? {})
  .map((name) => `export type ${name} = components["schemas"][${JSON.stringify(name)}];`)
  .join("\n");
const modelsSource = `import type { components } from "./openapi-types.js";

${modelAliases}

export type { components };
`;

const moduleSources = new Map();
for (const operation of operations) {
  if (!moduleSources.has(operation.module)) {
    moduleSources.set(operation.module, { className: operation.className, methods: [] });
  }
  const args = operation.requiresArgs ? `args: RequestParams<"${operation.operationId}">` : `args?: RequestParams<"${operation.operationId}">`;
  moduleSources.get(operation.module).methods.push(`  ${operation.methodName}(${args}): Promise<ResponseBody<"${operation.operationId}">> {\n    return this.transport.request("${operation.operationId}", args);\n  }`);
}
for (const [module, source] of moduleSources) {
  fs.writeFileSync(
    `src/apis/${module}.ts`,
    `import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class ${source.className} {
  constructor(private readonly transport: ApiTransport) {}

${source.methods.join("\n\n")}
}
`,
  );
}

fs.writeFileSync("src/operations.ts", operationsSource);
fs.writeFileSync("src/models.ts", modelsSource);
console.log(`Generated ${operations.length} public operations and excluded ${excludedOperations.length}.`);
