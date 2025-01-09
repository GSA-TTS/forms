import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';

import viteConfig from './vite.config';
import sharedTestConfig from '../../vitest.shared';

export default mergeConfig(
  viteConfig,
  defineConfig({
    ...sharedTestConfig,
    plugins: [
      storybookTest({
        configDir: path.join(
          dirname(fileURLToPath(import.meta.url)),
          '.storybook'
        ),
        storybookScript: 'storybook dev -p 9011 --no-open',
        storybookUrl: 'http://localhost:9011',
      }),
      //storybookNextJsPlugin(), // 👈 Apply the framework plugin here
    ],
    test: {
      ...sharedTestConfig.test,
      //environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      browser: {
        enabled: true,
        name: 'chromium',
        headless: true,
        provider: 'playwright',
      },
      include: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    },
  })
);
