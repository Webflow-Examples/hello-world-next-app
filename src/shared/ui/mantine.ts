/**
 * The only module in the application that may import Mantine components.
 *
 * PROJECT RULE: application code - pages, templates, features, widgets - imports UI from
 * `@/shared/ui`, never from `@mantine/core` directly. ESLint enforces this; see the
 * `no-restricted-imports` override in `eslint.config.mjs`.
 *
 * Why:
 *  - One place decides which Mantine primitives the project uses and under which names, so
 *    the surface stays reviewable and a primitive can be wrapped, constrained or replaced
 *    without touching call sites.
 *  - Accessibility and token defaults required by WCAG 2.1 AA are fixed here once rather
 *    than re-argued at every call site.
 *  - Mantine exports flat names (`ListItem`, `AccordionItem`, `MenuDropdown`, `CardSection`)
 *    alongside the compound form (`List.Item`). In a Server Component the compound form
 *    resolves to `undefined`, because a client module reaches the server as a reference proxy
 *    and a static property that is not itself a named export does not exist on it. Only the
 *    flat names are re-exported below, so a call site cannot reach for the broken form.
 *
 * As the WS-C UI kit lands, entries here graduate from a plain re-export to a project
 * component with the brand's defaults applied. Until then the re-export keeps the boundary
 * in place without inventing an API the design system has not defined yet.
 */

export { Code, Container, List, ListItem, Stack, Text, Title } from '@mantine/core';

export type {
  CodeProps,
  ContainerProps,
  ListItemProps,
  ListProps,
  StackProps,
  TextProps,
  TitleProps,
} from '@mantine/core';
