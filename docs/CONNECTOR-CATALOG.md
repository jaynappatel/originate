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
