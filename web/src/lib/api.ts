export const createSession = async (name: string, university: string) => {
  // Extract base endpoint to the environment
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      university,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  const { sessionId } = await response.json();

  return sessionId;
};

async function getPresignedUrl(
  url: string,
  sessionId: string,
  contentType: string
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, contentType }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch presigned URL");
  }

  return response.json();
}

export async function getPresignedUrlForSelfie(
  sessionId: string,
  contentType: string
) {
  return getPresignedUrl(
    `${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}/presigned-url/selfie`,
    sessionId,
    contentType
  );
}

export async function getPresignedUrlForStudentId(
  sessionId: string,
  contentType: string
) {
  return getPresignedUrl(
    `${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}/presigned-url/student-id`,
    sessionId,
    contentType
  );
}

export async function uploadToS3(presignedUrl: string, file: File) {
  // Upload the file to S3 using the presigned URL
  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to S3");
  }
  return uploadResponse;
}

export async function getSession(sessionId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`
  );
  return response.json();
}

export async function getSessions() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/session/audit`
  );
  return response.json();
}

export async function getSessionToken(sessionId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}/jwt`
  );
  return response.json();
}
