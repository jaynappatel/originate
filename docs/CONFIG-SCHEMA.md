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

The predicate DSL — see `ARCHITECTURE.md` §4 for why it's intentionally
small. Four parts:

- **`immediatePass`** — hard stop-and-pass rules, checked first, before any
  other work (generalizes Topwater's Section 2 "Immediate Pass Criteria").
- **`tiers`** — ordered list of `{name, rules[]}`; a candidate/company/
  property matches the first tier (in list order) whose rules all pass.
  Each rule is `{field, op, value}` where `op` is one of `eq`, `ne`, `lt`,
  `lte`, `gt`, `gte`, `in`, `not_in`, `contains`. `field` names are free
  text resolved against whatever data the discovery/enrichment connectors
  actually populate — the schema doesn't enumerate allowed fields, because
  the allowed fields are exactly whatever this tenant's connectors produce.
- **`judgmentSignals`** — `{signal, direction: positive|negative}` pairs
  with no `value` — these render into the scoring skill's prompt as
  qualitative signals for holistic judgment (Topwater's "Additional scoring
  signals" and "Red flags" sections, unified into one shape with a
  direction flag instead of two separately-formatted lists).
- **`redFlags`** — like `judgmentSignals` but always negative and carrying
  an `escalateTo` field (who gets notified, never a silent auto-pass) —
  kept separate from `judgmentSignals` because a red flag's job is
  escalation, not scoring weight.
- **`onMissingData`** — a single policy string (default and only currently
  specified value: `"null-and-flag"` — never guess, never screen out for a
  missing field, set null and flag it, generalizing Topwater's CLAUDE.md
  rule verbatim).

## `connectors`

Five stage roles, each an array (a tenant can wire more than one connector
to the same role — e.g. two discovery sources). `documentStore` is separate
from `crm` because a diligence data room and a CRM are different trust
boundaries even when the same vendor happens to offer both. See
`docs/CONNECTOR-CATALOG.md` for the registry contract each connector must
declare, and note the one capability that deliberately does not exist
anywhere in the schema: there is no `commsSend`. A connector can declare
`commsDraft`; sending is not a capability the config vocabulary can express,
which is what makes "nothing sends itself" structural rather than a policy
a config could accidentally turn on.

## `diligence`

`enabled: false` (with `specialists: []`) is a fully valid, first-class
state — see the sales-agency vertical. When enabled, `specialists` is an
ordered list of `{id, folder, question?, sharedFolderOk?, sharedFolderReason?}`;
the generator instantiates
`templates/core/diligence-specialist/SKILL.md.tmpl` once per entry, each
locked to reading only its own named folder (`sharedFolderOk` allows the
documented Topwater exception where two specialists share a folder but ask
different questions — e.g. AI-opportunity and product-diligence both
reading `product/` — and `sharedFolderReason` states which folder and why,
required whenever `sharedFolderOk` is true).

## `budget`
