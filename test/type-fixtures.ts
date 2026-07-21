import type { AlertRule, CreateReconciliationInputBody, EventPage } from "../src/index.js";
import type { RequestParams, ResponseBody } from "../src/index.js";

const eventQuery: RequestParams<"list-events"> = {
  query: { source_id: "source-1", limit: 25 },
};
const eventPath: RequestParams<"get-event"> = { path: { id: "event-1" } };
// @ts-expect-error get-event requires its path parameter.
const missingEventPath: RequestParams<"get-event"> = {};
// @ts-expect-error list-events.limit is numeric in the OpenAPI contract.
const invalidEventQuery: RequestParams<"list-events"> = { query: { limit: "not-a-number" } };
const ingestionHeaders: RequestParams<"ingest-integrity-events"> = {
  headers: { "X-Integrity-Test-Session": "session-1" },
  body: {} as RequestParams<"ingest-integrity-events">["body"],
};
const alertRule: AlertRule = {
  breachEnabled: true,
  channels: [],
  controlId: "control-1",
  dedupWindowSeconds: 60,
  destinations: {},
  resolutionEnabled: true,
  severityMin: "medium",
};
const createReconciliation: RequestParams<"create-reconciliation"> = {
  body: {} as CreateReconciliationInputBody,
};
const eventResponse: ResponseBody<"list-events"> = {} as EventPage;

void eventQuery;
void eventPath;
void missingEventPath;
void invalidEventQuery;
void ingestionHeaders;
void alertRule;
void createReconciliation;
void eventResponse;
