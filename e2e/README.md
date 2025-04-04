# End-to-end and interaction testing

These tests run separately form the main test suite due to the time it takes to run them. They are designed to primarily run in CI, but it's suggested to do periodic spot checks during development.

To run the tests, run `pnpm test` in this directory.

## Testing the authenticated state
In order to test the authenticated state, you can generate an auth session and the associated cookie. To authenticate for these tests, you can run the following command:

```bash
pnpm --filter=@gsa-tts/forms-cli cli e2e create-test-session -p ../../packages/server/src/main.db -o ../../e2e/.env
```

## Developing tests
The easiest way to develop tests is to run Playwright in UI mode. This is available by running the following command from this directory.

```bash
pnpm test:dev
```

When Playwright starts in UI mode, the UI will open automatically at `http://localhost:8080`.