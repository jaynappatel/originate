# Originate — AI Sourcing & Diligence Copilot

Originate is a configurable pipeline for finding, qualifying, enriching, and
reaching out to a universe of targets — companies, candidates, properties,
prospects, or submissions — with a human approving anything risky before it
happens. It also runs a document-driven diligence pipeline: specialist
reviews of a locked set of documents, ending in an enforced decision memo.

Venture capital sourcing is the flagship vertical (see
`templates/verticals/vc/`, which encodes Topwater Capital's own criteria as
the reference example), but the pipeline underneath is vertical-agnostic —
see `docs/VERTICAL-PLAYBOOKS.md` for recruiting, real estate, corp dev,
sales development, and insurance underwriting.

## Try it: the Originate Console

The fastest way to understand this project is to run its local console —
a real, working browser app (no build step, no dependencies) that edits a
tenant's `originate.config.json` and renders the actual `.claude/skills/*`
files that config produces.

```bash
git clone https://github.com/jaynappatel/originate.git
cd originate
npm run console          # or: python3 -m http.server 4173
```

Then open **http://localhost:4173/app/index.html**.

### What you'll see

Switch between the VC, Recruiting, and Real Estate starter configs (or
start blank with Custom) using the buttons in the top-right. The sidebar on
the left edits the tenant's org details, vocabulary, agent runtime choice
(Claude Code / Codex, for pipeline execution and for skill editing
independently), and which connectors are wired to each pipeline role —
toggling a connector checkbox updates the config live.

![Originate Console — configuration view](docs/assets/console-config-tab.png)

The **`originate.config.json`** tab on the right shows the live config
state as you edit it. You can also edit the JSON directly in the textarea
and click **Apply edited JSON** — this is the same file a chat-based setup
assistant (Claude Code or Codex, per `docs/ONBOARDING-FLOW.md`) would be
editing on your behalf during onboarding.

The **Generate skill** tab is the interesting part: pick any of the 9 core
skill templates, click **Generate**, and the console fetches the matching
`templates/core/<skill>/SKILL.md.tmpl`, resolves every `{{placeholder}}`
against your current config, and shows you the exact `SKILL.md` a real
tenant would get — vocabulary, criteria, connector names, and all,
substituted in. Picking `diligence-specialist` adds a second dropdown to
choose which configured specialist to render (each one is a separate
instantiation of the same template, locked to its own data-room folder).

![Originate Console — generated skill preview](docs/assets/console-generate-tab.png)

The screenshot above is real output: that's the actual `category-research`
skill, rendered against the VC starter config, produced by
`app/engine.js` — a small template renderer implementing the mechanical
substitution spec'd in `cli/README.md`'s `originate generate` command.

### Deep links

Any view can be shared or bookmarked directly:

```
index.html?vertical=recruiting&tab=generate&skill=score-entities&autogen=1
```

`vertical` picks the starter config, `tab=generate` opens the preview tab,
`skill` pre-selects a template, and `autogen=1` renders it immediately —
useful for pointing someone straight at a specific example.

### What this console does — and doesn't — do

It's a real, client-side config editor and template renderer: everything
above actually runs in your browser against the real files in this repo,
nothing is mocked. What it does **not** do yet: write the rendered skills
to disk as an actual tenant workspace, call any real connector (Grata,
Affinity, Clay, ...), or execute a pipeline. Those are the Electron shell,
the `originate` CLI, and the execution engine described in `cli/README.md`
— the next phase past this console.

## Why this exists

Topwater Capital's own sourcing/diligence system
(`~/Desktop/topwater-workflows`) proved the pipeline shape, the permission
model, and the checkpointing engineering work. But everything that makes it
*Topwater's* is hardcoded — the scoring rubric lives in three files kept in
sync by a test, the connectors are a fixed four, and onboarding assumes one
person at one firm. Originate is that same proven engine, generalized so any
company can configure it for their own criteria, their own connectors, and
their own AI runtime, through a guided setup instead of hand-edited source.

`topwater-workflows` is untouched by this project and continues running
exactly as it does today, as Topwater Capital's own private instance.
Originate does not depend on it and is not a refactor of it.

## Read next

- **`docs/ARCHITECTURE.md`** — the full design: what generalizes, what
  doesn't, the config schema, the template system, and the onboarding flow.
- **`docs/VERTICAL-PLAYBOOKS.md`** — seven company archetypes and how each
  maps onto the pipeline.
- **`docs/CONFIG-SCHEMA.md`** — annotated walkthrough of
  `originate.config.json`.
- **`docs/CONNECTOR-CATALOG.md`** — the connector registry: what a connector
  declares, and the starting catalog.
- **`docs/ONBOARDING-FLOW.md`** — the 8-step guided setup, including the
  Claude Code vs. Codex choice.
- **`cli/README.md`** — spec for the deferred `originate` CLI (init,
  configure, generate, validate, run) that would replace this browser
  console with a real local pipeline.

## Repo layout

```
app/           the Originate Console — index.html, style.css, app.js, engine.js
docs/          design documents and the console screenshots
schema/        originate.config.schema.json — the JSON Schema for a tenant's config
templates/
  core/        9 universal, vertical-agnostic SKILL.md templates
  verticals/   thin overlays per company archetype (vc, recruiting, real-estate)
  connectors/  the connector registry — one directory per data source / tool
standards/     ported, generalized OUTPUT / EVIDENCE / WRITING / GROUNDING rules
cli/           spec for the `originate` CLI (init/configure/generate/validate/run)
```
