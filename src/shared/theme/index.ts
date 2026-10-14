/**
 * Theme and Mantine runtime wiring.
 *
 * The root layout consumes everything it needs from here, so `src/app/**` never imports
 * `@mantine/core` itself. See `src/shared/ui/mantine.ts` for the rule.
 */

export { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
export { cssVariablesResolver } from './cssVariables';
export { Providers } from './Providers';
export { theme } from './theme';
