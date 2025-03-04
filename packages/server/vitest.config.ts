/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import { configDefaults } from 'vitest/config';

export default getViteConfig({
  test: {
    ...configDefaults,
    name: '@gsa-tts/forms-server:node',
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.test.browser.ts'],
  },
});
