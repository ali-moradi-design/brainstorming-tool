import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

// Feature-Sliced Design: a layer may only import from layers below it,
// and slices are consumed only through their public API (index.ts).
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const sliced = ['pages', 'widgets', 'features', 'entities'];

const noUpwardImports = (layer) => {
  const above = layers.slice(0, layers.indexOf(layer));
  return above.map((l) => `@/${l}`).concat(above.map((l) => `@/${l}/**`));
};

const fsdOverrides = layers.map((layer) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          ...(layer === 'app'
            ? []
            : [
                {
                  group: noUpwardImports(layer),
                  message: `FSD: layer "${layer}" cannot import from a layer above it.`,
                },
              ]),
          {
            group: sliced.map((l) => `@/${l}/*/**`),
            message: 'FSD: import a slice only through its public API (index.ts).',
          },
        ],
      },
    ],
  },
}));

export default tseslint.config(
  { ignores: ['dist', 'graphify-out', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  ...fsdOverrides,
  { files: ['**/*.test.{ts,tsx}'], languageOptions: { globals: globals.jest } },
  prettier,
);
