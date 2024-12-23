# 13. Database strategy

Date: 2024-09-04

## Status

Approved

## Context

During the prototyping and demo phase, the Form Platform used browser-local storage in lieu of a database. This allowed the team to limit development efforts to a simple static site, avoiding the cost of building a backend system.

As we prepare to support our first government use case, we require a database to persist users, forms, form sessions, form submissions, and other future data.

It is important that the database approach is clean and testable. Test strategies should include service-level integration tests and system integration tests, including end-to-end tests. The database should also be easy to mock, but fast integration tests should be preferred, when appropriate.

The database should be commonly used and easy to host in many varied deployment environments. Libraries utilized should also be well-supported by an active community, and leverage the strengths of Typescript.

## Decision

We will use PostgreSQL in our production deployments. We will use [Testcontainers](https://testcontainers.com/) to unit-test database gateway logic against a PostgreSQL container. Integration testing will be handled with an in-memory SQLite database.

[Knex.js](https://knexjs.org/) is the most widely-used node.js query builder, and has backend adapters for most common relational databases. We will utilize Knex.js for its migration support. Knex.js may also be used for queries, as appropriate.

[Kysely](https://kysely.dev/) is a query builder that offers Typescript niceties that Knex.js lacks. Its usage numbers are growing rapidly, but the library's maturity, particularly with its migrations, is a bit behind Knex.js. Due to the developer experience gains of type-safety, we will use Kysely for most database queries.

Abstract adapters to the database will hide technical details from consuming code and minimize setup/teardown boilerplate in tests.

## Consequences

The platform will target Postgres, a safe and featureful database, which we can deploy to a wide array of cloud environments.

Confidence in the correctness of code will be enhanced with the use of integration testing and the avoidance of mocking.

Helpers will be created to facilitate easy testing of database gateway functions against a Testcontainers-managed Postgres database. Additional helpers will be created to enable integration testing against a fast, in-memory SQLite database.

The test strategy is intended to be a pragmatic mix between speed and simplicity, but the reliance on integration tests may eventually lead to a slow test suite. The team should keep an eye on this and continually reevaluate.
