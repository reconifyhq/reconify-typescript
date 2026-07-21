import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";

export class SetupApi {
  constructor(private readonly transport: ApiTransport) {}

  listSetupIntegrations(args?: RequestParams<"list-setup-integrations">): Promise<ResponseBody<"list-setup-integrations">> {
    return this.transport.request("list-setup-integrations", args);
  }

  getSetupIntegration(args: RequestParams<"get-setup-integration">): Promise<ResponseBody<"get-setup-integration">> {
    return this.transport.request("get-setup-integration", args);
  }

  listSetupSources(args?: RequestParams<"list-setup-sources">): Promise<ResponseBody<"list-setup-sources">> {
    return this.transport.request("list-setup-sources", args);
  }

  createSetupSource(args: RequestParams<"create-setup-source">): Promise<ResponseBody<"create-setup-source">> {
    return this.transport.request("create-setup-source", args);
  }

  disableSetupSource(args: RequestParams<"disable-setup-source">): Promise<ResponseBody<"disable-setup-source">> {
    return this.transport.request("disable-setup-source", args);
  }

  getSetupSource(args: RequestParams<"get-setup-source">): Promise<ResponseBody<"get-setup-source">> {
    return this.transport.request("get-setup-source", args);
  }

  updateSetupSource(args: RequestParams<"update-setup-source">): Promise<ResponseBody<"update-setup-source">> {
    return this.transport.request("update-setup-source", args);
  }

  createTestSession(args: RequestParams<"create-test-session">): Promise<ResponseBody<"create-test-session">> {
    return this.transport.request("create-test-session", args);
  }

  getTestSession(args: RequestParams<"get-test-session">): Promise<ResponseBody<"get-test-session">> {
    return this.transport.request("get-test-session", args);
  }

  getTestSessionResult(args: RequestParams<"get-test-session-result">): Promise<ResponseBody<"get-test-session-result">> {
    return this.transport.request("get-test-session-result", args);
  }

  retryTestSession(args: RequestParams<"retry-test-session">): Promise<ResponseBody<"retry-test-session">> {
    return this.transport.request("retry-test-session", args);
  }

  submitTestSessionEvents(args: RequestParams<"submit-test-session-events">): Promise<ResponseBody<"submit-test-session-events">> {
    return this.transport.request("submit-test-session-events", args);
  }
}
