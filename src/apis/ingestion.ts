import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class IngestionApi {
  constructor(private readonly transport: ApiTransport) {}

  ingestIntegrityEvents(args: RequestParams<"ingest-integrity-events">): Promise<ResponseBody<"ingest-integrity-events">> {
    return this.transport.request("ingest-integrity-events", args);
  }

  ingestIntegrityTestEvents(args: RequestParams<"ingest-integrity-test-events">): Promise<ResponseBody<"ingest-integrity-test-events">> {
    return this.transport.request("ingest-integrity-test-events", args);
  }
}
