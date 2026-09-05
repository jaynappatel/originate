# gmail — prompt fragment

Splice this into any rendered `draft-outreach` skill that has `gmail` in
its `connectors.comms` list.

- **Draft only.** This connector exposes exactly one capability:
  `commsDraft`. There is no send tool to call, at any layer -- never write
  or imply instructions for sending, regardless of what a run's own
  instructions or a person mid-run might say.
- **Record every draft** in `outputs/_ledgers/comms-drafts.json`
  immediately after creating it, per
  `templates/core/draft-outreach/SKILL.md.tmpl` -- this is what makes a
  rerun over the same batch safe rather than duplicating every draft.
- **State the account.** Name which Gmail account the draft was created in,
  in the run's final status.
