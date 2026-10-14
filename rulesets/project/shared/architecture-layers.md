# Architecture Layers

The project uses Feature-Sliced Design. The FSD `pages` layer is named **`screens`** so it does
not collide with Next.js routing vocabulary.

```text
src/app       Next.js App Router. Plays the role of the FSD app layer.
src/screens   One slice per page or template. (FSD "pages", renamed.)
src/widgets   Composite blocks assembled from features and entities.
src/features  User interactions that carry business value.
src/entities  Business entities of the domain.
src/shared    UI kit, config, i18n, lib. Owns the Mantine surface.
```

## Import direction

Imports go downward only:

```text
app -> screens -> widgets -> features -> entities -> shared
```

- A layer may import from any layer strictly below it, never from one at or above its own level.
- ESLint enforces the direction with `no-restricted-imports`, one config object per layer. Never add an `eslint-disable` to cross a layer.
- Use the `@/` alias for cross-layer imports. Relative paths stay inside a slice.
- If a piece is needed by two layers, move it down, do not import upward.

## Slices

- A slice is a directory with a public API in `index.ts`. Import `@/features/contact-form`, never `@/features/contact-form/ui/Field`.
- Slices within the same layer are isolated: one feature does not import another feature. This is not lint-enforced today; it is a review item on the checklist.
- Segments inside a slice follow the usual FSD names: `ui`, `model`, `api`, `lib`, `config`.

## Where things go

- `src/app/**` stays thin: resolve params, produce metadata, render a screen. No composition, no business logic.
- Metadata belongs to the route segment, because it is routing output. Composition belongs to the screen.
- A template from `docs/spec/templates.md` becomes a screen slice. A mandatory slot becomes a widget so its structure is shared and reviewable in one place.
- `src/shared/config` holds the locale registry, the site origin and SEO helpers, and the generated page register.
- Never recreate the pre-FSD `src/lib`. It was folded into `src/shared/config`.
