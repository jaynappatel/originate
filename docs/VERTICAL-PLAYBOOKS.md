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

## 4. Real Estate Acquisition

Tests the platform against a domain with almost no natural-language
"category research" step and a much heavier discovery volume.

- **Entity:** property (or portfolio). **Verdicts:** PURSUE / PASS / HOLD_FOR_REVIEW.
- **Stage A (thesis):** market + asset-class definition ("multifamily,
  Sunbelt metros, value-add, 100+ units") rather than an open-ended category
  brief — this vertical's thesis interview is mostly structured fields, not
  free text, and the onboarding wizard should let a thesis skip straight to
  the criteria interview without a category-research-style narrative step.
- **Stage B (discovery):** CoStar, LoopNet, Crexi listing pulls — much
  higher volume, much shorter per-item research than a VC company profile.
- **Stage C (scoring):** cap rate, price-per-unit, NOI, and occupancy
  thresholds as hard gates; submarket trajectory and deferred-maintenance
  signals as judgment.
- **Stage D (enrichment):** comps, zoning records, tax history, environmental
  flags.
- **Stage E (outreach):** broker or owner outreach — letter of intent
  language, not a partner-voice email; still draft-only.
- **Diligence, reframed:** title review, environmental (Phase I/II) review,
  lease abstraction — each a locked folder, each read by one specialist,
  ending in a go/no-go memo. The grounding rules generalize directly (date
  arithmetic in code applies just as much to a lease-expiry calculation as
  a contract-notice deadline).

## 5. Corporate Development / M&A

Nearly a direct re-skin of the VC/PE diligence pipeline with a different
Stage A driver and CRM.

- **Entity:** company (acquisition target). **Verdicts:** same shape as
  VC/PE.
- **Stage A:** an internal strategic thesis (build-vs-buy, adjacent-market
  entry) rather than an outside investment thesis — this is the vertical
  where the "human gate before any spend" matters most politically, since
  the approver is often a business-unit head who did not initiate the
  search.
- **Discovery/scoring/enrichment:** same connector classes as VC/PE.
- **CRM:** an internal deal-tracking system rather than Affinity.
- **Diligence:** identical shape to VC/PE (financial/legal/commercial/team),
  frequently with an added "integration risk" specialist that doesn't exist
  in the VC vertical at all — a clean example of a vertical *adding* a
  specialist rather than just reparametrizing the existing eight.

## 6. Sales / BDR Agency (ICP-driven outbound)

The vertical that proves the platform must support running **only**
stages A–E, with diligence off entirely.

- **Entity:** prospect / account. **Verdicts:** typically none — output is a
  ranked, enriched, sequenced list, not a pass/fail decision memo.
- **Stage A (thesis):** an Ideal Customer Profile (ICP) definition —
  firmographic and technographic criteria — approved by the client (this
  agency's own customer) before any list-building spend.
- **Stage B (discovery):** Apollo, ZoomInfo, or similar prospect databases —
  volume closer to real estate than to VC (thousands of rows, not hundreds).
- **Stage C (scoring):** ICP-fit score as the primary hard gate; intent-data
  signals (hiring, funding, tech-stack changes) as judgment signals.
- **Stage D (enrichment):** contact-level enrichment (email, direct dial,
  verified title) for ICP-qualifying accounts only.
- **Stage E (outreach):** a sales sequence draft (multi-touch), still
  draft-only into whatever comms tool the agency uses.
- **CRM:** Salesforce or HubSpot — check-before-contact and write-back both
  matter here at least as much as in VC, since duplicate outreach across
  campaigns is the exact failure this stage exists to prevent.
- **Diligence:** `diligence.enabled: false`. No locked-folder document
  review step runs at all; nothing in the config or generated skill set
  references it. This is the vertical that forces the onboarding wizard and
  the template generator to treat diligence as genuinely optional, not
  "on but empty."

## 7. Insurance MGA (submission underwriting)

The vertical that proves the verdict vocabulary can't be hardcoded to
PROCEED/PASS, and that "discovery" doesn't have to mean open-market search.

- **Entity:** submission. **Verdicts:** BIND / DECLINE / REFER.
- **Stage A (thesis):** risk appetite statement — lines of business, limits,
  geographies, excluded classes — approved by underwriting leadership.
- **Stage B (discovery), reframed:** not an open-market search at all — the
  "discovery" connector role is filled by the MGA's own submission intake
  queue (an email/portal feed), filtered against the risk appetite
  statement. This is the clearest case where "discovery" means "triage an
  inbound stream" rather than "go find candidates," and the platform design
  has to support that without a special case: a `discovery` connector is
  just whatever source produces candidate entities, inbound or outbound.
- **Stage C (scoring):** eligibility gates (excluded class, limit exceeds
  appetite, geography excluded) as hard passes; loss-history quality and
  submission completeness as judgment signals.
- **Stage D (enrichment):** loss-run history, exposure data, prior-carrier
  records.
- **Stage E (outreach):** a broker response draft (quote, decline letter, or
  request for more information) — draft-only, same as every other vertical,
  which matters more here than most: an auto-sent bind or decline is a
  regulatory and financial event, not just an awkward email.
- **Diligence, reframed:** policy and loss-run document review against an
  underwriting checklist, ending in the BIND/DECLINE/REFER verdict — same
  locked-folder-per-specialist shape, different verdict vocabulary and
  different specialists (loss-history review, coverage-terms review,
  exposure review in place of financial/commercial/team/product).
