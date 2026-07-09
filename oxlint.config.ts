import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import svelte from "ultracite/oxlint/svelte";

// Ultracite's preset is intentionally maximal. We keep every correctness rule
// but relax stylistic rules that fight SvelteKit conventions and readability
// (PascalCase component files, `let` props, alphabetical object keys, and
// promise-chaining inside reactive `$effect`s). See docs/DECISIONS.md.
export default defineConfig({
  extends: [core, svelte],
  ignorePatterns: [...core.ignorePatterns, "build/", ".svelte-kit/", "docs/"],
  rules: {
    "unicorn/filename-case": "off",
    "sort-keys": "off",
    "func-style": "off",
    "promise/prefer-await-to-then": "off",
    "unicorn/no-array-sort": "off",
    "no-loop-func": "off",
    "typescript/consistent-type-definitions": "off",
    "prefer-const": "off",
    "no-await-in-loop": "off",
    "no-empty-function": "off",
    "class-methods-use-this": "off",
    "unicorn/no-empty-file": "off",
    "unicorn/require-module-specifiers": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/numeric-separators-style": "off",
    "import/consistent-type-specifier-style": "off",
  },
});
