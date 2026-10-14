import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Feature-Sliced Design layers, lowest first. The FSD `pages` layer is named `screens` here so
 * it does not collide with Next.js routing vocabulary; `src/app` is the Next router and plays
 * the role of the FSD `app` layer.
 *
 * A layer may import only from layers strictly below it.
 */
const FSD_LAYERS = ['shared', 'entities', 'features', 'widgets', 'screens'];

const MANTINE_RESTRICTION = {
  group: ['@mantine/*', '@mantine/*/**'],
  message: [
    'Import UI from "@/shared/ui" (or "@/shared/theme"), not from Mantine directly.',
    'The shared layer owns the Mantine surface so primitives can be constrained, given',
    'WCAG 2.1 AA defaults, or replaced without touching call sites.',
    'See src/shared/ui/mantine.ts.',
  ].join(' '),
};

/** Restrictions for a layer: every layer at or above its own position is off limits. */
function fsdRestrictions(layer) {
  const forbidden = FSD_LAYERS.slice(FSD_LAYERS.indexOf(layer) + 1);

  return forbidden.map((target) => ({
    group: [`@/${target}`, `@/${target}/**`, `**/${target}/**`],
    message: [
      `Layer "${layer}" must not import from "${target}".`,
      'Feature-Sliced Design allows imports downward only:',
      `${FSD_LAYERS.join(' <- ')}.`,
      'Move the shared piece down a layer, or invert the dependency.',
      'See src/screens/README.md.',
    ].join(' '),
  }));
}

/**
 * One config object per layer. ESLint replaces rule options rather than merging them, so each
 * layer restates every restriction that applies to it.
 *
 * `shared` owns the Mantine surface and is the only layer without that restriction.
 */
const fsdLayerConfigs = FSD_LAYERS.map((layer) => ({
  name: `project/fsd-${layer}`,
  files: [`src/${layer}/**`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns:
          layer === 'shared'
            ? fsdRestrictions(layer)
            : [MANTINE_RESTRICTION, ...fsdRestrictions(layer)],
      },
    ],
  },
}));

const JSX_MEMBER_MESSAGE = [
  'Do not use the compound form <Namespace.Child> here.',
  'Across the React Server Components boundary a client module is a reference proxy, so a',
  'static property that is not itself a named export resolves to undefined and the prerender',
  'fails with "Element type is invalid". Use the flat named export instead',
  '(ListItem, not List.Item).',
].join(' ');

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    name: 'project/a11y-strict',
    // eslint-config-next already registers the jsx-a11y plugin, so only the rule set from the
    // strict preset is applied here; spreading the preset would redefine the plugin and error.
    // The file pattern must stay inside the one eslint-config-next registers the plugin for,
    // otherwise the rules resolve against a file where the plugin is not in scope.
    files: ['**/*.{jsx,tsx}'],
    rules: jsxA11y.flatConfigs.strict.rules,
  },

  {
    name: 'project/mantine-boundary',
    // Applies everywhere, including src/app. Each FSD layer below restates it, except shared,
    // which owns the Mantine surface.
    rules: {
      'no-restricted-imports': ['error', { patterns: [MANTINE_RESTRICTION] }],
    },
  },
  ...fsdLayerConfigs,
  {
    name: 'project/rsc-safety',
    // src/app is server-first. A compound component reached through a client reference proxy
    // breaks at prerender time, and the failure is reported as an opaque React error.
    files: ['src/app/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'JSXMemberExpression', message: JSX_MEMBER_MESSAGE },
      ],
    },
  },

  // Must stay last: turns off every rule that would fight Prettier.
  prettier,

  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Project:
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    // Webflow Cloud build output. `opennextjs-cloudflare build` writes a bundled copy of
    // Next.js, React and our own compiled code here - around 155k lines of generated
    // JavaScript. Linting it reports thousands of problems in code nobody wrote and nobody
    // may fix, and it hides ours. `.wrangler` is the local workerd state directory.
    '.open-next/**',
    '.wrangler/**',
    // Accelerator-owned payload. These files are installed and updated by
    // `frontend-accelerator`, verified against the SHA-256 receipt in
    // .frontend-accelerator/installation.json, and are not ours to change. Linting them would
    // report defects nobody here may fix, and autofixing them would make `update` refuse.
    '.agents/**',
    '.claude/**',
    '.codex/**',
    'rulesets/**',
    'toolchain/**',
    '.frontend-accelerator/**',
  ]),
]);

export default eslintConfig;
