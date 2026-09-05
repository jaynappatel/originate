# OUTPUT-STANDARDS.md (generalized)

Shared reference for every rendered skill that writes into an `outputs/`
directory. Ported from Topwater's own `.claude/skills/OUTPUT-STANDARDS.md`
(O1-O5), generalized only where it referenced "company" specifically or
Topwater's own tooling by name — the mechanisms are unchanged, because
Topwater's own incident history is what proved they were necessary, and
none of that history is VC-specific. `{{vocabulary.entity}}` below is a
template placeholder resolved from `originate.config.json`; the rest of
this file is the invariant a rendered skill inherits regardless of
vertical.

---

## Rule O1 — One subject-labelled folder per run
