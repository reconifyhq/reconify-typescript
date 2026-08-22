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
  getApiInfo(args?: RequestParams<"api_info_get">): Promise<ResponseBody<"api_info_get">> {
    return this.transport.request("api_info_get", args);
  }

  /**
   * Get public health status
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.metadata.getHealth();
   */
  getHealth(args?: RequestParams<"health_get">): Promise<ResponseBody<"health_get">> {
    return this.transport.request("health_get", args);
  }

}
