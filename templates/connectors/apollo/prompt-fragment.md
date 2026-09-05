# apollo — prompt fragment

Splice this into any rendered `discover-entities` or `enrich-entities`
skill that has `apollo` in its `connectors.discovery` or
`connectors.enrichment` list.

- **Minimum-field discipline still applies on discovery** even though
  Apollo's typical result volume is much higher than Grata's -- pull the
  fields `score-entities` actually needs to gate tiers, not everything the
  API can return, or a broad ICP sweep becomes an expensive one.
- **Respect Apollo's own rate limits** explicitly in the run's pacing;
  do not retry a rate-limited call in a tight loop (this is exactly the
  runaway-detection pattern named in `docs/ARCHITECTURE.md` §3 -- an
  instant-fail, instant-retry loop is the case a quiet-timer alone would
  miss).
