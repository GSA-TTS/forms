import type { ViteUserConfig } from 'vitest/config';

export default {
  test: {
    /* vitest-github-actions-reporter is currently set via the command-line
    reporters: env.GITHUB_ACTIONS
      ? ['default', new GithubActionsReporter()]
      : ['default', 'html'],
    */
    coverage: {
      enabled: false,
      reporter: ['html', 'text', 'text-summary'],
      reportOnFailure: true,
    },
  },
} satisfies ViteUserConfig;
