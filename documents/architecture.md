# Forms Platform architecture

## Overview

Forms Platform is organized into several packages:

| Package                        | Description                        | Dependencies                                                                                                                             |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [Forms](forms/README.md)       | Platform services and domain logic | [Common](common/README.md), [Database](database/README.md)                                                                               |
| [Server](server/README.md)     | Platform Node.js web server        | [Auth](auth/README.md), [Common](common/README.md), [Database](database/README.md), [Design](design/README.md), [Forms](forms/README.md) |
| [Design](design/README.md)     | User-facing interface components   | [Common](common/README.md), [Forms](forms/README.md)                                                                                     |
| [Auth](auth/README.md)         | Authentication and authorization   | [Common](common/README.md), [Database](database/README.md)                                                                               |
| [Common](common/README.md)     | Shared utilities                   | _None_                                                                                                                                   |
| [Database](database/README.md) | Backend storage                    | [Common](common/README.md)                                                                                                               |

## High-level architecture diagram

This C4-like architectural diagram documents data flows in a typical deployment scenario:

```mermaid
flowchart TB
    %% Style definitions
    classDef blue fill:#2374ab
    classDef invisible opacity:0

    subgraph "External Users"
        formFiller[Form Filler: Submits forms]
        formCreator[Form Creator: Uses no-code interface to create forms]
        formReviewer[Form Reviewer: Reviews submitted forms]
    end

    subgraph platform["Forms Platform (Internal)"]
        style platform fill:#fcf8d4,color:#000
        webServer[Platform Server: Handles form creation, submission, and interactions]:::blue
        database[(Postgres DB: Stores form data and user information)]
    end

    subgraph "External Systems"
        loginGov[Login.gov: Handles authentication]

        subgraph "Agency Systems"
            agencyBackend[Agency Backend Systems: Receives submitted form data]
            s3Bucket[Amazon S3: Stores completed forms]
        end
    end

    formCreator -->|Creates forms using| webServer
    formFiller -->|Submits forms via| webServer
    formReviewer -->|Reviews submitted forms using| webServer
    webServer -->|Stores and retrieves form data from| database

    webServer -->|Authenticates form creators - https| loginGov
    webServer -->|Submits form data to Agency Backend - https| agencyBackend
    webServer -->|Uploads form PDFs to S3 Bucket - https| s3Bucket

    %% Forcing "External Systems" to be below "Forms Platform"
    dummyNode[ ]:::invisible
    webServer --> dummyNode
    dummyNode --> loginGov
```
