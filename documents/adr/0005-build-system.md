# 5. Infrastructure as Code

Date: 2023-10-12

## Status

Accepted

## Context

The development phase of Forms Platform has started. The development effort will focus on building modular form system components.

A method of structuring cohesive and well-encapsulated modules is required. Additionally, the module system should enable efficient builds and integrate with other goals, such as [generating dependency diagrams](./0002-generate-dependency-diagram.md).

## Decision

A [pnpm](https://pnpm.io/) workspace will be utilized. Workspaces are a standard method of organizing multiple interdependent [node.js](https://nodejs.org/) packages in a single repository. pnpm offers efficient package management and well-implemented workspaces.

[Turborepo](https://turbo.build/) will be leveraged to managed efficient builds. In a multi-project workspace, tracking interdependencies between packages is required. Turborepo implements an efficient caching system and execution engine that leads to efficient and developer-friend builds.

## Consequences

Reasoning about dependencies will be enhanced due to each module having an explicit package. Additionally, dependencies will be modularized in a manner that makes it easy to lift and shift the code to another location. Lastly, developer efficiency will be enhanced by the fast builds provided by Turborepo.
