# Accessibility: WCAG 2.1 AA

AA is a delivery requirement on this project, not an aspiration. WS-C states the guardrail as
"high-contrast medical readability". The audience includes clinicians reading on hospital
hardware in poor lighting.

- Contrast: 4.5:1 for body text, 3:1 for large text and for non-text UI such as icons, borders and focus indicators. Verify the pair; never assume a palette shade passes.
- This is not hypothetical. Mantine's default dimmed text measured 3.32:1 in the light scheme and 4.04:1 in the dark one, and both are corrected in `src/shared/theme/cssVariables.ts`. A new palette needs its own measurement.
- The Lighthouse step asserts an accessibility score of 1. It is a floor, not proof: it cannot judge focus order, an accessible name that is wrong rather than missing, or whether an animation conveys information.
- Colour is never the only carrier of meaning. Pair it with text, shape or position.
- Every interactive element is reachable and operable by keyboard, in a logical order, with a visible focus indicator. The theme sets `focusRing: 'auto'`; never set it to `never`.
- No keyboard trap. Dialogs, menus and the mobile navigation return focus to the trigger on close.
- One `h1` per page, carrying the clinical question or the entity name. Heading levels descend without gaps.
- Images carry meaningful alt text, or empty alt when decorative. Alt text on a clinical image is a claim surface and follows [Claims And Gates](../../shared/claims-and-gates.md).
- Forms: a visible label per control, programmatic association, errors announced and tied to the field, and never colour-only error signalling.
- Video: captions, and controls operable by keyboard. The hero's looping background video has a play control and honours `prefers-reduced-motion`.
- Motion, including GSAP, honours `prefers-reduced-motion`. An animation that conveys information has a non-animated equivalent.
- Target size and spacing are adequate for touch; the mobile layouts are in scope, not an afterthought.
- Specify the accessible name and role for every custom interactive pattern before it is built, not after it fails review.
