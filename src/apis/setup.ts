import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class SetupApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * List integrations
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.listSetupIntegrations();
   */
  listSetupIntegrations(args?: RequestParams<"list-setup-integrations">): Promise<ResponseBody<"list-setup-integrations">> {
    return this.transport.request("list-setup-integrations", args);
  }

  /**
   * Get an integration
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.getSetupIntegration(params);
   */
  getSetupIntegration(args: RequestParams<"get-setup-integration">): Promise<ResponseBody<"get-setup-integration">> {
    return this.transport.request("get-setup-integration", args);
  }

  /**
   * List integrity sources
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.query.limit query parameter
   * @param args.query.offset query parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.listSetupSources();
   */
  listSetupSources(args?: RequestParams<"list-setup-sources">): Promise<ResponseBody<"list-setup-sources">> {
    return this.transport.request("list-setup-sources", args);
  }

  /**
   * Create an integrity source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.createSetupSource(params);
   */
  createSetupSource(args: RequestParams<"create-setup-source">): Promise<ResponseBody<"create-setup-source">> {
    return this.transport.request("create-setup-source", args);
  }

  /**
   * Disable an integrity source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Integrity source UUID.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.disableSetupSource(params);
   */
  disableSetupSource(args: RequestParams<"disable-setup-source">): Promise<ResponseBody<"disable-setup-source">> {
    return this.transport.request("disable-setup-source", args);
  }

  /**
   * Get an integrity source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id Integrity source UUID.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.getSetupSource(params);
   */
  getSetupSource(args: RequestParams<"get-setup-source">): Promise<ResponseBody<"get-setup-source">> {
    return this.transport.request("get-setup-source", args);
  }

  /**
   * Update an integrity source
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.updateSetupSource(params);
   */
  updateSetupSource(args: RequestParams<"update-setup-source">): Promise<ResponseBody<"update-setup-source">> {
    return this.transport.request("update-setup-source", args);
  }

  /**
   * Create an integrity test session
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.createTestSession(params);
   */
  createTestSession(args: RequestParams<"create-test-session">): Promise<ResponseBody<"create-test-session">> {
    return this.transport.request("create-test-session", args);
  }

  /**
   * Get an integrity test session
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.getTestSession(params);
   */
  getTestSession(args: RequestParams<"get-test-session">): Promise<ResponseBody<"get-test-session">> {
    return this.transport.request("get-test-session", args);
  }

  /**
   * Get an integrity test session
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.getTestSessionResult(params);
   */
  getTestSessionResult(args: RequestParams<"get-test-session-result">): Promise<ResponseBody<"get-test-session-result">> {
    return this.transport.request("get-test-session-result", args);
  }

  /**
   * Retry an integrity test session
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.retryTestSession(params);
   */
  retryTestSession(args: RequestParams<"retry-test-session">): Promise<ResponseBody<"retry-test-session">> {
    return this.transport.request("retry-test-session", args);
  }

  /**
   * Submit isolated test events
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.path.id path parameter
   * @param args.headers.X-Integrity-Test-Session header parameter
   * @param args.body JSON request body.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.setup.submitTestSessionEvents(params);
   */
  submitTestSessionEvents(args: RequestParams<"submit-test-session-events">): Promise<ResponseBody<"submit-test-session-events">> {
    return this.transport.request("submit-test-session-events", args);
  }

}
