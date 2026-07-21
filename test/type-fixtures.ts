import type { AlertRule, CreateReconciliationInputBody, EventPage } from "../src/index.js";
import type { RequestParams, ResponseBody } from "../src/index.js";

const eventQuery: RequestParams<"list-events"> = {
  query: { source_id: "source-1", limit: 25 },
};
const eventPath: RequestParams<"get-event"> = { path: { id: "event-1" } };
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
void alertRule;
void createReconciliation;
void eventResponse;
