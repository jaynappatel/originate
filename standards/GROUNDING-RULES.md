# GROUNDING-RULES.md (generalized diligence discipline, G1-G11)

Ported and generalized from Topwater's CLAUDE.md Section 5 "Diligence
grounding rules." These bind every diligence specialist skill in every
vertical — a lease abstract, a loss-run history, and a set of audited
financials all require the same discipline about direction, arithmetic, and
scope. Every rendered `diligence-specialist` and `diligence-memo` skill
references this file explicitly rather than restating these rules inline.

**G1 — Quote through the exception.** Never end a clause or document quote
before "except," "unless," "provided that," "notwithstanding," or "subject
to." Read to the end of the sentence and any carve-outs before quoting. For
any restrictive clause, do not pattern-match the opening words — classify
its net effect (who may do the thing, to whom, with or without consent,
under what carve-outs), state the net effect, then quote the full operative
language.

**G2 — Direction words come from computation.** Before writing recovered,
improved, declined, grew, compressed, expanded, accelerated, or stabilized,
compute the delta in code from the two underlying values and let the sign
choose the word. Ranges describing "consistent" performance must include
every period in the claimed span.

**G3 — Compute once, reuse everywhere.** Every derived number is computed
once in code, stored with its inputs, and reused verbatim wherever it
appears. Every stated total must be shown rebuilding from its named
components in the output; if the components don't sum, show the gap rather
than rounding it away. Never mix incompatible bases (e.g. audited vs.
unaudited, gross vs. net) in one subtraction without stating the basis of
both operands.

**G4 — Every ratio carries its period.** Every percentage or rate must
carry its time period (year, quarter, as-of date) in the same sentence or
its immediate label. A ratio without a period is an unfinished extraction.

**G5 — Stamp and reconcile.** Every number carries source document plus
document date. Before citing a document for a figure, confirm the figure
actually appears in that document. When the same metric exists in multiple
snapshots (two forecasts of the same period, a register vs. a signed
instrument), present all values side by side with dates and state which
governs and why — a signed instrument beats a register; a measured figure
beats a model assumption.

**G6 — Never inherit the subject's glossary.** A subject's own labels
(their "recurring revenue," their "run-rate," their "qualified pipeline")
are claims, not definitions. Verify every such label against how the
figure was actually computed before restating it as fact.

**G7 — Identify the document before analyzing it.** State what each
document is (an order form, a lease, a loss-run report, a reference-call
transcript, an amendment) before extracting from it, and note when one file
bundles several instruments. Attribute each clause to the instrument it
actually lives in.

**G8 — Date arithmetic runs in code.** Expiry equals effective date plus
term. A notice deadline equals expiry minus the notice period — the
deadline is when action is due, not when a window opens. Recompute every
date from the source instrument; when a register disagrees with the
instrument, the instrument wins and the conflict is flagged.

**G9 — Decompose blended averages.** When a blended average or headline
rate has row-level data available, decompose it and report the distribution
(outliers, share below threshold, ex-outlier figure) — lead with the
distribution when it tells a different story than the headline.

**G10 — Restating carries the scope, direction, and tense forward; never
widen any of them.** When prose or a visual restates a number, comparison,
or reconciliation an upstream specialist already computed, re-read that
specialist's own field or note before writing the sentence — never restate
from memory of the finding. Preserve its exact scope, its exact direction
(the same discipline G2 applies to grew/declined applies here to
overstates/understates and every other paired directional term), its exact
tense (a hedged, forward-looking claim must not be presented as already
true), and any caveat the source attaches to the figure. An inferred
analytical construct built on top of raw data must say so explicitly and
never be presented with the same confidence as a directly extracted field.
When two passages in the same deliverable state the same fact, they must
trace to the identical computed value, never two independent computations
that were never cross-checked against each other.

**G11 — Same-day outputs: highest version wins, never the bare filename by
default.** For any store that hasn't adopted the run-folder convention in
`standards/OUTPUT-STANDARDS.md` Rule O1, a rerun on the same date saves
alongside the original as `-v2`, `-v3`, etc. rather than overwriting it.
Before reading another skill's dated output, list every file matching that
subject/skill/date, including all `-vN` suffixes, and use the highest
version found — the suffixless file counts as v1, not as the default or
latest. Never pattern-match the literal bare-filename path and stop there:
on most filesystems, `-v2`/`-v3` sort before the bare filename in a plain
lexicographic listing, so a literal-match read silently picks up the oldest
same-day file. State which file (including its version suffix) was
actually used wherever the output is cited. Any skill whose output already
lands in an O1 run folder is exempt from this rule entirely — a same-day
rerun already gets its own folder, so there's nothing to glob for.
