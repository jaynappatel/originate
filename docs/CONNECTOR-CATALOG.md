# Connector Catalog

A connector is anything that fills one of five stage roles from
`originate.config.json`'s `connectors` block: `discovery`, `enrichment`,
`crm` (read and/or write), `comms` (draft only — see below), `documentStore`.
Each connector directory under `templates/connectors/<id>/` holds:

- **`connector.json`** — the machine-readable capability contract: which
  roles it can fill, which capability flags it declares, required scopes,
  and notes on how it's actually reached (native MCP under the user's own
  Claude.ai/Codex sign-in, vs. a tenant-scoped API key stored locally).
- **`prompt-fragment.md`** — the prose a rendered skill template splices in
  to tell the agent *how* to call this connector's tools correctly (field
  limits, caching rules, what "5 fields only, never more" means for this
  particular source, etc.) — the connector-specific analog of a Topwater
  skill's own inline instructions today.

## The capability contract

Every `connector.json` declares a subset of:

| Flag | Means |
|---|---|
| `discovery` | Can produce a broad candidate/entity list from a search or an inbound queue |
| `enrichment` | Can pull deeper, usually paid, per-entity data |
| `crmRead` | Can check prior contact/history before any outreach |
| `crmWrite` | Can write scored/qualified entities back as CRM records |
| `commsDraft` | Can create a draft in some outbound channel |
| `docs` | Can read/list documents in a data room or shared drive |
