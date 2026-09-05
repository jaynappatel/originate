# linkedin-recruiter — prompt fragment

Splice this into any rendered `discover-entities` skill that has
`linkedin-recruiter` in its `connectors.discovery` list.

- **Pull only what `score-entities` needs to gate tiers** on a broad
  sourcing sweep -- years of experience, current title, location -- not a
  full profile per candidate at discovery time; deeper background is the
  enrichment stage's job, gated to qualifying candidates only.
- **Respect LinkedIn's own usage limits** explicitly in the run's pacing.
