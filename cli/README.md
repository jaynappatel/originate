# `originate` CLI — spec only (not implemented in this pass)

This is a specification for the follow-on generator/CLI, written precisely
enough that implementing it is mechanical — read config, resolve
placeholders, write files — not a redesign. See
`docs/ARCHITECTURE.md` §9 for the explicit scope boundary: no code in this
directory yet.

## Commands

### `originate init [--vertical <name>]`

Interactive: runs onboarding steps 1-4
(`docs/ONBOARDING-FLOW.md`) — archetype pick, agent runtime choice, guided
criteria interview, connector selection — and writes the resulting
`originate.config.json` to the new tenant workspace root. Validates the
result against `schema/originate.config.schema.json` before proceeding;
refuses to write an invalid config.

### `originate configure`

Reopens the guided criteria interview and connector selection against an
**existing** `originate.config.json` — the permanent "edit my skills" entry
point (onboarding step 7). Shows a diff of what would change before
writing.

### `originate generate`

The template renderer (onboarding step 5). For each
`templates/core/*/SKILL.md.tmpl`, plus any additive skills named by the
tenant's vertical overlay:

1. Load `originate.config.json`.
2. Resolve every `{{path.to.value}}` placeholder against the config
   (dotted-path lookup; `{{#if x}}...{{/if}}` and `{{#each list}}...{{/each}}`
   blocks per the mustache-style syntax used throughout `templates/core/`).
3. Where `diligence.enabled` is true, instantiate
   `templates/core/diligence-specialist/SKILL.md.tmpl` once per
   `diligence.specialists` entry, writing each to its own
   `.claude/skills/<specialist.id>/SKILL.md`.
4. Write every resolved file to the tenant workspace's `.claude/skills/`,
   and scaffold `sourcing/`, `diligence/` (if enabled), `docs/`, `outputs/`
   matching `standards/OUTPUT-STANDARDS.md`'s Rule O1 layout.
5. Never overwrites a tenant's manually-edited skill file silently — if a
   file exists and its content doesn't match what the last `generate` run
   produced (tracked via a checksum sidecar), warn and require an explicit
   `--force` or a merge, the same "never silently clobber in-progress work"
   principle that governs the destructive-action guidance for any agent
   operating on a user's files.

### `originate validate`

Validates `originate.config.json` against the schema, and additionally
checks: every `connectors.*` entry names a real id from
`templates/connectors/`; every `diligence.specialists[].folder` is unique
unless paired with `sharedFolderOk: true`; every `vocabulary.verdicts`
entry is uppercase-with-underscores (matching what `diligence-memo`'s
mechanical verdict check expects).

### `originate run <stage>`

Dispatches the named stage's rendered skill via whichever runtime
`agentRuntime.primary` names (Claude Code or Codex), inheriting the
point-of-use permission gating and checkpointing behavior specified in
`docs/ARCHITECTURE.md` §3. This is the actual execution engine and is the
single largest piece of work deferred past this scaffold — it's also where
the Codex adapter layer (§6 of `ARCHITECTURE.md`) has to exist for any
connector whose `codexAdapterStatus` is `not-yet-ported`.

## What this spec deliberately does not decide

Whether the renderer is a Node script, a Python script, or built into a
future Electron shell's main process — that's an implementation choice for
whoever picks this up, not a platform-level decision this scaffold needs to
lock in.
