# Pending loose ends

## Context

In early May 2025, Forms Platform development was suspended indefinitely. At that point, the project team was preparing for a pilot production launch, which would have brought functionality to an MVP status and wrapped up technical loose ends. This document describes that unfinished technical work that should be considered project development resumes.

## Task list

- ADR [0014-authentication](./adr/0014-authentication.md) describes an authentication approach that leverages the Lucia library. Lucia usage should be reconsidered when integrating with a production identity provider.
- ADR [0015-rest-api](./adr/0015-rest-api.md) describes a simple strategy for bootstrapping an API with Astro. At some point, before extensive API growth but probably perhaps pilot, a more thought out strategy should be considered.
- ADRs [0007-initial-css-strategy](./adr/0007-initial-css-strategy.md) and [0016-unused-css](./adr/0016-unused-css.md) describe CSS approaches. This approach should be reconsidered when the ability to integrate with agency USWDS themes and component encapsulation become important qualities.
