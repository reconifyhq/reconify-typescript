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
  getOrganization(args?: RequestParams<"get-organization">): Promise<ResponseBody<"get-organization">> {
    return this.transport.request("get-organization", args);
  }

  /**
   * List organization members
   * @param args Typed request parameters from the OpenAPI contract.
   * @param args.request Optional cancellation, timeout, and retry controls.
   * @example
   * const result = await client.organization.listOrganizationMembers();
   */
  listOrganizationMembers(args?: RequestParams<"list-organization-members">): Promise<ResponseBody<"list-organization-members">> {
    return this.transport.request("list-organization-members", args);
  }

}
