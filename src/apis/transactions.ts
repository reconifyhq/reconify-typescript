import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";
import { iterateCursorPages } from "../core/pagination.js";
import type { WalletTransaction } from "../models.js";

type ListTransactionsParams = RequestParams<"list-wallet-transactions">;
export type IterateWalletTransactionsOptions = Omit<ListTransactionsParams, "query"> & { query?: Omit<NonNullable<ListTransactionsParams["query"]>, "after"> };


export class TransactionsApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List wallet transactions
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.wallet_id query parameter
   * @param args.query.source_id query parameter
   * @param args.query.direction query parameter
   * @param args.query.status query parameter
   * @param args.query.currency query parameter
   * @param args.query.amount_min query parameter
   * @param args.query.amount_max query parameter
   * @param args.query.external_reference query parameter
   * @param args.query.entity_reference query parameter
   * @param args.query.occurred_from query parameter
   * @param args.query.occurred_to query parameter
   * @param args.query.received_from query parameter
   * @param args.query.received_to query parameter
   * @param args.query.q query parameter
   * @param args.query.after query parameter
   * @param args.query.limit query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.transactions.listWalletTransactions();
   */
  listWalletTransactions(args?: RequestParams<"list-wallet-transactions">): Promise<ResponseBody<"list-wallet-transactions">> {
    return this.transport.request("list-wallet-transactions", args);
  }

  /**
   * Get a wallet transaction
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Wallet transaction UUID.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.transactions.getWalletTransaction(params);
   */
  getWalletTransaction(args: RequestParams<"get-wallet-transaction">): Promise<ResponseBody<"get-wallet-transaction">> {
    return this.transport.request("get-wallet-transaction", args);
  }


  /** Iterate through every wallet transaction page using the API cursor. */
  async *iterateWalletTransactions(args?: IterateWalletTransactionsOptions): AsyncGenerator<WalletTransaction> {
    const query = args?.query;
    yield* iterateCursorPages<WalletTransaction, ResponseBody<"list-wallet-transactions">>(
      (after) => this.listWalletTransactions({ ...args, query: { ...query, ...(after ? { after } : {}) } }),
      (page) => page.transactions,
    );
  }
}
