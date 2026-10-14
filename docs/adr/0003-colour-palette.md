# 3. The brand blue is shade 9, and there is no dark scheme

- Status: **Accepted.**
- Date: 2026-10-13

## Context

The Figma handover (Compremium file, node `458-273`) delivered a flat palette: ten values, no
ramps, no modes, no roles.

| Value     | Name in Figma   | Value     | Name in Figma |
| --------- | --------------- | --------- | ------------- |
| `#2C3956` | compremium blue | `#FF5500` | orange        |
| `#23272A` | black           | `#13CBFB` | sky blue      |
| `#F4F5F6` | light           | `#FF0066` | pink          |
| `#FFFFFF` | white           | `#C7F12E` | lime green    |
| `#DBDBDB` | light gray      | `#838383` | dark gray     |

Mantine requires ten shades per scale, one `primaryShade`, and a text colour for every filled
surface. None of that is derivable from a flat list, and
`rulesets/project/ui-designer/rules/visual-system-limits.md` forbids inventing brand colour to
close the gap. Measuring each value was what turned the list into a system; four findings did
the deciding.

**The blue is a shade-9 colour.** Relative luminance 0.0413, against 0.1225 for Mantine's own
`blue-9` and 0.0198 for the brand black. Placed at the conventional index 6, shades 7-9 would
have to be darker still and would collapse into the black: a filled button would differ from
its own hover by 1.10:1, which nobody can see. `@mantine/core` 9.7.1 special-cases index 9 -
`get-css-color-variables.cjs:13` resolves `filled-hover` to shade 8 rather than 10 - so at index
9 the hover lightens instead, by 1.28:1, a wider delta than Mantine's own default blue manages.

**No accent can carry body text.** On white: orange 3.21:1, pink 3.86:1, sky 1.92:1, lime
1.31:1. All four are background colours. Three of them reverse cleanly against the brand black
(orange 4.70:1, sky 7.86:1, lime 11.50:1); pink reverses against nothing - 3.90:1 black, 3.86:1
white - and carries no text at any size.

**The threshold that decides the text colour lands on the orange.** Mantine's `autoContrast`
compares a surface's luminance to `luminanceThreshold`, default 0.3. Orange measures 0.2776 and
falls on the wrong side of it: white text, 3.21:1, a failure. Every other accent is far from the
boundary.

**The approved grey cannot be dimmed text.** `#838383` is 3.79:1 on white and 3.47:1 on the
`#F4F5F6` panel. This repository already carries a correction for exactly this failure -
Mantine's stock `#868e96` at 3.32:1, caught by Lighthouse on the first page built here. The
brand grey is within half a point of the value that failed. The palette contains no grey that
can be read at body size, and no border grey that clears WCAG 1.4.11.

Two further values arrived in the handover conversation: `#F5F5F5` was withdrawn as a duplicate
of `#F4F5F6` - the two are 1.0012:1 apart and cannot be told apart on any display - and the
light scheme was confirmed as the only one the project ships.

## Decision

**`src/shared/theme/colors.ts` holds the palette**, splitting `APPROVED` (from Figma) from
`ADDED` (two neutrals approved in the handover conversation) and marking every derived shade
`DERIVED` inline. Nothing reads raw hex outside this module; it is deliberately not exported
through `src/shared/theme/index.ts`.

**The brand blue sits at index 9 with `primaryShade: 9`.** Shades 0-8 are derived by mixing the
approved blue toward white - only lightness varies, no decision about hue was taken.

**`blue`, `gray`, `orange`, `pink` and `lime` override Mantine's colours of the same name**
rather than taking new ones. `color="blue"` therefore cannot quietly return stock Mantine blue,
and Mantine's semantic variables resolve to brand neutrals. `sky` is a new key.

**`autoContrast: true` with `luminanceThreshold: 0.22`.** The threshold is set by the orange and
nothing else: below it, orange takes the brand black and passes at 4.70:1. This moves the choice
of text colour off the call site, where the failing combination is the one that looks right.

**Two neutrals were added**: `#6E6E6E` for secondary text and `#8E8E8E` for input borders. Both
are measured against _both_ light surfaces, because a component does not know which one it will
be placed on - 5.10:1 / 4.67:1 and 3.28:1 / 3.00:1 respectively. `src/shared/theme/cssVariables.ts`
points `--mantine-color-dimmed`, `--mantine-color-placeholder` and `--mantine-color-default-border`
at them.

**There is no dark colour scheme.** `forceColorScheme="light"` is set on both `MantineProvider`
and `ColorSchemeScript`. The handover delivered light values only; a derived dark scheme would
establish a house style nobody approved, and the brand blue is unusable on a dark ground anyway
(1.31:1 against `#23272A`). The alternative - `primaryShade: { light: 9, dark: 4 }` - works
numerically but puts a derived grey-blue on every dark-scheme button and the brand colour on
none of them.

**The accents carry one value each**, repeated by `colorsTuple`. Deriving nine variations of
each would invent far more brand colour than it would buy. The cost is that an accent-coloured
button has no distinct hover; a ramp for an accent is a design decision if one is ever needed.

**`lime`, `orange` and `pink` are brand accents and nothing else.** They are the exact set a
traffic-light ramp would be built from, and `docs/spec/claims-guardrails.md` prohibits one. No
colour in this system may encode a clinical risk level, a measurement result or a patient state.
Names are literal throughout: there is no `success`, `warning`, `danger` or `safe`.

## Consequences

- **Contrast is proven, not asserted.** `colors.test.ts` computes WCAG 2.1 ratios from the
  literal hex values - the mapping tests in `cssVariables.test.ts` could only ever assert a
  variable name. One test asserts a _failure_ on purpose: pink against both black and white, so
  that putting a label on pink breaks the build rather than the audit.
- **Changing `luminanceThreshold` breaks a test.** Deliberately. Raising it to Mantine's default
  silently returns white text to the orange.
- **Nineteen of the thirty shades in `blue` and `gray` are derived.** They are structural - they
  exist so Mantine's variants have somewhere to go - and must not be treated as brand colours or
  quoted back to the client as such. If WS-C later delivers real ramps, they replace these.
- **The dark branch of `cssVariablesResolver` is unreachable and kept.** It is where the three
  corrections get re-measured the day a dark palette is approved.
- **Typography, spacing and radii are still `TODO(WS-C)`.** This decision closes the colour axis
  of FE-03 only.
