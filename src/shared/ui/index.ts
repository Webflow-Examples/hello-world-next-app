/**
 * Public surface of the project UI kit.
 *
 * Application code imports from `@/shared/ui`. It must not import `@mantine/core` directly -
 * see `./mantine.ts` for the reasoning and `eslint.config.mjs` for the enforcement.
 *
 * Two kinds of export live behind this barrel:
 *
 *  - `./mantine` - the Mantine re-export surface, and the ONLY module permitted to import
 *    Mantine. Nothing else belongs in that file.
 *  - project-owned slices, one directory each, for UI the project implements itself. Being
 *    project-owned is not an exception to the Mantine rule: that rule governs where Mantine
 *    may be imported, not that all UI must be Mantine.
 */

export * from './mantine';
export * from './skip-to-content';
