/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    name: '@atj/server:node',
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.test.browser.ts'],
  },
});
