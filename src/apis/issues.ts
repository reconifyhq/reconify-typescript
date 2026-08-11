import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";
import { iterateCursorPages } from "../core/pagination.js";
import type { Issue } from "../models.js";

type ListIssuesParams = RequestParams<"list-issues">;
export type IterateIssuesOptions = Omit<ListIssuesParams, "query"> & { query?: Omit<NonNullable<ListIssuesParams["query"]>, "after"> };


export class IssuesApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List issues
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.status Filter by finding status.
   * @param args.query.limit Number of records to return.
   * @param args.query.after Opaque cursor returned by the previous response.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.listIssues();
   */
  listIssues(args?: RequestParams<"list-issues">): Promise<ResponseBody<"list-issues">> {
    return this.transport.request("list-issues", args);
  }

  /**
   * Get an issue
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.issue_id Issue identifier.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.getIssue(params);
   */
  getIssue(args: RequestParams<"get-issue">): Promise<ResponseBody<"get-issue">> {
    return this.transport.request("get-issue", args);
  }

  /**
   * Assign an issue
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.issue_id Issue identifier.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.updateIssue(params);
   */
  updateIssue(args: RequestParams<"update-issue">): Promise<ResponseBody<"update-issue">> {
    return this.transport.request("update-issue", args);
  }

  /**
   * List issue notes
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.issue_id Issue identifier.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.listIssueNotes(params);
   */
  listIssueNotes(args: RequestParams<"list-issue-notes">): Promise<ResponseBody<"list-issue-notes">> {
    return this.transport.request("list-issue-notes", args);
  }

  /**
   * Add an issue note
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.issue_id Issue identifier.
   * @param args.headers.Idempotency-Key Optional key for safe retries. The same key must represent the same issue and note body.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.issues.addIssueNote(params);
   */
  addIssueNote(args: RequestParams<"add-issue-note">): Promise<ResponseBody<"add-issue-note">> {
    return this.transport.request("add-issue-note", args);
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
