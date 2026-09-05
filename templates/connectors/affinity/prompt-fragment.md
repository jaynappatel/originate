# affinity — prompt fragment

Splice this into any rendered `check-crm-history` or `sync-to-crm` skill
that has `affinity` in its `connectors.crm` list.

- **Live read, not cached.** A history check against Affinity is a live
  read of an external system — reuse only within the same calendar day, and
  state the time of the read (per `standards/OUTPUT-STANDARDS.md` Rule O4's
  exception for this skill class).
- **Never write a CRM record without a finalized field mapping.** If this
  tenant's Affinity list/field mapping hasn't been configured, say so
  explicitly in the output and write nothing — see
  `templates/core/sync-to-crm/SKILL.md.tmpl`.
- **Idempotent writes.** Check for an existing record by whatever identifier
  Affinity exposes before creating a new one.
