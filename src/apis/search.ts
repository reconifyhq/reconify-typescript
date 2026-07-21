import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class SearchApi {
  constructor(private readonly transport: ApiTransport) {}

  searchIntegrityResources(args?: RequestParams<"search-integrity-resources">): Promise<ResponseBody<"search-integrity-resources">> {
    return this.transport.request("search-integrity-resources", args);
  }
}
