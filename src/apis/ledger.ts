import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class LedgerApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List ledger sources
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.limit Maximum number of sources to return.
   * @param args.query.offset query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.listLedgerSources();
   */
  listLedgerSources(args?: RequestParams<"list-ledger-sources">): Promise<ResponseBody<"list-ledger-sources">> {
    return this.transport.request("list-ledger-sources", args);
  }

  /**
   * Create a ledger source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.createLedgerSource(params);
   */
  createLedgerSource(args: RequestParams<"create-ledger-source">): Promise<ResponseBody<"create-ledger-source">> {
    return this.transport.request("create-ledger-source", args);
  }

  /**
   * Delete a ledger source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Source UUID
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.deleteLedgerSource(params);
   */
  deleteLedgerSource(args: RequestParams<"delete-ledger-source">): Promise<ResponseBody<"delete-ledger-source">> {
    return this.transport.request("delete-ledger-source", args);
  }

  /**
   * Get a ledger source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Source UUID
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.getLedgerSource(params);
   */
  getLedgerSource(args: RequestParams<"get-ledger-source">): Promise<ResponseBody<"get-ledger-source">> {
    return this.transport.request("get-ledger-source", args);
  }

  /**
   * Update a ledger source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Source UUID
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.updateLedgerSource(params);
   */
  updateLedgerSource(args: RequestParams<"update-ledger-source">): Promise<ResponseBody<"update-ledger-source">> {
    return this.transport.request("update-ledger-source", args);
  }

  /**
   * List source periods
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Source UUID
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.listSourcePeriods(params);
   */
  listSourcePeriods(args: RequestParams<"list-source-periods">): Promise<ResponseBody<"list-source-periods">> {
    return this.transport.request("list-source-periods", args);
  }

  /**
   * List transactions
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Source UUID
   * @param args.query.period_key Filter to a single accounting period (YYYY-MM format)
   * @param args.query.date_from Include transactions on or after this date (YYYY-MM-DD)
   * @param args.query.date_to Include transactions on or before this date (YYYY-MM-DD)
   * @param args.query.direction Filter by direction (debit or credit)
   * @param args.query.status Filter by status (pending, posted, failed, reversed, void)
   * @param args.query.limit Maximum results per page (1–200)
   * @param args.query.offset Pagination offset
   * @param args.query.after Opaque pagination cursor from a previous response's nextCursor. When provided, offset is ignored.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.listTransactions(params);
   */
  listTransactions(args: RequestParams<"list-transactions">): Promise<ResponseBody<"list-transactions">> {
    return this.transport.request("list-transactions", args);
  }

  /**
   * Ingest transactions
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Source UUID
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ledger.ingestTransactions(params);
   */
  ingestTransactions(args: RequestParams<"ingest-transactions">): Promise<ResponseBody<"ingest-transactions">> {
    return this.transport.request("ingest-transactions", args);
  }

}
