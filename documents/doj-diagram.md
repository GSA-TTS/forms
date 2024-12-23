# Forms Platform - DOJ architecture diagram

Sample diagram of a potential DOJ deployment of the Forms Platform.

```mermaid
flowchart TB
    subgraph "External Users"
        formFiller[Form Filler: Submits forms]:::userStyle
        formCreator[Form Creator: Uses no-code interface to create forms]:::userStyle
        formReviewer[Form Reviewer: Reviews submitted forms]:::userStyle
    end

    subgraph "DOJ Boundary"
        subgraph "Forms Platform (Internal)"
            webServer[Node.js Web Server: Handles form creation, submission, and interactions]:::webStyle
            database[(Postgres DB: Stores form data and user information)]:::dbStyle
        end

        subgraph "Agency Systems"
            agencyBackend[Agency Backend Systems: Receives submitted form data]:::agencyStyle
            s3Bucket[(Amazon S3: Stores completed forms)]:::agencyStyle
        end
    end

    subgraph "External Systems"
        loginGov[Login.gov: Handles authentication]
    end

    formCreator -->|Creates forms using| webServer
    formFiller -->|Submits forms via| webServer
    formReviewer -->|Reviews submitted forms using| webServer
    webServer -->|Stores and retrieves form data from| database

    webServer -->|Authenticates form creators via HTTPS| loginGov
    webServer -->|Submits form data to Agency Backend via HTTPS| agencyBackend
    webServer -->|Uploads form PDFs to S3 Bucket via HTTPS| s3Bucket

    classDef userStyle fill:#ffa500,stroke:#000,stroke-width:2px,color:#000;
    classDef webStyle fill:#6f6,stroke:#000,stroke-width:2px,color:#000;
    classDef dbStyle fill:#f9f,stroke:#333,stroke-width:2px,color:#000;
    classDef agencyStyle fill:#cde,stroke:#000,stroke-width:2px,color:#000;
```
