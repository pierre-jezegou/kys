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