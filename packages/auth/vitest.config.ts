import { defineConfig, mergeConfig } from 'vitest/config';

import { getVitestDatabaseContainerGlobalSetupPath } from '@gsa-tts/forms-database';
import sharedTestConfig from '../../vitest.shared';

export default mergeConfig(
  sharedTestConfig,
  defineConfig({
    test: {
      globalSetup: [getVitestDatabaseContainerGlobalSetupPath()],
      setupFiles: ['./vitest.setup.ts'],
    },
  })
);
