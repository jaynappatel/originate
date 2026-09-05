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
