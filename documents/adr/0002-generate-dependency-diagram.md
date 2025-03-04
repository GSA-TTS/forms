# 2. Generate dependency diagram

Date: 2023-09-13

## Status

Deprecated - replaced with manual documentation [available here](../architecture.md).

## Context

The Forms Platform project is kicking off, and we need to document our system and software architecture for both internal and external stakeholders.

## Decision

We will auto-generate a dependency diagram of all projects within the project's pnpm monorepo, and include it within the project's markdown documentation. The dependency diagram generator will be part of the codebase and will reside in `/packages/dependency-graph`. A command-line entrypoint for the generator will be provided.

Additional diagrams will be checked into the git repository in suitable formats, such as [MermaidJS](https://mermaid.js.org/), which Github can render in markdown blocks. Other visual documentation will be linked to in the markdown documentation.

## Consequences

When changes to the top-level dependencies are made, the diagram should be regenerated.
