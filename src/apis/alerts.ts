import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class AlertsApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List alert rules
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.alerts.listAlertRules();
   */
  listAlertRules(args?: RequestParams<"list-alert-rules">): Promise<ResponseBody<"list-alert-rules">> {
    return this.transport.request("list-alert-rules", args);
  }

  /**
   * Create or replace an alert rule
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.alerts.putAlertRule(params);
   */
  putAlertRule(args: RequestParams<"put-alert-rule">): Promise<ResponseBody<"put-alert-rule">> {
    return this.transport.request("put-alert-rule", args);
  }

}
