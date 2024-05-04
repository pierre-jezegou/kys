export const createSession = async (name: string, university: string) => {
  // Extract base endpoint to the environment
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
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

export async function uploadToS3(url: string, file: File, sessionId: string) {
  // Fetch a presigned URL from the server
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, contentType: file.type }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch presigned URL");
  }

  const presignedUrl = await response.json();

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
