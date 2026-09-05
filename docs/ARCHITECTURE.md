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
