# OUTPUT-STANDARDS.md (generalized)

Shared reference for every rendered skill that writes into an `outputs/`
directory. Ported from Topwater's own `.claude/skills/OUTPUT-STANDARDS.md`
(O1-O5), generalized only where it referenced "company" specifically or
Topwater's own tooling by name — the mechanisms are unchanged, because
Topwater's own incident history is what proved they were necessary, and
none of that history is VC-specific. `{{vocabulary.entity}}` below is a
template placeholder resolved from `originate.config.json`; the rest of
this file is the invariant a rendered skill inherits regardless of
vertical.

---

## Rule O1 — One subject-labelled folder per run

Before saving anything, compute a run folder:

```
<base>/<subject>-<skill>-<YYYY-MM-DD>-<HHMM>/
```

`<base>` is the bucket this run belongs to, never a single flat `outputs/`
for everything — a flat bucket is what let Topwater's own `outputs/`
directory reach 788 mixed entries before this rule existed. Buckets:

| `<base>` | For |
|---|---|
| `outputs/sourcing/<category>/` | Any run scoped to a sourcing category (or role/mandate, market thesis, ICP, risk appetite — whatever Stage A produces for this vertical) |
| `outputs/deals/<{{vocabulary.entity}}>/` | Root-level runs about one entity |
| `outputs/internal/` | Work that isn't scoped to a category or an entity |
| `diligence/<{{vocabulary.entity}}>/outputs/` | Entity-scoped diligence agents, kept deliberately separate from `outputs/deals/` — the data-room agents read and write their own tree beside the documents they analyze |

`<subject>` is what the run is about, lowercased and hyphenated — the
category slug or entity slug — and appears in the path (via `<base>`)
rather than repeated again in the folder name. `<skill>` is the skill's own
id. `<YYYY-MM-DD>-<HHMM>` is the run's start time — the timestamp is what
separates two runs, so a rerun always lands in its own folder; folders
never merge because it's the same session or the same day.

Create the folder; never reuse or overwrite one that exists — this is what
makes a run's outputs immutable once written. Two runs in the same
clock-minute append `-2`, `-3`. Every artifact from the run (the dated
source file, any paired `-interpretation.md`, the guaranteed PDF from O2,
any sheet/deck from O3) lands inside that one folder.

Some skills write one file per entity rather than one folder per run
(a batch draft-outreach run is the canonical case) — those go under their
category, grouped by run date, with the entity slug and date kept in the
filename so a file still identifies itself out of context:
`outputs/sourcing/<category>/draft-outreach/<YYYY-MM-DD>/<entity-slug>-draft-outreach-<YYYY-MM-DD>.json`.

`outputs/_ledgers/` holds records that belong to no single run and
accumulate across all of them — never archived, never rolled into a run
folder. Examples this platform expects a rendered instance to maintain: a
watchlist ledger for any skill with a WATCHLIST-shaped verdict; a
comms-drafts ledger recording every draft ever created (what makes rerunning
outreach safe — a rerun checks this ledger, not a single run folder, before
deciding whether an entity already has a draft); a claims ledger for
diligence, recording every extracted fact append-only so a later run's
claim against the same `(entity, claim_type, period)` can be marked NEW,
AGREE, or CONFLICT against what's already there.

## Rule O2 — Guaranteed PDF, every run, no exceptions

Wherever a skill's primary output is prose (a memo, brief, report — not a
bare JSON blob), render a PDF copy into the same run folder immediately
after saving the source. This runs unconditionally; there is no
JSON-only exception and no user opt-out at the O2 layer. A skill whose
native output is structured JSON writes a readable prose companion first
(a brief, a ranked-list table, an `-interpretation.md`) and renders that —
the JSON is still written for downstream skills to parse, but the PDF is
the human deliverable, never replaced by it. If PDF rendering fails, say so
plainly in the run's final status rather than silently moving on.

## Rule O3 — Post-run delivery offer

After any run that produced a human-facing deliverable, offer to deliver it
onward: an email draft (universal — every human-facing deliverable can be
emailed), plus a sheet and/or deck where the skill's output shape supports
one. The email draft is always a **draft**, never an auto-send, and the
recipient is confirmed explicitly before any draft-creation tool is called —
state exactly what will be attached and to which account before creating
anything, and never let "email it" be read as "send it." If the user
declines all three, do nothing beyond O2.

## Rule O4 — Reuse the last run; do only what is new

This rule runs first, before any research, API call, or model work — it's
the first thing a skill does once it knows its subject. A skill that has
already answered a question does not answer it again: it finds the prior
run (per O1's folder naming), works out what's genuinely new since then,
carries every already-covered item forward verbatim (same source, same
date-stamp — never re-stamped as today's, since nothing was re-checked),
and does only the new work. The saved output is always the full merged
result, never a delta, and reuse is never silent: the visible output states
which prior run was reused, its date, and the new/carried-forward/total
counts.

**This is not optional and has no age limit.** It exists because a system
without it will eventually re-run a fully-covered batch to exhaustion
before reaching the small number of genuinely new items in it — this
happened concretely in Topwater's own history (a category rerun that
re-scored 339 already-scored companies and died before reaching the 3 new
ones). A connector being unavailable is never grounds for skipping this
rule; it's the strongest argument for reusing what's already on disk. Four
and only four things override reuse: an explicit user instruction to redo
it, a prior run that failed or was interrupted, a change in the criteria or
schema itself since the prior run, or a prior output that can't be parsed.

## Rule O5 — A real decision point uses a real gate

A written question in a skill's visible output is never a pause by itself.
Every point where more work might follow is one of exactly two kinds:
