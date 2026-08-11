import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class MetadataApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * Get API information
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.metadata.getApiInfo();
   */
  getApiInfo(args?: RequestParams<"get-api-info">): Promise<ResponseBody<"get-api-info">> {
    return this.transport.request("get-api-info", args);
  }

  /**
   * Get public health status
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.metadata.getHealth();
   */
  getHealth(args?: RequestParams<"get-health">): Promise<ResponseBody<"get-health">> {
    return this.transport.request("get-health", args);
  }

}
