# 10. End-to-end and interaction testing

Date: 2024-07-08

## Status

Approved

## Context

The Forms Platform team would like certainty that the platform codebase works end-to-end. This should include granular tests on a component level, and tests that cover multi-step user journeys.

Certain frontend tests are not able to be performed with browser fakes, such as Storybook tests run via JSDOM (e.g. drag-and-drop). The ability to replicate more complex user interactions in the test suite through an actual browser can provide this feature.

## Decision

We will use Playwright for end-to-end testing. End-to-end tests should be used sparingly since they are the slowest tests. These comprehensive tests will be stored in the e2e directory, omitted from default dev test runners, and run automatically via CI/CD.

Vitest Browser Mode will be used for interaction testing via Storybook as well as more traditional Vitest unit tests. Storybook will be the primary mechanism for UI testing, where appropriate.

## Consequences

The frontend will have strong test coverage by leveraging fast-running unit tests in a real browser, and multi-step user flows will be tested via Playwright end-to-end tests.
