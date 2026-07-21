import fs from "node:fs";

const spec = JSON.parse(fs.readFileSync("openapi/reconify.openapi.json", "utf8"));
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
const camelCase = (value) => value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
const operations = [];

for (const [path, pathItem] of Object.entries(spec.paths)) {
  if (excludedPaths.has(path)) continue;
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!httpMethods.has(method)) continue;
    operations.push({
      method: method.toUpperCase(),
      path,
      operationId: operation.operationId,
      methodName: camelCase(operation.operationId),
      tag: operation.tags?.[0] ?? "Other",
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

export const excludedOperations = [
${excludedOperations.map((operation) => `  ${JSON.stringify(operation)},`).join("\n")}
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
`;

const modelAliases = Object.keys(spec.components?.schemas ?? {})
  .map((name) => `export type ${name} = components["schemas"][${JSON.stringify(name)}];`)
  .join("\n");
const modelsSource = `import type { components } from "./openapi-types.js";

${modelAliases}

export type { components };
`;

const groupedMethods = [];
let currentTag;
for (const operation of operations) {
  if (operation.tag !== currentTag) {
    currentTag = operation.tag;
    groupedMethods.push(`\n  // ${currentTag}`);
  }
  const args = operation.requiresArgs ? `args: RequestParams<"${operation.operationId}">` : `args?: RequestParams<"${operation.operationId}">`;
  groupedMethods.push(`  ${operation.methodName}(${args}): Promise<ResponseBody<"${operation.operationId}">> {`);
  groupedMethods.push(`    return this.request<"${operation.operationId}">(publicOperations.find((operation) => operation.operationId === "${operation.operationId}")!, args);`);
  groupedMethods.push("  }");
}

const clientSource = `import type { operations, paths } from "./openapi-types.js";
import { publicOperations } from "./operations.js";

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export type OperationId = keyof operations & string;

type Operation<Id extends OperationId> = operations[Id];
type ParameterGroup<Op, Group extends "path" | "query" | "header"> =
  Op extends { parameters: infer Parameters }
    ? Parameters extends Record<Group, infer Value>
      ? NonNullable<Value>
      : never
    : never;
type JsonBody<Op> = Op extends { requestBody: { content: infer Content } }
  ? Content extends { "application/json": infer Body }
    ? Body
    : never
  : never;
type SuccessResponse<Op> = Op extends { responses: infer Responses }
  ? Responses extends Record<200 | 201 | 202 | 203 | 204 | 205 | 206, infer Response>
    ? Response
    : Responses[keyof Responses & (200 | 201 | 202 | 203 | 204 | 205 | 206)]
  : never;
type ResponseBodyFromResponse<Response> = Response extends { content: infer Content }
  ? Content extends { "application/json": infer Body }
    ? Body
    : void
  : void;

export type RequestParams<Id extends OperationId> =
  ("path" extends keyof Operation<Id> ?
    [ParameterGroup<Operation<Id>, "path">] extends [never] ? {} : { path: ParameterGroup<Operation<Id>, "path"> } : {}) &
  ("query" extends keyof Operation<Id> ?
    [ParameterGroup<Operation<Id>, "query">] extends [never] ? {} : { query?: ParameterGroup<Operation<Id>, "query"> } : {}) &
  ("header" extends keyof Operation<Id> ?
    [ParameterGroup<Operation<Id>, "header">] extends [never] ? {} : { headers?: ParameterGroup<Operation<Id>, "header"> } : {}) &
  ([JsonBody<Operation<Id>>] extends [never] ? {} : { body: JsonBody<Operation<Id>> });

export type ResponseBody<Id extends OperationId> = ResponseBodyFromResponse<SuccessResponse<Operation<Id>>>;

export interface ReconifyClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch?: FetchLike;
  headers?: HeadersInit;
}

export class ReconifyApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;
  readonly response: Response;

  constructor(response: Response, body: unknown) {
    super(
      typeof body === "object" && body !== null && "detail" in body && typeof body.detail === "string"
        ? body.detail
        : \`Reconify API request failed with HTTP \${response.status}\`,
    );
    this.name = "ReconifyApiError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = body;
    this.response = response;
  }
}

const isJsonResponse = (response: Response): boolean =>
  response.headers.get("content-type")?.includes("json") ?? false;

const normalizeBaseUrl = (baseUrl: string): string => {
  const normalized = baseUrl.replace(/\\/+$/, "");
  return normalized.endsWith("/v1") ? normalized : \`\${normalized}/v1\`;
};

const pathWithParams = (template: string, path: Record<string, unknown> | undefined): string =>
  template.replace(/\\{([^}]+)\\}/g, (_, name: string) => {
    const value = path?.[name];
    if (value === undefined || value === null) throw new TypeError(\`Missing path parameter: \${name}\`);
    return encodeURIComponent(String(value));
  });

const addQuery = (url: URL, query: Record<string, unknown> | undefined): void => {
  if (!query) return;
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
  }
};

export class ReconifyClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetcher: FetchLike;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: ReconifyClientOptions) {
    if (!options.apiKey) throw new TypeError("apiKey is required");
    if (!options.baseUrl) throw new TypeError("baseUrl is required");
    this.apiKey = options.apiKey;
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.fetcher = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.defaultHeaders = options.headers ?? {};
  }

  private async request<Id extends OperationId>(
    operation: (typeof publicOperations)[number] & { operationId: Id },
    args: RequestParams<Id> | undefined,
  ): Promise<ResponseBody<Id>> {
    const typedArgs = (args ?? {}) as RequestParams<Id> & {
      path?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
      body?: unknown;
    };
    const url = new URL(\`\${this.baseUrl}\${pathWithParams(operation.path, typedArgs.path)}\`);
    addQuery(url, typedArgs.query);
    const headers = new Headers(this.defaultHeaders);
    headers.set("Authorization", \`Bearer \${this.apiKey}\`);
    for (const [key, value] of Object.entries(typedArgs.headers ?? {})) headers.set(key, value);
    if (typedArgs.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    const response = await this.fetcher(url, {
      method: operation.method,
      headers,
      body: typedArgs.body === undefined ? undefined : JSON.stringify(typedArgs.body),
    });
    const body = response.status === 204 ? undefined : isJsonResponse(response) ? await response.json() : await response.text();
    if (!response.ok) throw new ReconifyApiError(response, body);
    return body as ResponseBody<Id>;
  }
${groupedMethods.join("\n")}
}

export type { paths };
`;

fs.writeFileSync("src/operations.ts", operationsSource);
fs.writeFileSync("src/models.ts", modelsSource);
fs.writeFileSync("src/client.ts", clientSource);
console.log(`Generated ${operations.length} public operations and excluded ${excludedOperations.length}.`);
