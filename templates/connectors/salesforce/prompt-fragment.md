# salesforce — prompt fragment

Splice this into any rendered `check-crm-history` or `sync-to-crm` skill
that has `salesforce` in its `connectors.crm` list.

- **Live read for history checks**, same discipline as `affinity` --
  reuse only within the same calendar day.
- **Never write without a finalized object/field mapping** for this
  tenant's Salesforce org. Say so explicitly and write nothing if it isn't
  configured.
- **Idempotent writes** -- check for an existing record by external ID
  before creating a new one.
