import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class SearchApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * Search integrity resources
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.q Search event IDs, wallets, references, issues, and operations.
   * @param args.query.limit query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.search.searchIntegrityResources();
   */
  searchIntegrityResources(args?: RequestParams<"search-integrity-resources">): Promise<ResponseBody<"search-integrity-resources">> {
    return this.transport.request("search-integrity-resources", args);
  }

}
