# clay — prompt fragment

Splice this into any rendered `enrich-entities` skill that has `clay` in
its `connectors.enrichment` list.

- **Eligible entities only.** Never call this connector on an entity
  scoring marked as an outright pass or an ineligible tier — the eligibility
  gate lives in `templates/core/enrich-entities/SKILL.md.tmpl`, not here;
  this fragment exists to remind the rendered skill that the gate applies to
  every call, not just the first.
- **Never invent a field Clay didn't return.** Missing enrichment data
  follows `criteria.onMissingData` — null and flagged, never guessed.
- **Log every call** (entity count, credits/cost unit reported) to this
  tenant's usage ledger.
