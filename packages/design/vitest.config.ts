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
    ],
    test: {
      ...sharedTestConfig.test,
      setupFiles: './vitest.setup.ts',
      browser: {
        enabled: true,
        name: 'chromium',
        headless: true,
        provider: 'playwright',
      },
      include: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.stories.tsx',
      ],
    },
  })
);
