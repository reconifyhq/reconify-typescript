import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";
import { iterateCursorPages } from "../core/pagination.js";
import type { Event } from "../models.js";

type ListEventsParams = RequestParams<"list-events">;
export type IterateEventsOptions = Omit<ListEventsParams, "query"> & { query?: Omit<NonNullable<ListEventsParams["query"]>, "after"> };


export class EventsApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List canonical events
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.source_id query parameter
   * @param args.query.event_type query parameter
   * @param args.query.correlation_namespace query parameter
   * @param args.query.external_reference query parameter
   * @param args.query.currency query parameter
   * @param args.query.amount_min query parameter
   * @param args.query.amount_max query parameter
   * @param args.query.q query parameter
   * @param args.query.processing_status query parameter
   * @param args.query.outcome query parameter
   * @param args.query.occurred_from query parameter
   * @param args.query.occurred_to query parameter
   * @param args.query.received_from query parameter
   * @param args.query.received_to query parameter
   * @param args.query.after query parameter
   * @param args.query.limit query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.listEvents();
   */
  listEvents(args?: RequestParams<"list-events">): Promise<ResponseBody<"list-events">> {
    return this.transport.request("list-events", args);
  }

  /**
   * Get a canonical event
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.getEvent(params);
   */
  getEvent(args: RequestParams<"get-event">): Promise<ResponseBody<"get-event">> {
    return this.transport.request("get-event", args);
  }

  /**
   * Reveal an audited event field
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.query.field query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.revealEventField(params);
   */
  revealEventField(args: RequestParams<"reveal-event-field">): Promise<ResponseBody<"reveal-event-field">> {
    return this.transport.request("reveal-event-field", args);
  }


  /** Iterate through every event page using the API cursor. */
  async *iterateEvents(args?: IterateEventsOptions): AsyncGenerator<Event> {
    const query = args?.query;
    yield* iterateCursorPages<Event, ResponseBody<"list-events">>(
      (after) => this.listEvents({ ...args, query: { ...query, ...(after ? { after } : {}) } }),
      (page) => page.events,
    );
  }
}
