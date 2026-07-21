import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class IngestionApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * Submit integrity events
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.headers.X-Integrity-Test-Session Required for test events; identifies the active isolated test session.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ingestion.ingestIntegrityEvents(params);
   */
  ingestIntegrityEvents(args: RequestParams<"ingest-integrity-events">): Promise<ResponseBody<"ingest-integrity-events">> {
    return this.transport.request("ingest-integrity-events", args);
  }

  /**
   * Submit integrity events
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.headers.X-Integrity-Test-Session Required for test events; identifies the active isolated test session.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.ingestion.ingestIntegrityTestEvents(params);
   */
  ingestIntegrityTestEvents(args: RequestParams<"ingest-integrity-test-events">): Promise<ResponseBody<"ingest-integrity-test-events">> {
    return this.transport.request("ingest-integrity-test-events", args);
  }

}
