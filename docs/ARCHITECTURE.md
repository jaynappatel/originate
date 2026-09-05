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

## 3. What ports over unchanged

These are already vertical-agnostic engineering. Originate specs them as
requirements for whatever execution runtime a tenant runs (see §7); this
scaffold does not reimplement them, it names them precisely so a future
implementation doesn't quietly drop one.

- **Point-of-use permission gating.** Every external/risky tool call pauses
  for an explicit approve/reject at the moment it's about to happen — never
  a blanket "trust me" at launch. A fixed always-ask list (`rm -rf`,
  `git push`, `sudo`, and — generalized here — any "send" action on whichever
  comms connector is configured) can never be marked always-allow.
- **Multi-layer checkpointing.** Per-batch scoring saves (a batch finishing
  is durable immediately, not held to the end of the run); chain-level step
  resume (a multi-skill run records exactly which step it's on); a pre-run
  duplicate-work guard (never redo an identical input that already produced
  a finished result). Topwater's own incident history (a rerun that
  re-researched 339 already-scored companies and died before reaching the 3
  new ones) is exactly the failure mode this defends against, and it isn't
  vertical-specific.
- **Crash-recovery and loop detection.** Orphaned subprocess cleanup on
  restart; stopping an agent that repeats an identical failing action.
- **"Nothing sends itself."** The comms connector's capability contract
  (§8, connector registry) declares `commsDraft: true` and there is no
  `commsSend` capability at all in this design — not a policy an agent is
  trusted to follow, a capability that doesn't exist to call.
- **Push-not-poll UI events**, and the **Electron main/renderer trust
  split** (renderer has no direct filesystem or subprocess access; every
  request crosses one narrow, verified bridge) — both apply unchanged to any
  future desktop shell built on this design.
- **Diligence grounding rules** (quote-through-the-exception, direction
  words from computation, compute-once-reuse-everywhere, every ratio carries
  its period, stamp-and-reconcile, never inherit the target's glossary,
  identify the document before analyzing it, date arithmetic runs in code,
  decompose blended averages, restating never widens scope) — see
  `standards/GROUNDING-RULES.md`. These are document-analysis discipline,
  not VC-specific; the one Topwater-specific piece (thesis-component tags,
  the fit scorecard, the re-rate thesis summary) is pulled into the *vertical
  overlay*, not the shared rule set.
- **Output/evidence/writing conventions** — the run-folder-per-run
  convention, the guaranteed-PDF rule, the reuse-before-redo rule, the
  citation/confidence-tagging/two-layer-extraction-vs-interpretation
  discipline, and the sentence-level prose rules. See `standards/`.

---

## 4. `originate.config.json` — the single source of truth

This is the thing that replaces CLAUDE.md-as-config plus scattered
TypeScript constants. Full schema: `schema/originate.config.schema.json`.
Annotated walkthrough: `docs/CONFIG-SCHEMA.md`. Shape:

```jsonc
{
  "org": { "name": "", "voiceProfiles": [{ "id": "", "styleNotes": "" }] },
  "vertical": "vc | pe | recruiting | real-estate | corp-dev | sales-agency | insurance-mga | custom",
  "vocabulary": {
    "entity": "company", "entityPlural": "companies",
    "verdicts": ["PROCEED", "PROCEED_WITH_GAPS", "PASS", "NEEDS_MORE_INFO"]
  },
  "pipeline": { "stages": [{ "id": "category-research", "order": 10, "enabled": true }] },
  "criteria": {
    "immediatePass": [{ "field": "fundingRaisedWithinYears", "op": "lte", "value": 2 }],
    "tiers": [{ "name": "Tier 1", "rules": [{ "field": "arr", "op": "gte", "value": 5000000 }] }],
    "judgmentSignals": [{ "signal": "founder has domain background", "direction": "positive" }],
    "redFlags": [{ "signal": "customer concentration", "escalateTo": "deal-team" }],
    "onMissingData": "null-and-flag"
  },
  "connectors": {
    "discovery": ["grata"], "enrichment": ["clay"], "crm": ["affinity"],
    "comms": ["gmail"], "documentStore": ["google-drive"]
  },
  "diligence": { "enabled": true, "specialists": [{ "id": "financial-analysis", "folder": "financials" }] },
  "budget": { "creditsPerYear": 86000, "seats": 2 },
  "agentRuntime": { "primary": "claude-code | codex", "skillEditing": "claude-code | codex | both" }
}
```

### Why `criteria` is a small predicate DSL, not code

Hard numeric gates (`field`/`op`/`value`) compile to one deterministic
function; soft, qualitative signals (`judgmentSignals`) render into one
prompt fragment for the scoring skill's holistic judgment. Both come from
this **one** list, so there's nothing left to fall out of sync the way
Topwater's three-way duplication can. This is deliberately the *only* place
config becomes "logic" rather than data — everything else in the schema is
inert configuration a template reads.

Worth being honest about a real precedent here: Topwater's own team already
evaluated and explicitly rejected building a general filter/rules DSL, as
overkill *at single-tenant scale* (recorded in
`docs/topwater-master/manifest.json`'s `rejectedCapabilities`, re: the
Analyst Workspace filter engine). This plan revisits that call because
multi-tenant genericity is now the actual requirement it wasn't for
single-tenant Topwater — and it keeps the DSL intentionally narrow
(comparisons + weighted soft signals, no arbitrary logic, no user-defined
functions) specifically so it doesn't reopen the scope that was rejected.

---

## 5. Skill templates

The `.claude/skills/<name>/SKILL.md` format is kept as-is (it's the proven,
Claude Code–native shape). Each is authored as a **template** —
`SKILL.md.tmpl` — with placeholders resolved from `originate.config.json`
(`{{org.name}}`, `{{vocabulary.entity}}`, `{{criteria.tiers}}`, etc.). A
vertical overlay is thin: a vocabulary swap, a starter `criteria` block, and
an *additive* list of extra skills — VC/PE adds `cim-extract`; recruiting
could add a reference-check skill. Overlays add; they don't have to override
everything.

```
templates/
  core/                            9 universal stage templates (this pass)
    category-research/SKILL.md.tmpl
    discover-entities/SKILL.md.tmpl      generalizes find-companies
    score-entities/SKILL.md.tmpl         generalizes score-companies
    enrich-entities/SKILL.md.tmpl        generalizes enrich-companies
    check-crm-history/SKILL.md.tmpl      generalizes check-affinity-*
    draft-outreach/SKILL.md.tmpl
    diligence-specialist/SKILL.md.tmpl   instantiated once per configured specialist
    diligence-memo/SKILL.md.tmpl
    sync-to-crm/SKILL.md.tmpl
  verticals/{vc,recruiting,real-estate}/config.starter.json
  connectors/{grata,affinity,clay,gmail,google-drive,apollo,salesforce,linkedin-recruiter,costar}/
    connector.json          machine-readable capability contract
    prompt-fragment.md      how a skill should call this connector's tools
```

### Worked example: rendering `category-research` for the VC vertical
