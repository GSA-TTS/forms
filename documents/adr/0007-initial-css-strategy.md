# 7. Initial CSS strategy

Date: 2023-10-23

## Status

Accepted

## Context

The Forms Platform project will produce many frontend components that leverage the [U.S. Web Design System](https://designsystem.digital.gov/).

The project team desires a method of managing CSS using a method that maximizes utility outside this project.

## Decision

The project team will theme USWDS via an encapsulated build (`@atj/design`). Any USWDS-related configuration or initialization will reside in this package.

The Spotlight frontend will leverage this package via CSS imports. Where necessary, the Spotlight frontend application will use straight CSS.

## Consequences

There is a bit more pomp and circumstance required to leverage styles that are in a separate project (`@atj/design`) than there is when importing SASS directly via Astro.

This decision is easily reversed if there proves to not be benefit from the extra modularization.
