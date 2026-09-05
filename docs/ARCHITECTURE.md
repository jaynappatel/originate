# Originate — Architecture

## 1. What this is generalizing, and why

`~/Desktop/topwater-workflows` is a working Electron menu-bar app ("Topwater")
that dispatches Claude Code skills to run:

- a 5-stage sourcing pipeline — category research → company discovery →
  scoring → enrichment → personalized outreach — with a human-approval gate
  before Stage 2 and before any send,
- an 8-specialist diligence pipeline — each specialist reads exactly one
  folder of a locked data room and writes its own findings, ending in a
  memo with an enforced verdict line,
- point-of-use permission gating (every risky tool call pauses for approval,
  not a blanket up-front trust decision),
- three layers of checkpointing (per-batch scoring saves, chain-level step
  resume, a pre-run duplicate-work guard) plus crash-recovery and loop
  detection,
- a structural "nothing sends itself" guarantee — the comms connector has no
  send capability wired at any layer, full stop.

That system works, and this design keeps every one of those mechanisms
unchanged — see §3. What it does not generalize is *content*: the scoring
rubric is duplicated across `CLAUDE.md` prose, `scoringRubric.ts`, and
`score-companies/SKILL.md`, kept in sync only by a test
(`scoringRubricSkillSync.test.ts`); the connectors are Grata/Affinity/Clay/
Gmail specifically; the vocabulary is "company/ARR/founder"; onboarding
(`onboarding.ts`) checks one person's Claude Code login and one workspace
folder. All of that is Topwater Capital's own configuration wearing the
engine, not the engine itself.

Originate is the engine, with that configuration promoted to a first-class,
swappable input — `originate.config.json` (§4) — and the fixed skill files
replaced by a template system (§5) that renders a tenant's actual
`.claude/skills/*` from that config. VC is the reference vertical (§2, §6)
because it's the one we have a fully worked, production example of; the
platform is designed against seven archetypes so that "VC-only" assumptions
get caught now rather than when the second customer signs up.
