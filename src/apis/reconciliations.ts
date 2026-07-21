import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class ReconciliationsApi {
  constructor(private readonly transport: ApiTransport) {}

  listIntegritySourcesForReconciliation(args?: RequestParams<"list-integrity-sources-for-reconciliation">): Promise<ResponseBody<"list-integrity-sources-for-reconciliation">> {
    return this.transport.request("list-integrity-sources-for-reconciliation", args);
  }

  listReconciliationSchedules(args?: RequestParams<"list-reconciliation-schedules">): Promise<ResponseBody<"list-reconciliation-schedules">> {
    return this.transport.request("list-reconciliation-schedules", args);
  }

  createReconciliationSchedule(args: RequestParams<"create-reconciliation-schedule">): Promise<ResponseBody<"create-reconciliation-schedule">> {
    return this.transport.request("create-reconciliation-schedule", args);
  }

  deleteReconciliationSchedule(args: RequestParams<"delete-reconciliation-schedule">): Promise<ResponseBody<"delete-reconciliation-schedule">> {
    return this.transport.request("delete-reconciliation-schedule", args);
  }

  getReconciliationSchedule(args: RequestParams<"get-reconciliation-schedule">): Promise<ResponseBody<"get-reconciliation-schedule">> {
    return this.transport.request("get-reconciliation-schedule", args);
  }

  updateReconciliationSchedule(args: RequestParams<"update-reconciliation-schedule">): Promise<ResponseBody<"update-reconciliation-schedule">> {
    return this.transport.request("update-reconciliation-schedule", args);
  }

  listReconciliations(args?: RequestParams<"list-reconciliations">): Promise<ResponseBody<"list-reconciliations">> {
    return this.transport.request("list-reconciliations", args);
  }

  createReconciliation(args: RequestParams<"create-reconciliation">): Promise<ResponseBody<"create-reconciliation">> {
    return this.transport.request("create-reconciliation", args);
  }

  getReconciliation(args: RequestParams<"get-reconciliation">): Promise<ResponseBody<"get-reconciliation">> {
    return this.transport.request("get-reconciliation", args);
  }
}
