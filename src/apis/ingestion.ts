import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class IngestionApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * Submit monitoring events
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ingestion.ingestMonitoringEvents(params);
   */
  ingestMonitoringEvents(args: RequestParams<"events_ingest">): Promise<ResponseBody<"events_ingest">> {
    return this.transport.request("events_ingest", args);
  }

}
