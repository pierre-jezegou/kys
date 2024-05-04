# API

## Endpoints

| Endpoint              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `POST /session`       | Create a new session, returns a session ID        |
| `GET /session`        | Get a session by ID                               |
| `POST /presigned-url` | Create a presigned URL for uploading a file to S3 |

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

    par Upload Student ID and Selfie
        User->>Server: Request pre-signed URL for student ID upload
        Server->>AWS: Request pre-signed URL for student ID upload
        AWS-->>Server: Pre-signed URL created
        Server-->>User: Pre-signed URL created
        User->>AWS: Upload student ID
    and
        User->>Server: Request pre-signed URL for selfie upload
        Server->>AWS: Request pre-signed URL for selfie upload
        AWS-->>Server: Pre-signed URL created
        Server-->>User: Pre-signed URL created
        User->>AWS: Upload selfie
    end
    
    par [Verification]
        Server->>AWS: Extract text from student ID
        AWS-->>Server: Text extracted
    and 
        Server->>AWS: Extract face from selfie
        AWS-->>Server: Face extracted
    and 
        Server->>AWS: Extract face from student ID
        AWS-->>Server: Face extracted
    end

    Server->>AWS: Compare faces
    AWS-->>Server: Face comparison result
    
    Server->>Server: Verify text in student ID
    Server->>AWS: Update verification status

    User->>Server: Poll verification status
    Server->>AWS: Poll verification status
    AWS-->>Server: Verification status
    Server-->>User: Verification status
    User->>Webshop: Redirect to checkout


```