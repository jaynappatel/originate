# Vertical Playbooks

Seven company archetypes, each mapped onto the same five sourcing stages plus
the optional diligence pipeline. Each entry states: what changes (vocabulary,
criteria, connectors), what stays the same, and anything about the archetype
that stresses the platform design in a specific way — because a generalized
platform is only proven by the cases that don't fit the first mold cleanly.

Every playbook below is a starting point a company edits during onboarding
(`docs/ONBOARDING-FLOW.md`), never a locked template.

---

## 1. Venture Capital (reference vertical)

**Config:** `templates/verticals/vc/config.starter.json` — Topwater Capital's
own criteria, re-expressed in the new schema. This is the vertical every core
template is validated against (§5 of `ARCHITECTURE.md`).

- **Entity:** company. **Verdicts:** PROCEED / PROCEED_WITH_GAPS / PASS / NEEDS_MORE_INFO.
- **Discovery:** Grata (broad company pull, cached 30 days).
- **Scoring:** ARR floor, funding-recency cap, bootstrapped/SMB-mid-market fit; Tier 1/2/3/Pass.
- **Enrichment:** Clay, Tier 1/2 only.
- **CRM:** Affinity — check before contact, write back on outreach.
- **Outreach:** Gmail draft in a named partner's voice; never sent.
- **Diligence:** 8 specialists (financials, commercial ×2, team, product ×2, GTM, market) over a locked data room → memo with an enforced verdict line.

## 2. Private Equity / Search Fund

Structurally identical to VC — the differences are in criteria, not
mechanism, which is exactly the proof point that PE didn't need its own
pipeline shape:

- **Criteria shift:** EBITDA and cash-flow thresholds replace ARR-multiple
  thinking; "no venture funding" may be a *positive* signal rather than a
  hard requirement; hold-period and add-on-acquisition fit become judgment
  signals.
- **Discovery:** same connector class as VC (Grata/PitchBook-style), often
  layered with proprietary broker relationships that show up as a
  `documentStore` connector rather than a `discovery` one (inbound teasers).
- **Diligence:** same 8-specialist shape; the fit scorecard and re-rate
  thesis (see `standards/EVIDENCE-STANDARDS.md`) are PE/VC-specific and live
  in the vertical overlay, not the shared grounding rules.

## 3. Executive Search / Recruiting

The archetype that most tests whether "company" as the hardcoded entity
noun actually generalizes.

- **Entity:** candidate. **Verdicts:** could be as simple as
  ADVANCE / HOLD / DECLINE.
- **Stage A (thesis):** a role/mandate spec — comp band, must-have
  experience, reporting line, location constraints — approved by the hiring
  lead before sourcing spends any time.
- **Stage B (discovery):** LinkedIn Recruiter, an ATS's own candidate
  database, or a careers-page/ATS collector pattern (Topwater's widget
  already has `atsGreenhouseCollector.ts`, `atsLeverCollector.ts`,
  `atsAshbyCollector.ts`, `atsLoxoCollector.ts` — these map directly onto
  Originate's `discovery` connector role for this vertical, ported near
  verbatim).
- **Stage C (scoring):** fit against the role rubric — years of relevant
  experience, comp-band overlap, location/relocation willingness — as hard
  gates; culture/leadership-style fit as judgment signals.
- **Stage D (enrichment):** contact info, publicly available background,
  reference availability.
- **Stage E (outreach):** candidate outreach in the recruiter's voice —
  still draft-only; a bad "you're hired" auto-send is exactly the kind of
  action the permission-gating model exists to stop.
- **CRM:** the firm's own ATS or a lightweight CRM in place of Affinity.
- **Diligence, reframed:** reference checks and background verification —
  locked "folders" become a locked set of reference-call notes and
  background-check documents, read by one specialist each, ending in a
  hire/no-hire recommendation memo. Same folder-locking discipline as
  Topwater's data-room specialists (a reference-checker never reads the
  compensation-negotiation notes), just a different kind of document.
