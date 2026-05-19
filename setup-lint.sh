#!/usr/bin/env bash
# Run this once from the project root to install ESLint + Prettier + Husky
# Usage: bash setup-lint.sh

set -e

echo "Installing ESLint, Prettier, Husky, lint-staged..."
npm install --save-dev --no-audit --no-fund \
  eslint@^9 \
  "@eslint/js@^9" \
  angular-eslint@^19 \
  typescript-eslint@^8 \
  "@typescript-eslint/eslint-plugin@^8" \
  "@typescript-eslint/parser@^8" \
  eslint-config-prettier@^10 \
  eslint-plugin-prettier@^5 \
  prettier@^3 \
  husky@^9 \
  lint-staged@^15

echo "Initialising Husky..."
npx husky init || true
# Restore pre-commit hook (husky init overwrites it)
echo "npx lint-staged" > .husky/pre-commit

echo ""
echo "Done! Run: npm run lint && npm run format:check"
