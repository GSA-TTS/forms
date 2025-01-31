# @gsa-tts/forms-design

This package encapsulates all the design components used in Forms Platform frontend applications.

This includes:

- USWDS themed stylesheet
- React component library
- Storybook stories

See relevant ADRs:

- [documents/adr/0007-initial-css-strategy](../../documents/adr/0007-initial-css-strategy.md)
- [documents/adr/0009-design-assets-workflow.md](../../documents/adr/0009-design-assets-workflow.md)

This package as a special watch task. If your dev server is running already (`pnpm dev`), you can open a separate terminal and run `pnpm test:watch` and any changes to the *.{ts,tsx} files in this package will run the test suite. If you'd like to run from the project root directory, you would run `pnpm --filter @gsa-tts/forms-design test:watch`.
