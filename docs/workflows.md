# Workflows

All examples assume a configured ReconifyClient.

## Ingest and inspect events

    const result = await client.ingestion.ingestMonitoringEvents({
      body: {
        events: [
          {
            flow: "payment_to_wallet",
            type: "payment.succeeded",
            reference: "order-123",
            entity_id: "wallet-123",
          },
        ],
      },
    });

    for await (const event of client.events.iterateEvents({ query: { limit: 100 } })) {
      console.log(event.id, event.status);
    }

Keep event identifiers stable when retrying the same ingestion batch. Inspect
per-event results for accepted, duplicate, and rejected outcomes.

## Investigate issues

    for await (const issue of client.issues.iterateIssues({ query: { limit: 100 } })) {
      const detail = await client.issues.getIssue({
        path: { issue_id: issue.id },
      });
      console.log(detail.id, detail.status);
    }

    await client.issues.addIssueNote({
      path: { issue_id: "issue-123" },
      headers: { "Idempotency-Key": "note-123" },
      body: { body: "Reviewed the evidence." },
    });

Assignment updates use updateIssue; linked event and note collections use
listIssueEvents and listIssueNotes.

## Organization metadata

    const info = await client.metadata.getApiInfo();
    const health = await client.metadata.getHealth();
    const organization = await client.organization.getOrganization();
    const members = await client.organization.listOrganizationMembers();

These operations expose API metadata, service health, and organization/member
information available to the authenticated API key.

## Contract synchronization

    npm run fetch-contract
    npm run generate
    npm run coverage

The SDK consumes the public versioned contract from the docs manifest. Use
RECONIFY_OPENAPI_SPEC=/path/to/reconify.openapi.json for local contract work;
the SDK does not require a sibling SaaS checkout.
