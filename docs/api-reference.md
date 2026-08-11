# API reference

The supported entrypoint is @reconifyhq/sdk. The public client currently
exposes exactly 13 operations from the public /v1 OpenAPI contract.

## Metadata

| Operation | Example |
| --- | --- |
| getApiInfo | await client.metadata.getApiInfo(); |
| getHealth | await client.metadata.getHealth(); |

## Events

| Operation | Example |
| --- | --- |
| listEvents | await client.events.listEvents({ query: { limit: 25 } }); |
| getEvent | await client.events.getEvent({ path: { event_id: "event-123" } }); |
| listIssueEvents | await client.events.listIssueEvents({ path: { issue_id: "issue-123" } }); |

    for await (const event of client.events.iterateEvents({ query: { limit: 100 } })) {
      console.log(event.id);
    }

## Ingestion

    import type { RequestParams } from "@reconifyhq/sdk";

    const batch: RequestParams<"ingest-monitoring-events">["body"] = {
      events: [
        {
          flow: "payment_to_wallet",
          type: "payment.succeeded",
          reference: "order-123",
          entity_id: "wallet-123",
        },
      ],
    };

| Operation | Example |
| --- | --- |
| ingestMonitoringEvents | await client.ingestion.ingestMonitoringEvents({ body: batch }); |

## Issues

| Operation | Example |
| --- | --- |
| listIssues | await client.issues.listIssues({ query: { limit: 25 } }); |
| getIssue | await client.issues.getIssue({ path: { issue_id: "issue-123" } }); |
| updateIssue | await client.issues.updateIssue({ path: { issue_id: "issue-123" }, body: { assigned_to: "user-123" } }); |
| listIssueNotes | await client.issues.listIssueNotes({ path: { issue_id: "issue-123" } }); |
| addIssueNote | await client.issues.addIssueNote({ path: { issue_id: "issue-123" }, headers: { "Idempotency-Key": "note-123" }, body: { body: "Investigating." } }); |

    for await (const issue of client.issues.iterateIssues({ query: { limit: 100 } })) {
      console.log(issue.id);
    }

## Organization

| Operation | Example |
| --- | --- |
| getOrganization | await client.organization.getOrganization(); |
| listOrganizationMembers | await client.organization.listOrganizationMembers(); |

## Common request controls

Every operation accepts generated request controls for cancellation, timeouts,
and bounded retries. See Request options.

## Exports and migration

The package exports ReconifyClient, typed API modules, structured error
classes, request/response helpers, generated model types, and public operation
metadata. The former ledger, wallet, setup, search, alert, and reconciliation
resources were removed in 1.0.0; see the migration guide.
