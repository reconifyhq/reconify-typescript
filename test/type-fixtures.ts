import type { APIInfo, MonitoringBatchRequest, RequestParams, ResponseBody } from "../src/index.js";

const eventQuery: RequestParams<"events_list"> = {
  query: { limit: 25, after: "cursor" },
};
const eventPath: RequestParams<"events_get"> = { path: { event_id: "event-1" } };
const ingestion: RequestParams<"events_ingest"> = {
  body: {} as MonitoringBatchRequest,
};
const issueAssignment: RequestParams<"issues_assign"> = {
  path: { issue_id: "issue-1" },
  body: { assigned_to: null },
};
const metadata: ResponseBody<"api_info_get"> = {} as APIInfo;

void eventQuery;
void eventPath;
void ingestion;
void issueAssignment;
void metadata;
