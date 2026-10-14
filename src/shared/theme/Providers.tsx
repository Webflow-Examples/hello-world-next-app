'use client';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';

import { cssVariablesResolver } from './cssVariables';
import { theme } from './theme';

/**
 * Client boundary for Mantine.
 *
 * The theme is imported here rather than passed down from the server layout: once the theme
 * carries `Component.extend({ ... })` overrides it contains functions, which cannot cross the
 * server/client boundary as a prop.
 *
 * Mantine's core stylesheet is imported here so it is pulled in wherever the provider is, and
 * before any project stylesheet in the module graph.
 *
 * The colour scheme is FORCED to light. There is no dark theme in this project: the Figma
 * handover of 2026-10-13 delivered light values only, and deriving a dark scheme from them
 * would establish a house style nobody approved - which `rulesets/project/ui-designer/rules/
 * visual-system-limits.md` forbids. The decision is recorded in
 * `docs/adr/0003-colour-palette.md` and is reversible: drop `forceColorScheme` here and in
 * `ColorSchemeScript`, then re-measure the `dark` entries in `cssVariables.ts`.
 *
 * `forceColorScheme` must be set in both places. Here it fixes what the components render;
 * in `ColorSchemeScript` it replaces the inline script that would otherwise read
 * `localStorage` before paint.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      cssVariablesResolver={cssVariablesResolver}
      forceColorScheme="light"
      theme={theme}
    >
      {children}
    </MantineProvider>
  );
}
