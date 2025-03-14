/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
export default defineConfig({
  optimizeDeps: {
    exclude: ['chromium-bidi', 'fsevents'],
  },
  test: {
    name: '@gsa-tts/forms-server:browser',
    browser: {
      provider: 'playwright',
      enabled: true,
      name: 'chromium',
      headless: true,
    },
    include: ['src/**/*.test.browser.ts'],
  },
});
