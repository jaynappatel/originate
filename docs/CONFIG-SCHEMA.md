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

A label used only to pick which starter config and vertical overlay seeded
this tenant — it has no runtime effect after generation. Changing it later
doesn't retroactively change anything; a tenant's actual behavior is fully
determined by `criteria`, `connectors`, `pipeline`, and `diligence` below.
`custom` means "start blank, no overlay."

## `vocabulary`

The two fields that most directly generalize the hardcoded "company" noun
and the hardcoded PROCEED/PASS verdict set. `entity`/`entityPlural` get
substituted into every template's prose. `verdicts` is an ordered list with
no fixed length or fixed words — `docs/VERTICAL-PLAYBOOKS.md` #7 (insurance
MGA) uses `["BIND", "DECLINE", "REFER"]`; VC uses four values including
`PROCEED_WITH_GAPS`. The diligence-memo template enforces that its final
line is exactly one of this list's values — enforced mechanically, the same
way Topwater's memo enforces PROCEED/PASS/etc. today, just reading the list
from config instead of a hardcoded string check.

## `pipeline.stages`

Directly generalizes Topwater's `widget/skills.config.json` — an ordered,
enable/disable list per stage. The one addition: any stage (most notably
every entry under `diligence`, see below) can be entirely absent rather than
merely disabled, for verticals like sales-agency where a stage's concept
doesn't apply at all.

## `criteria`
