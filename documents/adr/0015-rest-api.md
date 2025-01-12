# 15. REST API approach

Date: 2024-09-04

## Status

Approved

## Context

During the prototyping and demo phase, the Form Platform used client-side services that persisted to browser local storage. As we introduce a backend to support agency users, we need to structure an API for the content authoring operations of the platform.

## Decision

The Form Platform will initially implement an HTTP API in the Astro server. The API will aim to be an idiomatic REST API. A client-side service that proxies requests via HTTP calls will be injected into the form manager implementation.

For the short term, we will maintain the existing client-side local storage service implementation. This will allow us to continue to test the form platform in static site mode, without a backend, as well as provide an implementation for in-browser integration testing. This will be reevaluated as we mature the form builder portion of the codebase.

## Consequences

The project will have a seamless transition to a backend, without disrupting the existing behavior of the system. We will reevaluate API needs as the platform evolves.
