# grata — prompt fragment

Splice this into any rendered `discover-entities` or `enrich-entities` skill
that has `grata` in its `connectors.discovery` or `connectors.enrichment`
list.

- **Five fields only, never more, on a discovery pull:** name, website,
  employee_count, sector, hq. Pulling additional fields on a broad discovery
  sweep spends more per call than the scoring stage needs to decide
  tier-eligibility, before it's even known which companies will proceed to
  paid enrichment.
- **Check the 30-day cache before any new pull** for this exact
  {{pipeline.stageA.unitNoun|| "category"}} — see
  `standards/OUTPUT-STANDARDS.md` and the caching note in
  `templates/core/discover-entities/SKILL.md.tmpl`.
- **Log every pull** — date, {{pipeline.stageA.unitNoun|| "category"}},
  companies pulled, and credits used — to this tenant's usage ledger. This
  is what makes the `budget.creditsPerYear` field in
  `originate.config.json` a real, checkable constraint rather than an
  aspiration.
