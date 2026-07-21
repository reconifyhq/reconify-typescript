import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class LedgerApi {
  constructor(private readonly transport: ApiTransport) {}

  listLedgerSources(args?: RequestParams<"list-ledger-sources">): Promise<ResponseBody<"list-ledger-sources">> {
    return this.transport.request("list-ledger-sources", args);
  }

  createLedgerSource(args: RequestParams<"create-ledger-source">): Promise<ResponseBody<"create-ledger-source">> {
    return this.transport.request("create-ledger-source", args);
  }

  deleteLedgerSource(args: RequestParams<"delete-ledger-source">): Promise<ResponseBody<"delete-ledger-source">> {
    return this.transport.request("delete-ledger-source", args);
  }

  getLedgerSource(args: RequestParams<"get-ledger-source">): Promise<ResponseBody<"get-ledger-source">> {
    return this.transport.request("get-ledger-source", args);
  }

  updateLedgerSource(args: RequestParams<"update-ledger-source">): Promise<ResponseBody<"update-ledger-source">> {
    return this.transport.request("update-ledger-source", args);
  }

  listSourcePeriods(args: RequestParams<"list-source-periods">): Promise<ResponseBody<"list-source-periods">> {
    return this.transport.request("list-source-periods", args);
  }

  listTransactions(args: RequestParams<"list-transactions">): Promise<ResponseBody<"list-transactions">> {
    return this.transport.request("list-transactions", args);
  }

  ingestTransactions(args: RequestParams<"ingest-transactions">): Promise<ResponseBody<"ingest-transactions">> {
    return this.transport.request("ingest-transactions", args);
  }
}
