import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/*/vitest.config.ts',
  'infra/*',
  'packages/auth',
  'packages/common',
  'packages/database',
  'packages/dependency-graph',
  'packages/design',
  'packages/forms',
  //'packages/server/vitest.config.ts',
  'packages/server/vitest.config.browser.ts',
]);
