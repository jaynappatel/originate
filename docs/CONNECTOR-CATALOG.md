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

**There is no `commsSend` flag, anywhere in this catalog, by design.** This
is what makes Topwater's "nothing sends itself" guarantee structural rather
than a prompt-level policy: a comms connector that could send would need a
capability this schema has no name for, so declaring one would fail
validation, not just violate a convention. If a future connector's
underlying API technically supports sending, the connector's own
`connector.json` must not declare a `commsSend`-shaped capability under any
name — draft-only is enforced at the capability-contract layer, not left to
the skill prompt's good judgment (the same reasoning Topwater's actual Gmail
integration already applies: no send tool wired at any layer, not a policy
the agent is trusted to follow).

## Starting catalog (this pass)

Ported directly from Topwater's actual integrations, reached via the
tenant's own Claude.ai/Codex sign-in (native MCP), same as today:

| id | Roles | Notes |
|---|---|---|
| `grata` | discovery | Company search/pull. Minimum-field discipline (5 fields only) carried into its `prompt-fragment.md` verbatim from Topwater's CLAUDE.md Section 5. |
| `affinity` | crmRead, crmWrite | CRM check-before-contact and write-back. |
| `clay` | enrichment | Paid per-company enrichment, gated to qualifying tiers only. |
| `gmail` | commsDraft | Draft-only, structurally — see above. |
| `google-drive` | docs | Data-room / shared-drive document access for diligence. |

New for other verticals (§`docs/VERTICAL-PLAYBOOKS.md`), specified to the
same contract shape so a tenant can wire them in without the platform
treating them as second-class:

| id | Roles | Vertical | Notes |
|---|---|---|---|
| `apollo` | discovery, enrichment | Sales agency | Prospect database; higher-volume, thinner-per-record profile than Grata. |
| `salesforce` | crmRead, crmWrite | Sales agency, corp dev | Generic CRM check/write-back in place of Affinity. |
| `linkedin-recruiter` | discovery | Recruiting | Candidate sourcing. Also see the ATS collector pattern below. |
| `costar` | discovery, enrichment | Real estate | Listings + comps/zoning/tax enrichment from one source. |

### A note on the recruiting vertical's discovery connectors

Topwater's widget already has ATS collectors —
`widget/src/atsGreenhouseCollector.ts`, `atsLeverCollector.ts`,
`atsAshbyCollector.ts`, `atsLoxoCollector.ts`, `atsCareerspageCollector.ts`,
plus `atsDetect.ts` to identify which ATS a target uses. These map onto
Originate's `discovery` connector role directly and near-verbatim for the
recruiting vertical — they were built for a different purpose in Topwater
(finding hiring signals as a scoring input, not candidate sourcing), but the
underlying connector code is exactly "pull a list of people/postings from
this ATS," which is the recruiting vertical's Stage B. Worth flagging as a
concrete, low-risk port when the execution engine is actually built,
because the code already exists and is already tested.
