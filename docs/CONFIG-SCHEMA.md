# `originate.config.json` — annotated schema walkthrough

The full, validatable schema is `schema/originate.config.schema.json`. This
document explains each section's intent and the design decisions behind it.
See `docs/ARCHITECTURE.md` §4 for why this file exists (it replaces
Topwater's CLAUDE.md-prose + `scoringRubric.ts` + SKILL.md-prose
triplication) and `docs/VERTICAL-PLAYBOOKS.md` for worked examples across
seven archetypes.

## `org`

Identity and voice. `voiceProfiles` generalizes Topwater's `SenderVoice`
pattern (`.claude/skills/draft-email/SKILL.md`, mechanically enforced in
`widget/src/` today) — a list rather than three hardcoded names, so a
one-partner shop and a twelve-recruiter agency both fit the same field.
`approverTitle` (default `"deal lead"`) and `thesisMultiple` (optional; only
present for verticals with a re-rate-style thesis) let templates render
correctly without a vertical-specific conditional baked into the shared
core.

## `vertical`
