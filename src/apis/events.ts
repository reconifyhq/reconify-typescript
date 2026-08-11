import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";
import { iterateCursorPages } from "../core/pagination.js";
import type { Event } from "../models.js";

type ListEventsParams = RequestParams<"list-events">;
export type IterateEventsOptions = Omit<ListEventsParams, "query"> & { query?: Omit<NonNullable<ListEventsParams["query"]>, "after"> };


export class EventsApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List events
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.limit Number of records to return.
   * @param args.query.after Opaque cursor returned by the previous response.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.listEvents();
   */
  listEvents(args?: RequestParams<"list-events">): Promise<ResponseBody<"list-events">> {
    return this.transport.request("list-events", args);
  }

  /**
   * Get an event
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.event_id Event identifier.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.getEvent(params);
   */
  getEvent(args: RequestParams<"get-event">): Promise<ResponseBody<"get-event">> {
    return this.transport.request("get-event", args);
  }

  /**
   * List issue evidence
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.issue_id Issue identifier.
   * @param args.query.limit Number of records to return.
   * @param args.query.after Opaque cursor returned by the previous response.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.listIssueEvents(params);
   */
  listIssueEvents(args: RequestParams<"list-issue-events">): Promise<ResponseBody<"list-issue-events">> {
    return this.transport.request("list-issue-events", args);
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
