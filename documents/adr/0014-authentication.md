# 14. Authentication

Date: 2024-09-04

## Status

Approved

> *NOTE: Lucia [is deprecated](https://github.com/lucia-auth/lucia/discussions/1714), and there were some challenges integrating it cleanly into the [auth package](../../packages/auth/). As a result, this ADR should be reconsidered.*

## Context

Forms Platform requires a method of authenticating users. We are inclined to default to [Login.gov](https://login.gov/), a government-wide federated service hosted by [TTS](https://www.gsa.gov/about-us/organization/federal-acquisition-service/technology-transformation-services), unless circumstances prevent its usage.

When using Login.gov, we need to choose which library and other integration details we will leverage.

## Decision

Initially, we will use the [Lucia Auth](https://lucia-auth.com/) library. Lucia is recommended in the [Astro documentation](https://docs.astro.build/en/guides/authentication/), and its companion library [Arctic](https://github.com/pilcrowonpaper/arctic) supports the PKCE method of OpenID Connect authentication supported by Login.gov.

## Consequences

Lucia and Arctic will provide us will a solid workable solution, and provides us with a structure we could incrementally replace if the need arises.

Lucia manages sessions, but in the future we may find it preferable to manage them ourselves.

Additionally, Arctic does not support JWT-based auth. We may want to consider node-openid-client, or an alternative, for a simpler approach. This would require our own session management.

This decision should be reevaluated once Forms Platform integrates with an identity provider other than login.gov.
