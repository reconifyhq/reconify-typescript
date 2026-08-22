import type { ApiTransport } from "../core/transport.js";
import type { RequestParams, ResponseBody } from "../core/types.js";



export class OrganizationApi {
  constructor(private readonly transport: ApiTransport) {}

  /**
   * Get organization
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.organization.getOrganization();
   */
  getOrganization(args?: RequestParams<"organization_get">): Promise<ResponseBody<"organization_get">> {
    return this.transport.request("organization_get", args);
  }

  /**
   * List organization members
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.organization.listOrganizationMembers();
   */
  listOrganizationMembers(args?: RequestParams<"organization_list_members">): Promise<ResponseBody<"organization_list_members">> {
    return this.transport.request("organization_list_members", args);
  }

}
