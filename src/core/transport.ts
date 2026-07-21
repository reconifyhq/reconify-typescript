import { operationById } from "../operations.js";
import type { PublicOperationId } from "../operations.js";
import type {
  FetchLike,
  ReconifyClientOptions,
  RequestOptions,
  RequestParams,
  ResponseBody,
  RetryOptions,
} from "./types.js";

export interface ReconifyErrorDetail {
  code?: string;
  field?: string;
  location?: string;
  message: string;
  value?: unknown;
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;

const errorDetails = (body: unknown): ReconifyErrorDetail[] => {
  const rawErrors = asRecord(body)?.errors;
  if (!Array.isArray(rawErrors)) return [];
  return rawErrors.flatMap((raw) => {
    const item = asRecord(raw);
    if (!item || typeof item.message !== "string") return [];
    const location = typeof item.location === "string" ? item.location : undefined;
    return [{
      code: location === "$code" ? item.message : undefined,
      field: location && location !== "$code" ? location.split(".").at(-1) : undefined,
      location,
      message: item.message,
      value: item.value,
    }];
  });
};

const fallbackErrorCode = (status: number): string => {
  if (status === 404) return "not_found";
  if (status === 422 || status === 400) return "validation_error";
  if (status === 429) return "rate_limited";
  if (status === 503) return "service_unavailable";
  return "api_error";
};

export class ReconifyApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly code: string;
  readonly field?: string;
  readonly details: readonly ReconifyErrorDetail[];
  readonly body: unknown;
  readonly response: Response;

  constructor(response: Response, body: unknown) {
    const problem = asRecord(body);
    const details = errorDetails(body);
    const detail = typeof problem?.detail === "string" ? problem.detail : undefined;
    super(detail ?? `Reconify API request failed with HTTP ${response.status}`);
    this.name = "ReconifyApiError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.code = typeof problem?.code === "string" ? problem.code : details.find((item) => item.code)?.code ?? fallbackErrorCode(response.status);
    this.field = details.find((item) => item.field)?.field;
    this.details = details;
    this.body = body;
    this.response = response;
  }
}

export class ReconifyTimeoutError extends Error {
  readonly code = "timeout";
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Reconify API request timed out after ${timeoutMs}ms`);
    this.name = "ReconifyTimeoutError";
    this.timeoutMs = timeoutMs;
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

const retryAfterMs = (response: Response): number | undefined => {
  const value = response.headers.get("retry-after");
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : Math.max(0, timestamp - Date.now());
};

const retryableMethod = (method: string, retry: RetryOptions): boolean =>
  ["GET", "HEAD", "OPTIONS"].includes(method) || retry.retryNonIdempotent === true;

const wait = (durationMs: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal?.reason ?? new DOMException("The operation was aborted", "AbortError"));
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(signal?.reason ?? new DOMException("The operation was aborted", "AbortError"));
    };
    const done = () => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    };
    timer = setTimeout(done, durationMs);
    signal?.addEventListener("abort", onAbort, { once: true });
  });

export class ApiTransport {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetcher: FetchLike;
  private readonly defaultHeaders: HeadersInit;
  private readonly timeoutMs: number;
  private readonly retry: Required<Pick<RetryOptions, "maxAttempts" | "baseDelayMs" | "maxDelayMs">> & Pick<RetryOptions, "retryNonIdempotent">;

  constructor(options: ReconifyClientOptions) {
    if (!options.apiKey) throw new TypeError("apiKey is required");
    if (!options.baseUrl) throw new TypeError("baseUrl is required");
    this.apiKey = options.apiKey;
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.fetcher = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.defaultHeaders = options.headers ?? {};
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.retry = {
      maxAttempts: options.retry?.maxAttempts ?? 3,
      baseDelayMs: options.retry?.baseDelayMs ?? 250,
      maxDelayMs: options.retry?.maxDelayMs ?? 5_000,
      retryNonIdempotent: options.retry?.retryNonIdempotent,
    };
  }

  async request<Id extends PublicOperationId>(operationId: Id, args: RequestParams<Id> | undefined): Promise<ResponseBody<Id>> {
    const operation = operationById[operationId];
    const typedArgs = (args ?? {}) as RequestParams<Id> & {
      path?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
      body?: unknown;
      request?: RequestOptions;
    };
    const requestOptions = typedArgs.request ?? {};
    const timeoutMs = requestOptions.timeoutMs ?? this.timeoutMs;
    const retry = { ...this.retry, ...requestOptions.retry };
    const maxAttempts = Math.max(1, Math.floor(retry.maxAttempts));
    const url = new URL(`${this.baseUrl}${pathWithParams(operation.path, typedArgs.path)}`);
    addQuery(url, typedArgs.query);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      let timedOut = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const controller = new AbortController();
      const onCallerAbort = () => controller.abort(requestOptions.signal?.reason);
      requestOptions.signal?.addEventListener("abort", onCallerAbort, { once: true });
      if (timeoutMs > 0) {
        timer = setTimeout(() => {
          timedOut = true;
          controller.abort(new DOMException("The operation timed out", "TimeoutError"));
        }, timeoutMs);
      }
      try {
        const headers = new Headers(this.defaultHeaders);
        headers.set("Authorization", `Bearer ${this.apiKey}`);
        for (const [key, value] of Object.entries(typedArgs.headers ?? {})) headers.set(key, value);
        if (typedArgs.body !== undefined) headers.set("Content-Type", "application/json");
        const response = await this.fetcher(url, {
          method: operation.method,
          headers,
          signal: controller.signal,
          body: typedArgs.body === undefined ? undefined : JSON.stringify(typedArgs.body),
        });
        const body = response.status === 204 ? undefined : isJsonResponse(response) ? await response.json() : await response.text();
        if (!response.ok) {
          const error = new ReconifyApiError(response, body);
          const canRetry = attempt < maxAttempts && retryableMethod(operation.method, retry) && [429, 503].includes(response.status);
          if (!canRetry) throw error;
          const backoff = Math.min(retry.maxDelayMs, retry.baseDelayMs * 2 ** (attempt - 1));
          await wait(Math.min(retry.maxDelayMs, retryAfterMs(response) ?? backoff), requestOptions.signal);
          continue;
        }
        return body as ResponseBody<Id>;
      } catch (error) {
        if (requestOptions.signal?.aborted) throw error;
        const canRetry = attempt < maxAttempts && retryableMethod(operation.method, retry);
        if (timedOut) {
          if (!canRetry) throw new ReconifyTimeoutError(timeoutMs);
          await wait(Math.min(retry.maxDelayMs, retry.baseDelayMs * 2 ** (attempt - 1)), requestOptions.signal);
          continue;
        }
        if (canRetry && error instanceof TypeError) {
          await wait(Math.min(retry.maxDelayMs, retry.baseDelayMs * 2 ** (attempt - 1)), requestOptions.signal);
          continue;
        }
        throw error;
      } finally {
        if (timer) clearTimeout(timer);
        requestOptions.signal?.removeEventListener("abort", onCallerAbort);
      }
    }
    throw new Error("unreachable");
  }
}
