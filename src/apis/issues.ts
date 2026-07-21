import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class IssuesApi {
  constructor(private readonly transport: ApiTransport) {}

  listIssues(args?: RequestParams<"list-issues">): Promise<ResponseBody<"list-issues">> {
    return this.transport.request("list-issues", args);
  }

  getIssueSummary(args?: RequestParams<"get-issue-summary">): Promise<ResponseBody<"get-issue-summary">> {
    return this.transport.request("get-issue-summary", args);
  }

  getIssue(args: RequestParams<"get-issue">): Promise<ResponseBody<"get-issue">> {
    return this.transport.request("get-issue", args);
  }

  updateIssue(args: RequestParams<"update-issue">): Promise<ResponseBody<"update-issue">> {
    return this.transport.request("update-issue", args);
  }

  listIssueDeliveries(args: RequestParams<"list-issue-deliveries">): Promise<ResponseBody<"list-issue-deliveries">> {
    return this.transport.request("list-issue-deliveries", args);
  }

  retryIssueDelivery(args: RequestParams<"retry-issue-delivery">): Promise<ResponseBody<"retry-issue-delivery">> {
    return this.transport.request("retry-issue-delivery", args);
  }

  addIssueNote(args: RequestParams<"add-issue-note">): Promise<ResponseBody<"add-issue-note">> {
    return this.transport.request("add-issue-note", args);
  }

  resolveIssue(args: RequestParams<"resolve-issue">): Promise<ResponseBody<"resolve-issue">> {
    return this.transport.request("resolve-issue", args);
  }
}
