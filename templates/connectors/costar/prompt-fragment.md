# costar — prompt fragment

Splice this into any rendered `discover-entities` or `enrich-entities`
skill that has `costar` in its `connectors.discovery` or
`connectors.enrichment` list.

- **Discovery pulls stay to listing-level fields** (address, unit count,
  asking price, cap rate if listed) -- comps, zoning, and tax history are
  the enrichment call, gated to properties that already cleared scoring,
  same eligibility discipline as every other enrichment connector in this
  catalog.
- **Cache discovery pulls** for the same market/asset-class thesis the same
  way Grata's 30-day cache works for VC, to avoid re-pulling an unchanged
  listing set within a short window.
