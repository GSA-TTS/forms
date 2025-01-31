# 9. Design assets workflow

Date: 2024-01-16

## Status

Accepted

## Context

Forms Platform requires user interface components for form lifecycle operations, including creating and filling web-based forms. These components will be demo'd as part of the project's phase 3 work, and are intended to be leveraged by third-parties. These components inherit the stylesheet strategy outlined in ADR [./0007-initial-css-strategy.md](./0007-initial-css-strategy.md).

The project team requires a method of organizing frontend components that facilitates rapid development and collaboration.

## Decision

The project team will use [Storybook](https://storybook.js.org/) as development aid, component documentation, and collaboration tool. Storybook and corresponding React components will be located in the @gsa-tts/forms-design namespace. The Storybook build will be bundled with the Spotlight build and deployed to Cloud.gov Pages.

The Spotlight frontend will leverage this package via CSS imports. Where necessary, the Spotlight frontend application will use straight CSS.

## Consequences

The deployed application will include a Storybook instance at `/design`.
