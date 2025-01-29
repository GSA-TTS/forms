# 11. Secrets management

Date: 2024-07-11

## Status

Approved

## Context

The Forms Platform requires a method of managing secrets. During the early prototyping phase, we used Terraform with AWS Systems Manager Parameter Store. Secrets were manually created via the AWS console, and lookups were handled by Terraform's corresponding data provider.

As we look to operationalize management processes, tooling for working with secrets will become increasingly helpful. This has become apparent with our first scenario, the login.gov keypair, which needs to be unique for each deployed application.

## Decision

We will abstract secrets management into a package in the project's monorepo, and provide commands in the existing `cli` application for common operations.

Additionally, adapters to the backend vault will be utilized. This will enable managing secrets in a production secret store, or via in-memory or local storage for testing purposes.

We will continue to utilize AWS Systems Manager Parameter Store.

The implementation will live in `infra/core`, which will be the home for other abstract infrastructure code, while `infra/cdktf` will include the concrete implementation of the deployment.

## Consequences

Secrets management that requires repeated manual operations will be automated. In the future, this will include things like secrets rotation via the same command-line interface.

Writing secrets management code as Typescript (rather than Terraform or shell scripts), means we can easily write unit tests for the logic, as well as maintain type-safety across infrastructure code (handling secrets wiring) and the applications that utilize secrets.

Additionally, this approach will make migrating from one secrets storage backend vault to another very easy. We may want to move from Parameter Store to Github Secrets, to limit the surface area of cloud services we utilize.
