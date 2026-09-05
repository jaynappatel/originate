# WRITING-STANDARDS.md (generalized)

Ported from Topwater's `.claude/skills/WRITING-STANDARDS.md`. These rules
govern every prose output a rendered skill produces: memos, interpretation
layers, summaries, briefs, extracts, outreach drafts. They sit alongside
`EVIDENCE-STANDARDS.md` (what may be claimed) and `GROUNDING-RULES.md` (how
numbers are derived) — those two govern the facts, this file governs how
the sentences read. Rules are numbered W1-W16, unchanged from the original
numbering, so a vertical overlay or a skill can cite them by number.

The standing rule underneath all of these: plain prose in team-facing
documents, no bullet points, no emoji, no em dashes. Where an em dash wants
to go, use a comma, a colon, a period, or parentheses — most em dashes are
splices holding an overloaded clause together, and removing them forces a
real sentence.

## Sentence rules

**W1. Two-value cap.** A sentence carries at most two numeric values and
the relationship between them. Three or more values go into a table or get
split into separate sentences that each state one relationship. Arrow
chains and slash chains never appear in prose.

**W2. Sentences have verbs.** No colon-label openers ("Pipeline: $1.5M
across 31 opportunities..."). A line that starts with a bare noun and a
colon is a table row wearing prose clothing — write the sentence or move
the content to an exhibit.

**W3. 35-word ceiling.** No prose sentence runs over 35 words. Over the
ceiling means tabular content is stuck in prose, or two claims are welded
together — split them.

**W4. Variety, and no spec echo.** No three consecutive sentences open with
the same word or ride the same skeleton. A skill's own instructions name
required content, never required phrasing — never reproduce a spec item's
exact wording in the output, and a spec should never contain a quotable
output sentence for the same reason.

**W5. One qualifier per claim.** State uncertainty once — the confidence
tag or one hedging word, never both, never stacked. A computed
reconciliation is stated as arithmetic and needs no hedge at all.

**W6. Active voice by default.** Name the actor — the company, the deck,
the analysis. Passives are acceptable in gap ledgers and tables, never in a
topic sentence.

## Citation and tag rules

**W7. One tag, one place, one format.** Every source/confidence tag is a
single square-bracket group at the end of the sentence it supports, before
the period: `[Source, CONFIDENCE]`. Maximum one bracket group per
sentence — a sentence needing two sources is two sentences. Tags are never
bolded, backticked, or split mid-sentence.

## Paragraph and section rules

**W8. Open with the point.** Every section and paragraph opens with a full
sentence stating the finding — never a citation, a label, or a bare figure.
Test: reading only the first sentence of every paragraph should reproduce
the document's argument.

**W9. Paragraph breaks are mandatory.** No paragraph runs over 120 words or
six sentences.

**W10. End on meaning, then bridge.** A section's last prose sentence
states what the finding means for the decision, never a raw datum. When a
finding depends on or modifies another section's, name the connection
explicitly.

**W11. Process notes out of the prose.** Corrections to prior runs and
extraction-history notes live in a header block, not in body prose. Body
prose states current truth only.

## Formatting rules
