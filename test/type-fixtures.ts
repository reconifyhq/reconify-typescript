import type { APIInfo, MonitoringBatchRequest, RequestParams, ResponseBody } from "../src/index.js";

const eventQuery: RequestParams<"list-events"> = {
  query: { limit: 25, after: "cursor" },
};
const eventPath: RequestParams<"get-event"> = { path: { event_id: "event-1" } };
const ingestion: RequestParams<"ingest-monitoring-events"> = {
  body: {} as MonitoringBatchRequest,
};
const issueAssignment: RequestParams<"update-issue"> = {
  path: { issue_id: "issue-1" },
  body: { assigned_to: null },
};
const metadata: ResponseBody<"get-api-info"> = {} as APIInfo;

void eventQuery;
void eventPath;
void ingestion;
void issueAssignment;
void metadata;
