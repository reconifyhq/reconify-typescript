# Upgrading to 2.0.0

The 2.0.0 client targets the public Reconify v2 contract at `/v2`.
Generated operation IDs now use stable `resource_action` identifiers and tags
use lowercase hyphenated names.

Use the following modules for the supported surface:

- metadata: API information and health
- events: event listing, event lookup, and issue-linked evidence
- ingestion: monitoring event batches
- issues: issue listing, lookup, assignment, notes, and linked data
- organization: organization and member reads

The public API uses snake_case wire fields and event_id or issue_id path
parameters exactly as described by OpenAPI. Existing v1 clients can continue
using `/v1`; v2 clients must use the v2 artifact and endpoint.
