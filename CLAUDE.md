# CLAUDE.md

Entry point for Claude Code in this repository.

**Read [`AGENTS.md`](AGENTS.md) first.** It carries the rules that apply to every agent and
every contributor: the claims guardrail, where the specification lives, the non-negotiables,
and the open decisions. This file adds only what is specific to running Claude Code here.

## What this project is

A rebuild of compremium.ch for Compremium AG: Next.js App Router frontend, Webflow as a
headless CMS through the Data API, HubSpot for lead capture. 38 launch pages across five
silos, four locales, and a regulated medical device behind every clinical sentence.

Our scope is **FE-01 to FE-18** — page 1, the homepage — detailed in
[`docs/spec/fe-scope.md`](docs/spec/fe-scope.md) with the cross-team dependencies each item
waits on.

## Commands

The repository carries the Frontend Accelerator Toolset. Invoke one command at a time:

```text
/requirements-analyst   clarify scope, acceptance criteria, unknowns
/brainstorm             explore options before committing
/writing-plans          produce a small ordered plan
/architect              boundaries, state, data flow, failures
/api-integration        how the frontend consumes a contract
/ui-designer            interaction, responsive behaviour, accessibility, states
/coder                  implement the approved scope
/code-reviewer          review the diff
/test-generator         add risk-based tests
/browser-verify         verify the real UI, with evidence
/debugger               reproduce, isolate, fix
/verify                 run the checks, report what is and is not proven
/docs-generator         update durable documentation
/finishing-branch       prepare the branch
/reflect                turn a repeated correction into a project rule
```

Each runs an isolated agent that reports evidence and STOPs. An agent may recommend the next
command; it never starts one.

Rules resolve through `rulesets/common/` → `rulesets/framework/` → `rulesets/project/`, in that
order, via each role's `INDEX.md`. Project rules specialise the layers above but never override
skill authority, safety, approvals or STOP behaviour.

## Readiness

```bash
node ./toolchain/bin/doctor.mjs --json
```

`DEGRADED` with `hooks:codex` at `PENDING_ACTIVATION` is the expected state when nobody has run
a Codex session here. Claude hooks activate after they are reviewed once through `/hooks` and a
new session starts; until then they report `PENDING_ACTIVATION` too.

The Stop hook runs `npm run lint` over files changed in the session. Keep that script working.

## Working agreements

- Prefer the smallest change that satisfies the task. This codebase is young; patterns set now get copied.
- When the specification and a design disagree, the specification wins and the disagreement is reported.
- When an approved string, asset or decision is missing, report it and stop. Approximating a regulated sentence is the one failure mode this project cannot absorb.
- State what was verified and how. "Should work" is not evidence; a served-HTML assertion is.
- Record a decision with consequences as an ADR in `docs/adr/`, numbered and dated.

## Things that have already cost time here

Collected in `rulesets/project/debugger/rules/known-traps.md`. The short version:

- `<List.Item>` in a Server Component resolves to `undefined` and fails the prerender with an error that names no file. Use the flat export, `ListItem`.
- Stale `.next/types/validator.ts` reports errors about deleted routes. Rebuild before investigating.
- Running Prettier over an accelerator payload file breaks the installation receipt and makes `update` refuse to write.
- Mantine's default dimmed text fails WCAG AA in both colour schemes. Measure; do not assume.
