import { EventsApi } from "./apis/events.js";
import { IngestionApi } from "./apis/ingestion.js";
import { IssuesApi } from "./apis/issues.js";
import { MetadataApi } from "./apis/metadata.js";
import { OrganizationApi } from "./apis/organization.js";
import { ApiTransport, ReconifyApiError, ReconifyTimeoutError } from "./core/transport.js";
import type { ReconifyClientOptions } from "./core/types.js";

export class ReconifyClient {
  readonly metadata: MetadataApi;
  readonly events: EventsApi;
  readonly ingestion: IngestionApi;
  readonly issues: IssuesApi;
  readonly organization: OrganizationApi;

  constructor(options: ReconifyClientOptions) {
    const transport = new ApiTransport(options);
    this.metadata = new MetadataApi(transport);
    this.events = new EventsApi(transport);
    this.ingestion = new IngestionApi(transport);
    this.issues = new IssuesApi(transport);
    this.organization = new OrganizationApi(transport);
  }
}

export { ReconifyApiError, ReconifyTimeoutError };
export type { FetchLike, ReconifyClientOptions, RequestParams, ResponseBody } from "./core/types.js";
