import type { operations } from "../openapi-types.js";

export type OperationId = keyof operations & string;
type Operation<Id extends OperationId> = operations[Id];
type ParameterGroup<Op, Group extends "path" | "query" | "header"> =
  Op extends { parameters: infer Parameters }
    ? Parameters extends { [Key in Group]?: infer Value }
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
  ([ParameterGroup<Operation<Id>, "path">] extends [never]
    ? {}
    : { path: ParameterGroup<Operation<Id>, "path"> }) &
  ([ParameterGroup<Operation<Id>, "query">] extends [never]
    ? {}
    : { query?: ParameterGroup<Operation<Id>, "query"> }) &
  ([ParameterGroup<Operation<Id>, "header">] extends [never]
    ? {}
    : { headers?: ParameterGroup<Operation<Id>, "header"> }) &
  ([JsonBody<Operation<Id>>] extends [never] ? {} : { body: JsonBody<Operation<Id>> }) & {
    request?: RequestOptions;
  };

export type ResponseBody<Id extends OperationId> = ResponseBodyFromResponse<SuccessResponse<Operation<Id>>>;

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface RetryOptions {
  /** Maximum number of attempts, including the initial request. */
  maxAttempts?: number;
  /** Initial exponential backoff delay in milliseconds. */
  baseDelayMs?: number;
  /** Maximum retry delay in milliseconds. */
  maxDelayMs?: number;
  /** Allow retries for POST/PUT/PATCH/DELETE requests. Disabled by default. */
  retryNonIdempotent?: boolean;
}

export interface RequestOptions {
  /** AbortSignal used to cancel the request. This is the TypeScript equivalent of context.Context. */
  signal?: AbortSignal;
  /** Per-request timeout. Defaults to the client timeout. Set to 0 to disable. */
  timeoutMs?: number;
  /** Per-request retry overrides. */
  retry?: RetryOptions;
}

export interface ReconifyClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch?: FetchLike;
  headers?: HeadersInit;
  timeoutMs?: number;
  retry?: RetryOptions;
}
