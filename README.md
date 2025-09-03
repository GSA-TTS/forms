# 10x Forms Platform

> **Notice:**
> As of early May 2025, Forms Platform development is paused pending administrative prioritization.

Forms Platform is the product of extensive research and development completed by [10x](https://10x.gsa.gov/), a federal venture studio housed within the [General Services Administration](https://www.gsa.gov/)'s [Technology Transformation Services](https://tts.gsa.gov/).

Forms Platform aims to solve a persistent challenge faced by federal agencies: delivery of compliant and user-friendly forms, delivered cost-effectively, seamlessly integrated with diverse agency workflows, and accessible to non-technical program office staff. Deployed broadly, Forms Platform would serve as a common interface to federal government services, tailored to public sector needs.

If you would like to connect with the team or are interested in Forms Platform for your agency, please contact us at [10x-forms-platform@gsa.gov](mailto:10x-forms-platform@gsa.gov).

## Overview

An architectural overview is [available here](documents/architecture.md).

Additional documentation:

- [Architectural Decision Records (ADRs)](./documents/adr/)
- [Release process](./documents/release-process.md)

### Key personas

The platform is targeted to the following user groups:

- Form Builders: government program office staff or UX experts who create and publish "guided interview" web experiences for members of the public and fellow government staff via a friendly browser-based app, no coding necessary. For examples of "guided interview" style web experiences, check out [IRS Direct File](https://coforma.io/case-studies/irs-direct-file#results) (filing your taxes), [GetCalFresh](https://codeforamerica.org/news/overcoming-barriers-setting-expectations-for-calfresh-eligibility/) (Applying for food benefits) and [Court Forms Online](https://courtformsonline.org/) (filing court documents).
- Form Fillers: folks who provide info to the government via guided interviews created by Form Builders

### Things

Key concepts in the platform

- **Blueprint**: produced by a form builder, the blueprint defines the structure of an interactive session between a government office and a form filler.
- **Conversation**: one instance of a blueprint; the interactive session between a government office and a form filler. Other terms for this concept include dialogue or session.
- **Pattern/template**: the building blocks of a blueprint, patterns implement UX best-practices, defining the content and behavior of the user interface.
- **Prompt**: produced by a pattern, the prompt defines what is presented to the end user at single point in a conversation.
- **Component**: user interface component that acts as the building block of prompts.

## Development

This project uses the version of Node.js defined in [.nvmrc](./nvmrc). To ensure you're using the correct node version, you may use the [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm):

```bash
nvm install
```

This project uses [pnpm workspaces](https://pnpm.io/workspaces). To work with this project, [install pnpm](https://pnpm.io/installation) and then the project dependencies:

```bash
pnpm install
```

To install the browsers needed for the Storybook testing with `@vitest/browser`, you need to do a one-time install with `pnpm dlx playwright@1.51.1 install --with-deps`. This command also needs to be run when Playwright is updated because it requires version parity to find the executables across the local dev environment and CI to get all the tests to pass. To run the complete test suite, with coverage metrics generated:

```bash
pnpm test
```

To run tests, you will need to have either Podman or Docker Desktop installed to enable PostgreSQL to start in a container before the tests execute. While we support both Docker and Podman, we recommend using Podman as a free alternative. For detailed setup instructions, refer to the [Podman Desktop Integration](./documents/podman-integration.md) guide.

To run tests in watch mode (except the `infra` tests, which use Jest):

```bash
pnpm vitest
```

If you start having unexplained build errors, the following commands are useful to clean up and start fresh.

```bash
pnpm clean:dist # removes previously built files recursively
pnpm clean:modules # removes node_module directories recursively

# ... run more commands like pnpm install and pnpm build after you have run these
```

To start developing with hot reloading, use:

```bash
pnpm build
```

then run:

```bash
pnpm dev
```

These local servers will be started:

- Astro website - http://localhost:4321/
- Storybook - http://localhost:61610/

To lint the source code:

```bash
pnpm lint
```

## Command-line interface

A command-line interface is provided for manually running operations. The corresponding app resides in [./apps/cli](./apps/cli). A wrapper script, in the root directory, is provided.

```bash
./manage.sh --help
```
