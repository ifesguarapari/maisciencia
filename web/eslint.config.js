import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/**', 'dev-dist/**', 'coverage/**']),
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs', 'build/**/*.js'],
    languageOptions: { globals: globals.node },
  },
])
