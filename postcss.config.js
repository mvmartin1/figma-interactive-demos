/**
 * postcss-global-data makes the @custom-media definitions in breakpoints.css
 * visible to every CSS Module, so flows can use `@media (--medium-screen)`
 * everywhere. Mirrors perpay-web's breakpoint scale.
 */
export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['./src/design/breakpoints.css'],
    },
    'postcss-custom-media': {},
  },
};
