# Upgrading to 1.0.0

The 1.0.0 client is rebuilt against the current public Reconify v1 contract.
It removes methods that described private or retired ledger, wallet, setup,
search, alert, and reconciliation routes.

Use the following modules for the supported surface:

- metadata: API information and health
- events: event listing, event lookup, and issue-linked evidence
- ingestion: monitoring event batches
- issues: issue listing, lookup, assignment, notes, and linked data
- organization: organization and member reads

The public API uses snake_case wire fields and event_id or issue_id path
parameters exactly as described by OpenAPI. Regenerate from the pinned public
contract when upgrading the API version.
