import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";
import { iterateCursorPages } from "../core/pagination.js";
import type { Issue } from "../models.js";

type ListIssuesParams = RequestParams<"list-issues">;
export type IterateIssuesOptions = Omit<ListIssuesParams, "query"> & { query?: Omit<NonNullable<ListIssuesParams["query"]>, "after"> };


export class IssuesApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List integrity issues
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.status query parameter
   * @param args.query.severity query parameter
   * @param args.query.reason query parameter
   * @param args.query.system_outcome query parameter
   * @param args.query.control_id query parameter
   * @param args.query.assigned_to query parameter
   * @param args.query.source_id query parameter
   * @param args.query.currency query parameter
   * @param args.query.exposure_min query parameter
   * @param args.query.exposure_max query parameter
   * @param args.query.q query parameter
   * @param args.query.opened_from query parameter
   * @param args.query.opened_to query parameter
   * @param args.query.after query parameter
   * @param args.query.limit query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.listIssues();
   */
  listIssues(args?: RequestParams<"list-issues">): Promise<ResponseBody<"list-issues">> {
    return this.transport.request("list-issues", args);
  }

  /**
   * Summarize integrity issues
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.getIssueSummary();
   */
  getIssueSummary(args?: RequestParams<"get-issue-summary">): Promise<ResponseBody<"get-issue-summary">> {
    return this.transport.request("get-issue-summary", args);
  }

  /**
   * Get an integrity issue
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.getIssue(params);
   */
  getIssue(args: RequestParams<"get-issue">): Promise<ResponseBody<"get-issue">> {
    return this.transport.request("get-issue", args);
  }

  /**
   * Update an integrity issue
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.updateIssue(params);
   */
  updateIssue(args: RequestParams<"update-issue">): Promise<ResponseBody<"update-issue">> {
    return this.transport.request("update-issue", args);
  }

  /**
   * List issue deliveries
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.listIssueDeliveries(params);
   */
  listIssueDeliveries(args: RequestParams<"list-issue-deliveries">): Promise<ResponseBody<"list-issue-deliveries">> {
    return this.transport.request("list-issue-deliveries", args);
  }

  /**
   * Retry a failed issue delivery
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.path.deliveryId path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.retryIssueDelivery(params);
   */
  retryIssueDelivery(args: RequestParams<"retry-issue-delivery">): Promise<ResponseBody<"retry-issue-delivery">> {
    return this.transport.request("retry-issue-delivery", args);
  }

  /**
   * Add an issue note
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.addIssueNote(params);
   */
  addIssueNote(args: RequestParams<"add-issue-note">): Promise<ResponseBody<"add-issue-note">> {
    return this.transport.request("add-issue-note", args);
  }

  /**
   * Resolve an issue
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.resolveIssue(params);
   */
  resolveIssue(args: RequestParams<"resolve-issue">): Promise<ResponseBody<"resolve-issue">> {
    return this.transport.request("resolve-issue", args);
  }


  /** Iterate through every issue page using the API cursor. */
  async *iterateIssues(args?: IterateIssuesOptions): AsyncGenerator<Issue> {
    const query = args?.query;
    yield* iterateCursorPages<Issue, ResponseBody<"list-issues">>(
      (after) => this.listIssues({ ...args, query: { ...query, ...(after ? { after } : {}) } }),
      (page) => page.issues,
    );
  }
}
