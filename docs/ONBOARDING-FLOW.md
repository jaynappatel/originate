# Onboarding Flow

This is the centerpiece of what makes Originate a product rather than a
fork: a new company gets from "we want to do our own sourcing and
diligence" to a working, tailored instance without hand-editing source
files. Eight steps. Step 7 matters as much as steps 1-6: onboarding is not
a wizard a company completes once, it's the permanent interface for
changing how their instance works.

## 1. Archetype pick

Choose a starter vertical (`vc`, `pe`, `recruiting`, `real-estate`,
`corp-dev`, `sales-agency`, `insurance-mga`) or `custom` (blank). This only
selects which `templates/verticals/<name>/config.starter.json` and which
additive skill overlay seed the new tenant's config — nothing is locked in.
A company can pick the closest archetype and diverge from it freely in step
3.

## 2. Choose your agent runtime(s)

Two separate choices — see `docs/ARCHITECTURE.md` §6 for why conflating
them is the likely mistake:

- **Skill-editing assistant** (`agentRuntime.skillEditing`): Claude Code,
  Codex, or both, offered side by side. This is who the company talks to,
  now and later, to author and edit `originate.config.json` and the
  rendered `.claude/skills/*` files.
- **Pipeline execution runtime** (`agentRuntime.primary`): Claude Code or
  Codex — exactly one. The wizard states plainly, before this choice is
  made, that today's connectors are wired through Claude Code's native
  MCP/connector model tied to the user's Claude.ai sign-in, and that
  choosing Codex here means connector support depends on that connector
  having a Codex-side adapter (`docs/CONNECTOR-CATALOG.md` tracks which
  connectors have one). This is not hidden in fine print — a company
  choosing Codex as primary should see, connector by connector, which of
  their chosen connectors actually work today versus which are "not yet
  ported."

## 3. Guided criteria interview

A chat session with whichever assistant was picked in step 2 walks the
company through the `criteria` schema section by section:
`immediatePass` → `tiers` → `judgmentSignals` → `redFlags` →
`onMissingData`. After each section, the wizard shows the generated
JSON *and* a plain-English restatement, and asks for explicit confirmation
before moving to the next section — the same "approve before spend"
philosophy as Topwater's category-research human gate today, applied to
setup itself rather than only to pipeline runs.

The interview prompt is itself a template
(`onboarding/interview-prompt.md.tmpl`, not built in this pass — spec only)
that knows the JSON Schema it's filling in and asks concrete, example-driven
questions rather than "what are your criteria?" — e.g. for `tiers`: "What's
the minimum [ARR / years of experience / cap rate] for something you'd
reach out to immediately?" with the vertical's starter config's own
thresholds shown as an editable example, not a blank field.

## 4. Connector selection

Present the catalog (`docs/CONNECTOR-CATALOG.md`) grouped by stage role —
discovery, enrichment, CRM, comms, documents — and let the company pick one
or none per role (more than one is allowed for `discovery`/`crm`; the
`criteria`/`connectors` schema doesn't cap it). For each connector chosen,
walk credential setup checked **at the point it's actually needed**, not
all up front — this reuses Topwater's own `onboarding.ts` pattern (workspace
and credential checks fire only when a run actually needs them, and clear
themselves automatically once fixed) rather than a blanket "connect
everything before you can start" gate.

## 5. Generate

Run the template generator (spec in `cli/README.md` — not implemented in
this pass) against the finished `originate.config.json`: render each
`templates/core/*/SKILL.md.tmpl` (plus any vertical-overlay additions) into
the tenant's real `.claude/skills/*/SKILL.md`, and scaffold the tenant's
workspace (`sourcing/`, `diligence/` if enabled, `docs/`, `outputs/`)
matching Topwater's proven O1-O5 output-standards layout (see
`standards/OUTPUT-STANDARDS.md`).

## 6. Dry-run

Before trusting the instance with a real batch, run Stage A (thesis/
category) and a small Stage B (discovery) sample — a handful of entities,
not the full universe — so the company sees real, tailored output before
committing spend. This surfaces config mistakes (a tier threshold that's
clearly wrong for this market, a connector returning fields the criteria
don't reference) while they're still cheap to fix.

## 7. Ongoing edit loop
