# API

## Endpoints

| Endpoint              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `POST /session`       | Create a new session, returns a session ID        |
| `GET /session`        | Get a session by ID                               |
| `POST /presigned-url` | Create a presigned URL for uploading a file to S3 |


## Sequence Diagrams

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant S3

    Client->>Server: POST /session
    Server->>Client: 200 OK { session ID }
    Client->>Server: POST /presigned-url
    Server->>Client: 200 OK { presigned URL }
    Client->>S3: PUT /presigned-url
    S3->>Client: 200 OK
    Client->>Server: GET /session
    Server->>Client: 200 OK { session }
```

## Verification Flow

```mermaid
sequenceDiagram
    participant Webshop
    participant User
    participant Server
    participant AWS

    User->>Webshop: Fill checkout form (name, university)
    Webshop->>Server: Create verification session
    Server->>AWS: Create verification session
    AWS-->>Server: Verification session created
    Server-->>Webshop: Verification session created
    Webshop-->>User: Redirect to verification service
    User->>Server: Request pre-signed URL for student ID upload
    Server->>AWS: Request pre-signed URL for student ID upload
    AWS-->>Server: Pre-signed URL created
    Server-->>User: Pre-signed URL created
    User->>AWS: Upload student ID
    User->>Server: Request pre-signed URL for selfie upload
    Server->>AWS: Request pre-signed URL for selfie upload
    AWS-->>Server: Pre-signed URL created
    Server-->>User: Pre-signed URL created
    User->>AWS: Upload selfie
    User->>Server: Poll verification status
    Server->>AWS: Poll verification status
    AWS-->>Server: Verification status
    Server-->>User: Verification status
    User->>Webshop: Redirect to checkout
```