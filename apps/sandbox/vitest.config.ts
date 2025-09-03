import { defineConfig } from 'vitest/config';

import sharedTestConfig from '../../vitest.shared';

export default defineConfig({
  ...sharedTestConfig,
  test: {
    ...sharedTestConfig.test,
  },
});
