# 6. Project front-end

Date: 2023-10-29

## Status

Accepted

## Context

The Forms Platform project requires a public web presence to communicate project details and as a host for prototypes and demos.

Additionally, the project team aspires to create modular components that are flexible and easy-to-leverage by software development teams throughout government. The project's web presence is a convenient place to dogfood any components that are built for wider consumption.

## Decision

The project team will use the Astro web framework.

## Consequences

Astro has native support for most commonly-used web frameworks, so serves as a single location to test integration of project modules with common view layers.

Astro by default is Javascript-free, which encourages progressive enhancement.

Astro cleanly supports common static site content patterns. Adding Markdown documentation to the site will be relatively easy.

Negatively, Astro is a mid-tier web framework that may lose updates and compatibility in the coming years. This risk is mitigated by encapsulating dependent logic outside of Astro components.
