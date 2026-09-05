# `originate` CLI — spec only (not implemented in this pass)

This is a specification for the follow-on generator/CLI, written precisely
enough that implementing it is mechanical — read config, resolve
placeholders, write files — not a redesign. See
`docs/ARCHITECTURE.md` §9 for the explicit scope boundary: no code in this
directory yet.

## Commands

### `originate init [--vertical <name>]`

Interactive: runs onboarding steps 1-4
(`docs/ONBOARDING-FLOW.md`) — archetype pick, agent runtime choice, guided
criteria interview, connector selection — and writes the resulting
`originate.config.json` to the new tenant workspace root. Validates the
result against `schema/originate.config.schema.json` before proceeding;
refuses to write an invalid config.

### `originate configure`
