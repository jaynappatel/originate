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
