// @ts-check

import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	// Global ignores
	{
		ignores: ['node_modules', 'dist', 'build', '.wrangler']
	},

	// Base recommended configurations
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	// Configuration for import plugin to resolve TypeScript paths
	{
		plugins: {
			import: importPlugin
		},
		settings: {
			'import/resolver': {
				typescript: true,
				node: true
			}
		},
		rules: {
			'import/no-unresolved': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off'
		}
	},

	// Main configuration for your TypeScript files
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2021
			},
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			'@typescript-eslint/naming-convention': 'off',
			// Legitimately suppressed for API wrapper code using explicit `as` casts on JSON
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/restrict-plus-operands': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/consistent-type-assertions': 'off'
		}
	},

	// Test files use a looser tsconfig (noUnusedLocals/Params relaxed)
	{
		files: ['tests/**/*.test.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.test.json',
				tsconfigRootDir: import.meta.dirname
			}
		}
	},

	// Prettier configuration must be last
	prettierConfig
)
