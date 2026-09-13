import type { operations } from "./openapi-types.js";

export const publicOperations = [
  {"method":"GET","path":"/v2","operationId":"api_info_get","methodName":"getApiInfo","tag":"api-metadata","module":"metadata","className":"MetadataApi","requiresArgs":false},
  {"method":"GET","path":"/v2/events","operationId":"events_list","methodName":"listEvents","tag":"event-reads","module":"events","className":"EventsApi","requiresArgs":false},
  {"method":"POST","path":"/v2/events","operationId":"events_ingest","methodName":"ingestMonitoringEvents","tag":"event-ingestion","module":"ingestion","className":"IngestionApi","requiresArgs":true},
  {"method":"GET","path":"/v2/events/{event_id}","operationId":"events_get","methodName":"getEvent","tag":"event-reads","module":"events","className":"EventsApi","requiresArgs":true},
  {"method":"GET","path":"/v2/health","operationId":"health_get","methodName":"getHealth","tag":"api-metadata","module":"metadata","className":"MetadataApi","requiresArgs":false},
  {"method":"GET","path":"/v2/issues","operationId":"issues_list","methodName":"listIssues","tag":"issue-operations","module":"issues","className":"IssuesApi","requiresArgs":false},
  {"method":"GET","path":"/v2/issues/{issue_id}","operationId":"issues_get","methodName":"getIssue","tag":"issue-operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"PATCH","path":"/v2/issues/{issue_id}","operationId":"issues_assign","methodName":"updateIssue","tag":"issue-operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"GET","path":"/v2/issues/{issue_id}/events","operationId":"issues_list_events","methodName":"listIssueEvents","tag":"event-reads","module":"events","className":"EventsApi","requiresArgs":true},
  {"method":"GET","path":"/v2/issues/{issue_id}/notes","operationId":"issues_list_notes","methodName":"listIssueNotes","tag":"issue-operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"POST","path":"/v2/issues/{issue_id}/notes","operationId":"issues_add_note","methodName":"addIssueNote","tag":"issue-operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"POST","path":"/v2/onchain-sources","operationId":"register-onchain-source","methodName":"registerOnchainSource","tag":"event-ingestion","module":"ingestion","className":"IngestionApi","requiresArgs":true},
  {"method":"GET","path":"/v2/organization","operationId":"organization_get","methodName":"getOrganization","tag":"organization","module":"organization","className":"OrganizationApi","requiresArgs":false},
  {"method":"GET","path":"/v2/organization/members","operationId":"organization_list_members","methodName":"listOrganizationMembers","tag":"organization","module":"organization","className":"OrganizationApi","requiresArgs":false},
] as const satisfies readonly PublicOperation[];

export const operationById = Object.fromEntries(
  publicOperations.map((operation) => [operation.operationId, operation]),
) as { [Id in PublicOperationId]: Extract<(typeof publicOperations)[number], { operationId: Id }> };

export interface PublicOperation {
  readonly method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly path: string;
  readonly operationId: keyof operations & string;
  readonly methodName: string;
  readonly tag: string;
  readonly module: string;
  readonly className: string;
  readonly requiresArgs: boolean;
}

export type PublicOperationId = (typeof publicOperations)[number]["operationId"];
export type PublicMethodName = (typeof publicOperations)[number]["methodName"];
