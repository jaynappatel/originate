# Originate — AI Sourcing & Diligence Copilot

Originate is a configurable pipeline for finding, qualifying, enriching, and
reaching out to a universe of targets — companies, candidates, properties,
prospects, or submissions — with a human approving anything risky before it
happens. It also runs a document-driven diligence pipeline: eight (or fewer)
specialist reviews of a locked set of documents, ending in an enforced
decision memo.

Originate isn't a single-industry tool. Venture capital sourcing is the
flagship vertical and the reference implementation — see
`templates/verticals/vc/`, which encodes Topwater Capital's own criteria as
the worked example — but the pipeline underneath is vertical-agnostic. See
`docs/VERTICAL-PLAYBOOKS.md` for how the same five stages map onto recruiting,
real estate acquisition, corp dev, sales development, and insurance
underwriting.

## Why this exists

Topwater Capital's own sourcing/diligence system
(`~/Desktop/topwater-workflows`) proved the pipeline shape, the permission
model, and the checkpointing engineering work. But everything that makes it
*Topwater's* is hardcoded — the scoring rubric lives in three files kept in
sync by a test, the connectors are a fixed four, and onboarding assumes one
person at one firm. Originate is that same proven engine, generalized so any
company can configure it for their own criteria, their own connectors, and
their own AI runtime, through a guided setup instead of hand-edited source.

`topwater-workflows` is untouched by this project and continues running
exactly as it does today, as Topwater Capital's own private instance.
Originate does not depend on it and is not a refactor of it — it's a new,
separate project that generalizes the same ideas.

## Read next

- **`docs/ARCHITECTURE.md`** — the full design: what generalizes, what
  doesn't, the config schema, the template system, and the onboarding flow.
- **`docs/VERTICAL-PLAYBOOKS.md`** — seven company archetypes and how each
  maps onto the pipeline.
- **`docs/CONFIG-SCHEMA.md`** — annotated walkthrough of
  `originate.config.json`.
- **`docs/CONNECTOR-CATALOG.md`** — the connector registry: what a connector
  declares, and the starting catalog.
- **`docs/ONBOARDING-FLOW.md`** — the 8-step guided setup, including the
  Claude Code vs. Codex choice.

## What's in this repo right now

This pass is a **design document plus a full scaffold** — schemas, templates,
and docs — not a running product. There is no generator script, no Electron
shell, and no execution engine yet; see "Explicit scope boundary" in
`docs/ARCHITECTURE.md` for exactly what's deferred and why the scaffold is
still precise enough to make building those a mechanical next step rather
than a redesign.

```
docs/          design documents (read these first)
schema/        originate.config.schema.json — the JSON Schema for a tenant's config
templates/
  core/        9 universal, vertical-agnostic SKILL.md templates
  verticals/   thin overlays per company archetype (vc, recruiting, real-estate)
  connectors/  the connector registry — one directory per data source / tool
standards/     ported, generalized OUTPUT / EVIDENCE / WRITING / GROUNDING rules
cli/           spec for the `originate` CLI (init/configure/generate/validate/run)
```
