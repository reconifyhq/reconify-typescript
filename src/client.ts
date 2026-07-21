import { AlertsApi } from "./apis/alerts.js";
import { EventsApi } from "./apis/events.js";
import { IngestionApi } from "./apis/ingestion.js";
import { IssuesApi } from "./apis/issues.js";
import { LedgerApi } from "./apis/ledger.js";
import { ReconciliationsApi } from "./apis/reconciliations.js";
import { SearchApi } from "./apis/search.js";
import { SetupApi } from "./apis/setup.js";
import { TransactionsApi } from "./apis/transactions.js";
import { WalletsApi } from "./apis/wallets.js";
import { ApiTransport, ReconifyApiError } from "./core/transport.js";
import type { ReconifyClientOptions } from "./core/types.js";

export class ReconifyClient {
  readonly alerts: AlertsApi;
  readonly events: EventsApi;
  readonly ingestion: IngestionApi;
  readonly issues: IssuesApi;
  readonly ledger: LedgerApi;
  readonly reconciliations: ReconciliationsApi;
  readonly search: SearchApi;
  readonly setup: SetupApi;
  readonly transactions: TransactionsApi;
  readonly wallets: WalletsApi;

  constructor(options: ReconifyClientOptions) {
    const transport = new ApiTransport(options);
    this.alerts = new AlertsApi(transport);
    this.events = new EventsApi(transport);
    this.ingestion = new IngestionApi(transport);
    this.issues = new IssuesApi(transport);
    this.ledger = new LedgerApi(transport);
    this.reconciliations = new ReconciliationsApi(transport);
    this.search = new SearchApi(transport);
    this.setup = new SetupApi(transport);
    this.transactions = new TransactionsApi(transport);
    this.wallets = new WalletsApi(transport);
  }
}

export { ReconifyApiError };
export type { FetchLike, ReconifyClientOptions, RequestParams, ResponseBody } from "./core/types.js";
