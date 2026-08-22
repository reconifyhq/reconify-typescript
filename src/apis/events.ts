import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";
import { iterateCursorPages } from "../core/pagination.js";
import type { Event } from "../models.js";

type ListEventsParams = RequestParams<"events_list">;
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
  listEvents(args?: RequestParams<"events_list">): Promise<ResponseBody<"events_list">> {
    return this.transport.request("events_list", args);
  }

  /**
   * Get an event
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.event_id Event identifier.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.events.getEvent(params);
   */
  getEvent(args: RequestParams<"events_get">): Promise<ResponseBody<"events_get">> {
    return this.transport.request("events_get", args);
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
  listIssueEvents(args: RequestParams<"issues_list_events">): Promise<ResponseBody<"issues_list_events">> {
    return this.transport.request("issues_list_events", args);
  }


  /** Iterate through every event page using the API cursor. */
  async *iterateEvents(args?: IterateEventsOptions): AsyncGenerator<Event> {
    const query = args?.query;
    yield* iterateCursorPages<Event, ResponseBody<"events_list">>(
      (after) => this.listEvents({ ...args, query: { ...query, ...(after ? { after } : {}) } }),
      (page) => page.events,
    );
  }
}
