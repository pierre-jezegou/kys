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
    participant S3
    participant DynamoDB
    participant Rekognition

    User->>Webshop: Fill checkout form (name, university)
    Webshop->>Server: Create verification session
    Server->>DynamoDB: Save form data
    Server->>Webshop: Verification session created
    Webshop-->>User: Redirect to verification service

    par Upload Student ID and Selfie
        User->>Server: Request pre-signed URL for student ID upload
        Server->>S3: Request pre-signed URL for student ID upload
        S3-->>Server: Pre-signed URL created
        Server-->>User: Pre-signed URL created
        User->>S3: Upload student ID
    and
        User->>Server: Request pre-signed URL for selfie upload
        Server->>S3: Request pre-signed URL for selfie upload
        S3-->>Server: Pre-signed URL created
        Server-->>User: Pre-signed URL created
        User->>S3: Upload selfie
    end

    par [Verification]
        Server->>Rekognition: Extract text from student ID
        Rekognition-->>Server: Text extracted
    and
        Server->>Rekognition: Extract face from selfie
        Rekognition-->>Server: Face extracted
    and
        Server->>Rekognition: Extract face from student ID
        Rekognition-->>Server: Face extracted
    end

    Server->>Rekognition: Compare faces
    Rekognition-->>Server: Face comparison result

    Server->>DynamoDB: Update verification status

    User->>Server: Poll verification status
    Server->>DynamoDB: Poll verification status
    DynamoDB-->>Server: Verification status
    Server-->>User: Verification status
    User->>Webshop: Redirect to checkout
```