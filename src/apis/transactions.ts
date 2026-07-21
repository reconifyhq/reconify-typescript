import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class TransactionsApi {
  constructor(private readonly transport: ApiTransport) {}

  listWalletTransactions(args?: RequestParams<"list-wallet-transactions">): Promise<ResponseBody<"list-wallet-transactions">> {
    return this.transport.request("list-wallet-transactions", args);
  }

  getWalletTransaction(args: RequestParams<"get-wallet-transaction">): Promise<ResponseBody<"get-wallet-transaction">> {
    return this.transport.request("get-wallet-transaction", args);
  }
}
