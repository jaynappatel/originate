# Onboarding Flow

This is the centerpiece of what makes Originate a product rather than a
fork: a new company gets from "we want to do our own sourcing and
diligence" to a working, tailored instance without hand-editing source
files. Eight steps. Step 7 matters as much as steps 1-6: onboarding is not
a wizard a company completes once, it's the permanent interface for
changing how their instance works.

## 1. Archetype pick

Choose a starter vertical (`vc`, `pe`, `recruiting`, `real-estate`,
`corp-dev`, `sales-agency`, `insurance-mga`) or `custom` (blank). This only
selects which `templates/verticals/<name>/config.starter.json` and which
additive skill overlay seed the new tenant's config — nothing is locked in.
A company can pick the closest archetype and diverge from it freely in step
3.

## 2. Choose your agent runtime(s)

Two separate choices — see `docs/ARCHITECTURE.md` §6 for why conflating
them is the likely mistake:
