# Visual System Limits

The brand and visual system is produced in WS-C and arrives through a Figma handoff: tokens
documentation, asset exports, UI behaviour specs and a responsive breakpoints guide.

## Hard limits from WS-C

- STRICT RULE: no red/green traffic-light risk scales. No visual encoding of clinical risk, a measurement result or a patient state as a colour ramp. Status colours for non-clinical UI such as form validation remain permitted and must be named so the distinction is obvious.
- STRICT RULES on schematics: no visualization of direct intracompartmental pressure, and no visual declaration that tissue is safe for surgery.
- The graphic language focuses on objective measurement. A visual must not imply a verdict the copy is not allowed to make.
- The legacy site carried regulatory compliance risks that the audit calls out by name, including "Proven & Approved" badges. Never reproduce a legacy visual element without checking it against the audit.

## Until the handoff lands

- Do not invent brand colours, type scales or an icon set. Use Mantine defaults, mark the gap, and keep the decision open.
- Propose distinct options and require a human choice rather than silently establishing a house style.
- When a layout decision depends on a token that does not exist yet, say which token it depends on.

## Working from Figma

- Read tokens and variables from the Figma file through the connected MCP rather than eyeballing a screenshot.
- A Figma frame is a visual reference, not a structure. Block order comes from the page brief; where they disagree, the brief wins and the disagreement is reported.
- Export assets rather than recreating them. Icons are a custom system in WS-C, not a generic icon pack.
