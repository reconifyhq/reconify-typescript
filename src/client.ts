import type { operations, paths } from "./openapi-types.js";
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
        : `Reconify API request failed with HTTP ${response.status}`,
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
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized.endsWith("/v1") ? normalized : `${normalized}/v1`;
};

const pathWithParams = (template: string, path: Record<string, unknown> | undefined): string =>
  template.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = path?.[name];
    if (value === undefined || value === null) throw new TypeError(`Missing path parameter: ${name}`);
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
    const url = new URL(`${this.baseUrl}${pathWithParams(operation.path, typedArgs.path)}`);
    addQuery(url, typedArgs.query);
    const headers = new Headers(this.defaultHeaders);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
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

  // Alerts
  listAlertRules(args?: RequestParams<"list-alert-rules">): Promise<ResponseBody<"list-alert-rules">> {
    return this.request<"list-alert-rules">(publicOperations.find((operation) => operation.operationId === "list-alert-rules")!, args);
  }
  putAlertRule(args: RequestParams<"put-alert-rule">): Promise<ResponseBody<"put-alert-rule">> {
    return this.request<"put-alert-rule">(publicOperations.find((operation) => operation.operationId === "put-alert-rule")!, args);
  }

  // Events
  listEvents(args?: RequestParams<"list-events">): Promise<ResponseBody<"list-events">> {
    return this.request<"list-events">(publicOperations.find((operation) => operation.operationId === "list-events")!, args);
  }
  getEvent(args: RequestParams<"get-event">): Promise<ResponseBody<"get-event">> {
    return this.request<"get-event">(publicOperations.find((operation) => operation.operationId === "get-event")!, args);
  }
  revealEventField(args: RequestParams<"reveal-event-field">): Promise<ResponseBody<"reveal-event-field">> {
    return this.request<"reveal-event-field">(publicOperations.find((operation) => operation.operationId === "reveal-event-field")!, args);
  }

  // Ingestion
  ingestIntegrityEvents(args: RequestParams<"ingest-integrity-events">): Promise<ResponseBody<"ingest-integrity-events">> {
    return this.request<"ingest-integrity-events">(publicOperations.find((operation) => operation.operationId === "ingest-integrity-events")!, args);
  }

  // Reconciliations
  listIntegritySourcesForReconciliation(args?: RequestParams<"list-integrity-sources-for-reconciliation">): Promise<ResponseBody<"list-integrity-sources-for-reconciliation">> {
    return this.request<"list-integrity-sources-for-reconciliation">(publicOperations.find((operation) => operation.operationId === "list-integrity-sources-for-reconciliation")!, args);
  }

  // Ingestion
  ingestIntegrityTestEvents(args: RequestParams<"ingest-integrity-test-events">): Promise<ResponseBody<"ingest-integrity-test-events">> {
    return this.request<"ingest-integrity-test-events">(publicOperations.find((operation) => operation.operationId === "ingest-integrity-test-events")!, args);
  }

  // Issues
  listIssues(args?: RequestParams<"list-issues">): Promise<ResponseBody<"list-issues">> {
    return this.request<"list-issues">(publicOperations.find((operation) => operation.operationId === "list-issues")!, args);
  }
  getIssueSummary(args?: RequestParams<"get-issue-summary">): Promise<ResponseBody<"get-issue-summary">> {
    return this.request<"get-issue-summary">(publicOperations.find((operation) => operation.operationId === "get-issue-summary")!, args);
  }
  getIssue(args: RequestParams<"get-issue">): Promise<ResponseBody<"get-issue">> {
    return this.request<"get-issue">(publicOperations.find((operation) => operation.operationId === "get-issue")!, args);
  }
  updateIssue(args: RequestParams<"update-issue">): Promise<ResponseBody<"update-issue">> {
    return this.request<"update-issue">(publicOperations.find((operation) => operation.operationId === "update-issue")!, args);
  }
  listIssueDeliveries(args: RequestParams<"list-issue-deliveries">): Promise<ResponseBody<"list-issue-deliveries">> {
    return this.request<"list-issue-deliveries">(publicOperations.find((operation) => operation.operationId === "list-issue-deliveries")!, args);
  }
  retryIssueDelivery(args: RequestParams<"retry-issue-delivery">): Promise<ResponseBody<"retry-issue-delivery">> {
    return this.request<"retry-issue-delivery">(publicOperations.find((operation) => operation.operationId === "retry-issue-delivery")!, args);
  }
  addIssueNote(args: RequestParams<"add-issue-note">): Promise<ResponseBody<"add-issue-note">> {
    return this.request<"add-issue-note">(publicOperations.find((operation) => operation.operationId === "add-issue-note")!, args);
  }
  resolveIssue(args: RequestParams<"resolve-issue">): Promise<ResponseBody<"resolve-issue">> {
    return this.request<"resolve-issue">(publicOperations.find((operation) => operation.operationId === "resolve-issue")!, args);
  }

  // Ledger
  listLedgerSources(args?: RequestParams<"list-ledger-sources">): Promise<ResponseBody<"list-ledger-sources">> {
    return this.request<"list-ledger-sources">(publicOperations.find((operation) => operation.operationId === "list-ledger-sources")!, args);
  }
  createLedgerSource(args: RequestParams<"create-ledger-source">): Promise<ResponseBody<"create-ledger-source">> {
    return this.request<"create-ledger-source">(publicOperations.find((operation) => operation.operationId === "create-ledger-source")!, args);
  }
  deleteLedgerSource(args: RequestParams<"delete-ledger-source">): Promise<ResponseBody<"delete-ledger-source">> {
    return this.request<"delete-ledger-source">(publicOperations.find((operation) => operation.operationId === "delete-ledger-source")!, args);
  }
  getLedgerSource(args: RequestParams<"get-ledger-source">): Promise<ResponseBody<"get-ledger-source">> {
    return this.request<"get-ledger-source">(publicOperations.find((operation) => operation.operationId === "get-ledger-source")!, args);
  }
  updateLedgerSource(args: RequestParams<"update-ledger-source">): Promise<ResponseBody<"update-ledger-source">> {
    return this.request<"update-ledger-source">(publicOperations.find((operation) => operation.operationId === "update-ledger-source")!, args);
  }
  listSourcePeriods(args: RequestParams<"list-source-periods">): Promise<ResponseBody<"list-source-periods">> {
    return this.request<"list-source-periods">(publicOperations.find((operation) => operation.operationId === "list-source-periods")!, args);
  }
  listTransactions(args: RequestParams<"list-transactions">): Promise<ResponseBody<"list-transactions">> {
    return this.request<"list-transactions">(publicOperations.find((operation) => operation.operationId === "list-transactions")!, args);
  }
  ingestTransactions(args: RequestParams<"ingest-transactions">): Promise<ResponseBody<"ingest-transactions">> {
    return this.request<"ingest-transactions">(publicOperations.find((operation) => operation.operationId === "ingest-transactions")!, args);
  }

  // Reconciliations
  listReconciliationSchedules(args?: RequestParams<"list-reconciliation-schedules">): Promise<ResponseBody<"list-reconciliation-schedules">> {
    return this.request<"list-reconciliation-schedules">(publicOperations.find((operation) => operation.operationId === "list-reconciliation-schedules")!, args);
  }
  createReconciliationSchedule(args: RequestParams<"create-reconciliation-schedule">): Promise<ResponseBody<"create-reconciliation-schedule">> {
    return this.request<"create-reconciliation-schedule">(publicOperations.find((operation) => operation.operationId === "create-reconciliation-schedule")!, args);
  }
  deleteReconciliationSchedule(args: RequestParams<"delete-reconciliation-schedule">): Promise<ResponseBody<"delete-reconciliation-schedule">> {
    return this.request<"delete-reconciliation-schedule">(publicOperations.find((operation) => operation.operationId === "delete-reconciliation-schedule")!, args);
  }
  getReconciliationSchedule(args: RequestParams<"get-reconciliation-schedule">): Promise<ResponseBody<"get-reconciliation-schedule">> {
    return this.request<"get-reconciliation-schedule">(publicOperations.find((operation) => operation.operationId === "get-reconciliation-schedule")!, args);
  }
  updateReconciliationSchedule(args: RequestParams<"update-reconciliation-schedule">): Promise<ResponseBody<"update-reconciliation-schedule">> {
    return this.request<"update-reconciliation-schedule">(publicOperations.find((operation) => operation.operationId === "update-reconciliation-schedule")!, args);
  }
  listReconciliations(args?: RequestParams<"list-reconciliations">): Promise<ResponseBody<"list-reconciliations">> {
    return this.request<"list-reconciliations">(publicOperations.find((operation) => operation.operationId === "list-reconciliations")!, args);
  }
  createReconciliation(args: RequestParams<"create-reconciliation">): Promise<ResponseBody<"create-reconciliation">> {
    return this.request<"create-reconciliation">(publicOperations.find((operation) => operation.operationId === "create-reconciliation")!, args);
  }
  getReconciliation(args: RequestParams<"get-reconciliation">): Promise<ResponseBody<"get-reconciliation">> {
    return this.request<"get-reconciliation">(publicOperations.find((operation) => operation.operationId === "get-reconciliation")!, args);
  }

  // Search
  searchIntegrityResources(args?: RequestParams<"search-integrity-resources">): Promise<ResponseBody<"search-integrity-resources">> {
    return this.request<"search-integrity-resources">(publicOperations.find((operation) => operation.operationId === "search-integrity-resources")!, args);
  }

  // Setup
  listSetupIntegrations(args?: RequestParams<"list-setup-integrations">): Promise<ResponseBody<"list-setup-integrations">> {
    return this.request<"list-setup-integrations">(publicOperations.find((operation) => operation.operationId === "list-setup-integrations")!, args);
  }
  getSetupIntegration(args: RequestParams<"get-setup-integration">): Promise<ResponseBody<"get-setup-integration">> {
    return this.request<"get-setup-integration">(publicOperations.find((operation) => operation.operationId === "get-setup-integration")!, args);
  }
  listSetupSources(args?: RequestParams<"list-setup-sources">): Promise<ResponseBody<"list-setup-sources">> {
    return this.request<"list-setup-sources">(publicOperations.find((operation) => operation.operationId === "list-setup-sources")!, args);
  }
  createSetupSource(args: RequestParams<"create-setup-source">): Promise<ResponseBody<"create-setup-source">> {
    return this.request<"create-setup-source">(publicOperations.find((operation) => operation.operationId === "create-setup-source")!, args);
  }
  disableSetupSource(args: RequestParams<"disable-setup-source">): Promise<ResponseBody<"disable-setup-source">> {
    return this.request<"disable-setup-source">(publicOperations.find((operation) => operation.operationId === "disable-setup-source")!, args);
  }
  getSetupSource(args: RequestParams<"get-setup-source">): Promise<ResponseBody<"get-setup-source">> {
    return this.request<"get-setup-source">(publicOperations.find((operation) => operation.operationId === "get-setup-source")!, args);
  }
  updateSetupSource(args: RequestParams<"update-setup-source">): Promise<ResponseBody<"update-setup-source">> {
    return this.request<"update-setup-source">(publicOperations.find((operation) => operation.operationId === "update-setup-source")!, args);
  }
  createTestSession(args: RequestParams<"create-test-session">): Promise<ResponseBody<"create-test-session">> {
    return this.request<"create-test-session">(publicOperations.find((operation) => operation.operationId === "create-test-session")!, args);
  }
  getTestSession(args: RequestParams<"get-test-session">): Promise<ResponseBody<"get-test-session">> {
    return this.request<"get-test-session">(publicOperations.find((operation) => operation.operationId === "get-test-session")!, args);
  }
  getTestSessionResult(args: RequestParams<"get-test-session-result">): Promise<ResponseBody<"get-test-session-result">> {
    return this.request<"get-test-session-result">(publicOperations.find((operation) => operation.operationId === "get-test-session-result")!, args);
  }
  retryTestSession(args: RequestParams<"retry-test-session">): Promise<ResponseBody<"retry-test-session">> {
    return this.request<"retry-test-session">(publicOperations.find((operation) => operation.operationId === "retry-test-session")!, args);
  }
  submitTestSessionEvents(args: RequestParams<"submit-test-session-events">): Promise<ResponseBody<"submit-test-session-events">> {
    return this.request<"submit-test-session-events">(publicOperations.find((operation) => operation.operationId === "submit-test-session-events")!, args);
  }

  // Transactions
  listWalletTransactions(args?: RequestParams<"list-wallet-transactions">): Promise<ResponseBody<"list-wallet-transactions">> {
    return this.request<"list-wallet-transactions">(publicOperations.find((operation) => operation.operationId === "list-wallet-transactions")!, args);
  }
  getWalletTransaction(args: RequestParams<"get-wallet-transaction">): Promise<ResponseBody<"get-wallet-transaction">> {
    return this.request<"get-wallet-transaction">(publicOperations.find((operation) => operation.operationId === "get-wallet-transaction")!, args);
  }

  // Wallets
  listWallets(args?: RequestParams<"list-wallets">): Promise<ResponseBody<"list-wallets">> {
    return this.request<"list-wallets">(publicOperations.find((operation) => operation.operationId === "list-wallets")!, args);
  }
  getWallet(args: RequestParams<"get-wallet">): Promise<ResponseBody<"get-wallet">> {
    return this.request<"get-wallet">(publicOperations.find((operation) => operation.operationId === "get-wallet")!, args);
  }
  getWalletBalance(args: RequestParams<"get-wallet-balance">): Promise<ResponseBody<"get-wallet-balance">> {
    return this.request<"get-wallet-balance">(publicOperations.find((operation) => operation.operationId === "get-wallet-balance")!, args);
  }
}

export type { paths };
