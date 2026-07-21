import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class EventsApi {
  constructor(private readonly transport: ApiTransport) {}

  listEvents(args?: RequestParams<"list-events">): Promise<ResponseBody<"list-events">> {
    return this.transport.request("list-events", args);
  }

  getEvent(args: RequestParams<"get-event">): Promise<ResponseBody<"get-event">> {
    return this.transport.request("get-event", args);
  }

  revealEventField(args: RequestParams<"reveal-event-field">): Promise<ResponseBody<"reveal-event-field">> {
    return this.transport.request("reveal-event-field", args);
  }
}
