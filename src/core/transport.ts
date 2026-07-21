import { operationById } from "../operations.js";
import type { PublicOperationId } from "../operations.js";
import type { FetchLike, ReconifyClientOptions, RequestParams, ResponseBody } from "./types.js";

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

const isJsonResponse = (response: Response): boolean => response.headers.get("content-type")?.includes("json") ?? false;

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

export class ApiTransport {
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

  async request<Id extends PublicOperationId>(
    operationId: Id,
    args: RequestParams<Id> | undefined,
  ): Promise<ResponseBody<Id>> {
    const operation = operationById[operationId];
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
    if (typedArgs.body !== undefined) headers.set("Content-Type", "application/json");
    const response = await this.fetcher(url, {
      method: operation.method,
      headers,
      body: typedArgs.body === undefined ? undefined : JSON.stringify(typedArgs.body),
    });
    const body = response.status === 204 ? undefined : isJsonResponse(response) ? await response.json() : await response.text();
    if (!response.ok) throw new ReconifyApiError(response, body);
    return body as ResponseBody<Id>;
  }
}
