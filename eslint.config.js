import js from '@eslint/js'
import pluginAstro from 'eslint-plugin-astro'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...pluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,jsx,js}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      indent: 'off',
    },
  },
  {
    files: ['src/__tests__/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      indent: 'off',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      indent: 'off',
    },
  },
]
