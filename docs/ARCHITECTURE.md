# Originate — Architecture

## 1. What this is generalizing, and why

`~/Desktop/topwater-workflows` is a working Electron menu-bar app ("Topwater")
that dispatches Claude Code skills to run:

- a 5-stage sourcing pipeline — category research → company discovery →
  scoring → enrichment → personalized outreach — with a human-approval gate
  before Stage 2 and before any send,
- an 8-specialist diligence pipeline — each specialist reads exactly one
  folder of a locked data room and writes its own findings, ending in a
  memo with an enforced verdict line,
- point-of-use permission gating (every risky tool call pauses for approval,
  not a blanket up-front trust decision),
- three layers of checkpointing (per-batch scoring saves, chain-level step
  resume, a pre-run duplicate-work guard) plus crash-recovery and loop
  detection,
- a structural "nothing sends itself" guarantee — the comms connector has no
  send capability wired at any layer, full stop.

That system works, and this design keeps every one of those mechanisms
unchanged — see §3. What it does not generalize is *content*: the scoring
rubric is duplicated across `CLAUDE.md` prose, `scoringRubric.ts`, and
`score-companies/SKILL.md`, kept in sync only by a test
(`scoringRubricSkillSync.test.ts`); the connectors are Grata/Affinity/Clay/
Gmail specifically; the vocabulary is "company/ARR/founder"; onboarding
(`onboarding.ts`) checks one person's Claude Code login and one workspace
folder. All of that is Topwater Capital's own configuration wearing the
engine, not the engine itself.

Originate is the engine, with that configuration promoted to a first-class,
swappable input — `originate.config.json` (§4) — and the fixed skill files
replaced by a template system (§5) that renders a tenant's actual
`.claude/skills/*` from that config. VC is the reference vertical (§2, §6)
because it's the one we have a fully worked, production example of; the
platform is designed against seven archetypes so that "VC-only" assumptions
get caught now rather than when the second customer signs up.

---

## 2. The generalizable shape

Every archetype below reduces to the same pipeline. What changes is
*vocabulary*, *criteria*, and *which connectors fill which stage role* — never
the pipeline shape itself.

| Stage | VC (Topwater today) | Recruiting | Real Estate Acquisition | Corp Dev / M&A | Sales Agency (BDR) | Insurance MGA |
|---|---|---|---|---|---|---|
| **A. Thesis** (human-approved before spend) | category research | role/mandate spec | market + asset-class thesis | acquisition thesis | ICP definition | risk appetite |
| **B. Discovery** (cached, broad, cheap) | Grata company pull | candidate sourcing (LinkedIn/ATS) | listings (CoStar/LoopNet/Crexi) | market scan (Grata/PitchBook) | prospect lists (Apollo/ZoomInfo) | submission intake queue |
| **C. Scoring** (before any paid spend) | tier vs. investment criteria | fit vs. role rubric | cap rate / NOI / price-per-unit gates | strategic fit + financial gates | ICP fit score | underwriting eligibility |
| **D. Enrichment** (qualifying tiers only) | Clay contact enrichment | background/contact enrichment | comps, zoning, tax records | financials | contact + intent data | loss-run / exposure data |
| **E. Outreach** (draft only, never sent) | partner-voice email | candidate outreach | broker/owner outreach | corp dev intro | sales sequence draft | broker response draft |
| **CRM check + write-back** | Affinity | ATS/CRM | CRM | CRM | Salesforce/HubSpot | policy system |
| **Diligence** (locked folders → specialist memos → enforced verdict) | 8 specialists → PROCEED/PASS/etc. | reference checks | title/environmental/lease abstract | financial/legal/commercial/team | usually **off** | policy/loss-run review → BIND/DECLINE/REFER |

Two rows matter more than the rest for proving genericity, and both are
deliberate: **sales agency** shows a vertical that runs only stages A–E, with
diligence disabled entirely — the platform must not assume diligence is
always on. **Insurance MGA** shows a non-`PROCEED`/`PASS` verdict vocabulary —
the platform must not hardcode the verdict set. Full per-vertical detail is
in `docs/VERTICAL-PLAYBOOKS.md`.

---
