# Mantine And Shared UI

## Mantine is imported only in `src/shared/`

- Application code imports UI from `@/shared/ui` and Mantine wiring from `@/shared/theme`. Never import `@mantine/*` anywhere else.
- ESLint enforces this with `no-restricted-imports`; `src/shared/**` is the only exempt path. Never add an `eslint-disable` to get around it.
- To use a Mantine primitive that is not exported yet, add it to `src/shared/ui/mantine.ts` first, then import it from `@/shared/ui`. Adding it is a deliberate decision about the project's UI surface, not a formality.
- The reason is replaceability and defaults: one module decides which primitives exist, under which names, with which accessibility and token defaults, so a primitive can be wrapped or replaced without touching call sites.

## Use the flat exports, never the compound form

- Mantine exports `ListItem`, `AccordionItem`, `MenuDropdown`, `CardSection` alongside `List.Item`, `Accordion.Item` and so on. Only the flat names are safe here.
- In a Server Component the compound form resolves to `undefined`: a client module reaches the server as a reference proxy, and a static property that is not itself a named export does not exist on it. The prerender fails with `Element type is invalid`, which names no component and no file.
- `no-restricted-syntax` bans JSX member expressions under `src/app/**` for this reason.

## Tokens

- `src/shared/theme/theme.ts` is the single source of design tokens. Never hard-code a colour, spacing value, radius or font size in a component or CSS module; add it to the theme and reference the token.
- The theme is currently a skeleton of `TODO(WS-C)` entries. Do not invent brand values to fill them. Use Mantine defaults until the Figma handoff lands, and say so in the report.
- Never name a colour scale `risk`, `danger` or `safe`, and never build a red/amber/green ramp for a measurement, a patient state or a risk level. See [Claims And Gates](../../shared/claims-and-gates.md).
- Keep `postcss.config.cjs` breakpoint variables in sync with the theme if the theme ever overrides breakpoints.

## Styling

- CSS Modules with Mantine's PostCSS preset. No Tailwind, no CSS-in-JS runtime, no second styling system.
- Mantine's core stylesheet is imported once, in `src/shared/theme/Providers.tsx`, before any project stylesheet in the module graph.
