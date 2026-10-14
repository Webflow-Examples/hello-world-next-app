// Mantine requires postcss-preset-mantine. The breakpoint variables below mirror
// `DEFAULT_THEME.breakpoints` from @mantine/core so CSS modules and the theme agree.
// Keep them in sync with src/theme/theme.ts if the theme overrides breakpoints.
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
