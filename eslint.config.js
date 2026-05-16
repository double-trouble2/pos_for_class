import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
<<<<<<< HEAD
import tseslint from 'typescript-eslint'
=======
>>>>>>> b571537bb77f8bd900f8b08f710df01d9a539e81
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
<<<<<<< HEAD
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
=======
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
>>>>>>> b571537bb77f8bd900f8b08f710df01d9a539e81
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
<<<<<<< HEAD
=======
      parserOptions: { ecmaFeatures: { jsx: true } },
>>>>>>> b571537bb77f8bd900f8b08f710df01d9a539e81
    },
  },
])
