import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class AlertsApi {
  constructor(private readonly transport: ApiTransport) {}

  listAlertRules(args?: RequestParams<"list-alert-rules">): Promise<ResponseBody<"list-alert-rules">> {
    return this.transport.request("list-alert-rules", args);
  }

  putAlertRule(args: RequestParams<"put-alert-rule">): Promise<ResponseBody<"put-alert-rule">> {
    return this.transport.request("put-alert-rule", args);
  }
}
