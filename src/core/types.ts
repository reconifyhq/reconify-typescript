import type { operations } from "../openapi-types.js";

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
  ("path" extends keyof Operation<Id>
    ? [ParameterGroup<Operation<Id>, "path">] extends [never]
      ? {}
      : { path: ParameterGroup<Operation<Id>, "path"> }
    : {}) &
  ("query" extends keyof Operation<Id>
    ? [ParameterGroup<Operation<Id>, "query">] extends [never]
      ? {}
      : { query?: ParameterGroup<Operation<Id>, "query"> }
    : {}) &
  ("header" extends keyof Operation<Id>
    ? [ParameterGroup<Operation<Id>, "header">] extends [never]
      ? {}
      : { headers?: ParameterGroup<Operation<Id>, "header"> }
    : {}) &
  ([JsonBody<Operation<Id>>] extends [never] ? {} : { body: JsonBody<Operation<Id>> });

export type ResponseBody<Id extends OperationId> = ResponseBodyFromResponse<SuccessResponse<Operation<Id>>>;

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface ReconifyClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch?: FetchLike;
  headers?: HeadersInit;
}
