import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class WalletsApi {
  constructor(private readonly transport: ApiTransport) {}

  listWallets(args?: RequestParams<"list-wallets">): Promise<ResponseBody<"list-wallets">> {
    return this.transport.request("list-wallets", args);
  }

  getWallet(args: RequestParams<"get-wallet">): Promise<ResponseBody<"get-wallet">> {
    return this.transport.request("get-wallet", args);
  }

  getWalletBalance(args: RequestParams<"get-wallet-balance">): Promise<ResponseBody<"get-wallet-balance">> {
    return this.transport.request("get-wallet-balance", args);
  }
}
