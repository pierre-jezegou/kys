# API

Guiding principles:

- RESTful API
- JSON as the primary data format
- Event-driven architecture
- Strongly asynchronous

## Public Endpoints

| Endpoint                         | Description                                       |
|----------------------------------|---------------------------------------------------|
| `POST /session`                  | Create a new session, returns a session ID        |
| `GET /session`                   | Get all sessions, supports pagination             |
| `GET /session/{id}`              | Get a session by ID                               |
| `GET /session/{id}/jwt`          | Get the verification status of a session as jwt   |
| `POST /presigned-url/selfie`     | Create a presigned URL for uploading a file to S3 |
| `POST /presigned-url/student-id` | Create a presigned URL for uploading a file to S3 |

<details>

<summary>JWT Claims</summary>

```json lines
{
  // session ID
  "sub": "3848a553-c341-4826-974c-6367d7005e0b",
  "name": "John Doe",
  // "student" or "non-student"
  "roles": [
    "non-student"
  ],
  // Students institute or None
  "institute": "Harvard",
  // Issued at
  "iat": 1715961878,
  // Issuer
  "iss": "https://verify.college",
  // Expiration
  "exp": 1716566678,
  // JWT ID
  "jti": "9f7c4cb4-aba2-44a7-a943-c654ea161e18"
}
```

</details>

## Internal Lambda Functions

| Function            | Description                                |
|---------------------|--------------------------------------------|
| `upload-selfie`     | Upload a selfie to S3                      |
| `upload-student-id` | Upload a student ID to S3                  |
| `extract-text`      | Extract text from an image                 |
| `extract-face`      | Extract a face from an image               |
| `compare-faces`     | Compare two faces                          |
| `update-status`     | Update the verification status in DynamoDB |

## State Machine

```mermaid

flowchart TB
    Start[*] -->|API: Customer creates session| Created
    Created[Created] -->|S3 Event: Student uploads selfie| UploadedSelfie[UploadedSelfie]
    UploadedSelfie -->|S3 Event: Student uploads id| UploadedStudentCard[UplopadedStudentCard]


    subgraph Verification process
    subgraph Approved states
        Approved
    end

    subgraph Denied states
        TextMismatch
        MoreThanOneFace
        FaceMismatch
    end

    UploadedStudentCard -->|Name or university mismatch| TextMismatch
    UploadedStudentCard -->|Name and university match| TextMatched
    TextMatched -->|Multiple faces in pictures| MoreThanOneFace
    TextMatched -->|Exactly one face in pictures| ExactlyOneFace
    ExactlyOneFace -->|Face comparison failed| FaceMismatch
    ExactlyOneFace -->|Face comparison suceeded| Approved
end
```

## Verification Flow

```mermaid
sequenceDiagram
    participant Webshop
    participant User
    participant Server
    participant S3
    participant DynamoDB
    participant Rekognition

    Webshop-->>User: Redirect to verification service

    User->>Server: Fill checkout form (name, university)
    Server->>DynamoDB: Create session document
    DynamoDB-->>Server: Session document created
    Server->>User: Verification session created


    par Upload Student ID and Selfie
        User->>Server: Get pre-signed URL for student ID upload
        Server->>S3: Get pre-signed URL for student ID upload
        S3-->>Server: Pre-signed URL created
        Server-->>User: Pre-signed URL created
        User->>S3: Upload student ID
    and
        User->>Server: Get pre-signed URL for selfie upload
        Server->>S3: Get pre-signed URL for selfie upload
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

    loop Until verification is complete
        User->>Server: Get verification status
        Server->>DynamoDB: Get verification status
        DynamoDB-->>Server: Verification status
        Server-->>User: Verification status
    end

    User->>Server: Get JWT
    Server->>DynamoDB: Get verification status
    DynamoDB-->>Server: Verification status
    Server->>Server: Create JWT
    Server-->>User: JWT
    User->>Webshop: Authenticate as a student with JWT
```
