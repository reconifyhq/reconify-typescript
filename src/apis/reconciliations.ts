import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class ReconciliationsApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List integrity event sources
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.listIntegritySourcesForReconciliation();
   */
  listIntegritySourcesForReconciliation(args?: RequestParams<"list-integrity-sources-for-reconciliation">): Promise<ResponseBody<"list-integrity-sources-for-reconciliation">> {
    return this.transport.request("list-integrity-sources-for-reconciliation", args);
  }

  /**
   * List reconciliation schedules
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.limit Maximum results per page (1–100)
   * @param args.query.offset Pagination offset
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.listReconciliationSchedules();
   */
  listReconciliationSchedules(args?: RequestParams<"list-reconciliation-schedules">): Promise<ResponseBody<"list-reconciliation-schedules">> {
    return this.transport.request("list-reconciliation-schedules", args);
  }

  /**
   * Create a reconciliation schedule
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.createReconciliationSchedule(params);
   */
  createReconciliationSchedule(args: RequestParams<"create-reconciliation-schedule">): Promise<ResponseBody<"create-reconciliation-schedule">> {
    return this.transport.request("create-reconciliation-schedule", args);
  }

  /**
   * Delete a reconciliation schedule
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Schedule UUID
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.deleteReconciliationSchedule(params);
   */
  deleteReconciliationSchedule(args: RequestParams<"delete-reconciliation-schedule">): Promise<ResponseBody<"delete-reconciliation-schedule">> {
    return this.transport.request("delete-reconciliation-schedule", args);
  }

  /**
   * Get a reconciliation schedule
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Schedule UUID
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.getReconciliationSchedule(params);
   */
  getReconciliationSchedule(args: RequestParams<"get-reconciliation-schedule">): Promise<ResponseBody<"get-reconciliation-schedule">> {
    return this.transport.request("get-reconciliation-schedule", args);
  }

  /**
   * Update a reconciliation schedule
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Schedule UUID
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.updateReconciliationSchedule(params);
   */
  updateReconciliationSchedule(args: RequestParams<"update-reconciliation-schedule">): Promise<ResponseBody<"update-reconciliation-schedule">> {
    return this.transport.request("update-reconciliation-schedule", args);
  }

  /**
   * List reconciliations
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.status Filter by status (queued, reconciling, reporting, completed, failed, cancelled)
   * @param args.query.q Case-insensitive substring search on ID or name
   * @param args.query.limit Maximum results per page (1–100)
   * @param args.query.offset Pagination offset
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.listReconciliations();
   */
  listReconciliations(args?: RequestParams<"list-reconciliations">): Promise<ResponseBody<"list-reconciliations">> {
    return this.transport.request("list-reconciliations", args);
  }

  /**
   * Create a reconciliation
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.createReconciliation(params);
   */
  createReconciliation(args: RequestParams<"create-reconciliation">): Promise<ResponseBody<"create-reconciliation">> {
    return this.transport.request("create-reconciliation", args);
  }

  /**
   * Get a reconciliation
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Reconciliation UUID
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.reconciliations.getReconciliation(params);
   */
  getReconciliation(args: RequestParams<"get-reconciliation">): Promise<ResponseBody<"get-reconciliation">> {
    return this.transport.request("get-reconciliation", args);
  }

}
