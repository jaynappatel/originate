# google-drive — prompt fragment

Splice this into any rendered `diligence-specialist` skill instance that
has `google-drive` in its `connectors.documentStore` list.

- **Read only this specialist's own folder,** per the folder lock in
  `templates/core/diligence-specialist/SKILL.md.tmpl` -- this connector has
  no concept of "this specialist's folder," it just reads whatever path
  it's given, so the folder restriction is entirely the calling skill's
  responsibility, not something this connector enforces on its own.
- **Identify the document before analyzing it** (Rule G7 in
  `standards/GROUNDING-RULES.md`) -- state what each file is before
  extracting from it.
