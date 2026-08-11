import type { operations } from "./openapi-types.js";

export const publicOperations = [
  {"method":"GET","path":"/v1","operationId":"get-api-info","methodName":"getApiInfo","tag":"API Metadata","module":"metadata","className":"MetadataApi","requiresArgs":false},
  {"method":"GET","path":"/v1/events","operationId":"list-events","methodName":"listEvents","tag":"Event Reads","module":"events","className":"EventsApi","requiresArgs":false},
  {"method":"POST","path":"/v1/events","operationId":"ingest-monitoring-events","methodName":"ingestMonitoringEvents","tag":"Event Ingestion API","module":"ingestion","className":"IngestionApi","requiresArgs":true},
  {"method":"GET","path":"/v1/events/{event_id}","operationId":"get-event","methodName":"getEvent","tag":"Event Reads","module":"events","className":"EventsApi","requiresArgs":true},
  {"method":"GET","path":"/v1/health","operationId":"get-health","methodName":"getHealth","tag":"API Metadata","module":"metadata","className":"MetadataApi","requiresArgs":false},
  {"method":"GET","path":"/v1/issues","operationId":"list-issues","methodName":"listIssues","tag":"Issue Operations","module":"issues","className":"IssuesApi","requiresArgs":false},
  {"method":"GET","path":"/v1/issues/{issue_id}","operationId":"get-issue","methodName":"getIssue","tag":"Issue Operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"PATCH","path":"/v1/issues/{issue_id}","operationId":"update-issue","methodName":"updateIssue","tag":"Issue Operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"GET","path":"/v1/issues/{issue_id}/events","operationId":"list-issue-events","methodName":"listIssueEvents","tag":"Event Reads","module":"events","className":"EventsApi","requiresArgs":true},
  {"method":"GET","path":"/v1/issues/{issue_id}/notes","operationId":"list-issue-notes","methodName":"listIssueNotes","tag":"Issue Operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"POST","path":"/v1/issues/{issue_id}/notes","operationId":"add-issue-note","methodName":"addIssueNote","tag":"Issue Operations","module":"issues","className":"IssuesApi","requiresArgs":true},
  {"method":"GET","path":"/v1/organization","operationId":"get-organization","methodName":"getOrganization","tag":"Organization","module":"organization","className":"OrganizationApi","requiresArgs":false},
  {"method":"GET","path":"/v1/organization/members","operationId":"list-organization-members","methodName":"listOrganizationMembers","tag":"Organization","module":"organization","className":"OrganizationApi","requiresArgs":false},
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
