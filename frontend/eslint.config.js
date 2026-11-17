import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: [
      'src/shared/services/**/*.{ts,tsx}',
      'src/shared/store/**/*.{ts,tsx}',
      'src/shared/tokens/**/*.{ts,tsx}',
      'src/shared/utils/**/*.{ts,tsx}',
      'src/shared/constants/**/*.{ts,tsx}',
      'src/shared/types/**/*.{ts,tsx}',
      'src/shared/pages/**/*.{ts,tsx}',
      'src/shared/components/ui/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '../**/features/**'],
              message:
                'Shared core primitives, tokens, utils, and services must not import from @/features/* to prevent circular dependencies.',
            },
          ],
        },
      ],
    },
  },
])
