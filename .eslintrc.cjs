/**
 * Flow isolation is the important rule here:
 *   - Flows are auto-discovered by src/lib/flow-registry.ts; nothing else should
 *     import a flow directly.
 *   - A flow must not import from another flow. Shared code lives in
 *     @/components and @/lib.
 * Everything else is stock recommended rules.
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/flows/*', '@/flows/*/**'],
            message:
              'Flows are auto-discovered via src/lib/flow-registry.ts. Do not import a flow directly.',
          },
          {
            group: ['**/flows/*/**'],
            message:
              'Flows must not import from other flows. Share code via @/components or @/lib instead.',
          },
        ],
      },
    ],
  },
};
