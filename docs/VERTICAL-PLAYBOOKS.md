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
