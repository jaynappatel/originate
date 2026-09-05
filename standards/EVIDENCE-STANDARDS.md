# EVIDENCE-STANDARDS.md (generalized)

Shared reference for every diligence specialist skill. Ported from
Topwater's `.claude/skills/EVIDENCE-STANDARDS.md`. The six rules below are
document-analysis discipline and apply unchanged to any vertical's
diligence pipeline — a lease abstract, a loss-run history, and a reference
call transcript all need the same citation and confidence discipline a data
room's financials do. Load this alongside
`standards/GROUNDING-RULES.md` (the generalized G1-G11) before producing any
diligence output.

The vertical-specific layer that Topwater's original file bundled in with
these six rules — the thesis-component labels, the fit scorecard, the
re-rate thesis summary — is **not** part of the shared standard. Those are
VC/PE-specific analytical frameworks and belong in a vertical overlay's own
`diligence-memo` addendum, not in the rules every diligence skill in every
vertical must follow. See `templates/verticals/vc/` for how VC restates
them.

## The six non-negotiable rules

These apply to every diligence specialist without exception. A person is
making a real decision from this output — a confident-sounding wrong number
is worse than an honest null.

### Rule 1 — Citation requirement

Every material claim, number, or risk flag carries a source pointer:
`[document name, page/tab, location description]`. If a value was computed
from source data, cite the inputs' locations, not just the result.
Uncited claims are not allowed — if it can't be cited, don't state it.

### Rule 2 — Grounding rule

Answer only from the materials actually provided. If something isn't in the
documents, say exactly "Not found in materials" — never infer, estimate
silently, or pattern-match to a "typical" example in this space. "Not
extractable" is not the same as "not found": before declaring a file
unreadable, attempt every reasonable extraction method in order and record
which one succeeded, or the exact failure of each attempt tried.

### Rule 3 — Determinism rule

Any arithmetic runs in code, not free-typed — growth rates, ratios, margins,
any computed value is calculated in a snippet and the result inserted into
the output, with the snippet itself serving as the audit trail. Do not
round intermediate values; round only the final reported number. Compute
each derived value once and reuse it everywhere it appears — two sections
never show two different values for the same quantity, and every stated
total must be shown rebuilding from its named components.

### Rule 4 — Confidence tagging

Every finding is tagged High, Medium, or Low with the reason:

| Tag | Criteria |
|---|---|
| High | Verified/audited source, signed instrument, or two or more independent sources agree |
| Medium | Unverified figures, single source, internally consistent but not independently confirmed |
| Low | Single source, unverified, inconsistencies present, significant assumptions required, or data is stale |

Tag every number, risk flag, and summary finding — never general contextual
statements.

### Rule 5 — Two-layer separation

Extraction and interpretation are separate artifacts, never blended.
Extraction is raw facts with citations, no editorial. Interpretation is
what the extracted facts mean for a decision — risk flags, judgment,
recommendation. In practice: produce a structured extraction output first,
then a plain-English interpretation section below it, so a reviewer who
wants to check a number reads the extraction layer, and one who wants the
analyst's read reads the interpretation layer.
