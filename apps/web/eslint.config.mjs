import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, 
      },
    },
    rules: {
      // customize rules if needed
    }
  },
  {
      ignores: ["dist/", "node_modules/", ".astro/", "*.d.ts"],
  }
);
