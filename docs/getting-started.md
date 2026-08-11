# Getting started

## Install

    npm install @reconifyhq/sdk

The SDK requires Node.js 18 or newer and uses the platform fetch API by
default.

## Configure a client

    import { ReconifyClient } from "@reconifyhq/sdk";

    const client = new ReconifyClient({
      apiKey: process.env.RECONIFY_API_KEY!,
      baseUrl: "https://api.reconifyhq.com",
    });

The key is sent as Authorization: Bearer <apiKey>. Store it in an environment
variable or secret manager. The client accepts a URL with or without /v1 and
normalizes trailing slashes.

## Submit monitoring events

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

Keep event IDs stable when retrying ingestion. The API returns per-event
accepted, duplicate, or rejected results.

## Read events and issues

    const page = await client.events.listEvents({ query: { limit: 25 } });
    const event = await client.events.getEvent({
      path: { event_id: page.events[0].id },
    });
    const issues = await client.issues.listIssues({ query: { limit: 25 } });

The public modules are metadata, events, ingestion, issues, and organization.
All operations use generated request and response types.

Continue with Request options for cancellation, retries, pagination, and
structured errors, or see Workflows.
