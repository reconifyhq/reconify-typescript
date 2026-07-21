import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class WalletsApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List wallets
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.status Filter by wallet source status.
   * @param args.query.q Case-insensitive wallet name prefix.
   * @param args.query.limit query parameter
   * @param args.query.offset query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.wallets.listWallets();
   */
  listWallets(args?: RequestParams<"list-wallets">): Promise<ResponseBody<"list-wallets">> {
    return this.transport.request("list-wallets", args);
  }

  /**
   * Get a wallet
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Wallet UUID.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.wallets.getWallet(params);
   */
  getWallet(args: RequestParams<"get-wallet">): Promise<ResponseBody<"get-wallet">> {
    return this.transport.request("get-wallet", args);
  }

  /**
   * Get a wallet observed balance
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Wallet UUID.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.wallets.getWalletBalance(params);
   */
  getWalletBalance(args: RequestParams<"get-wallet-balance">): Promise<ResponseBody<"get-wallet-balance">> {
    return this.transport.request("get-wallet-balance", args);
  }

}
