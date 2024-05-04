import { useEffect, useState } from "react";

type UsePresignedUrl = {
  presignedUrl: string | null;
  error: Error | null;
  isLoading: boolean;
};

export function usePresignedSelfieUrl(sessionId: string): UsePresignedUrl {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const response = await fetch(
          `https://8taeoi4dm2.execute-api.us-east-1.amazonaws.com/presigned-url/selfie?session_id=${sessionId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch presigned URL");
        }

        const { presignedUrl } = await response.json();
        setPresignedUrl(presignedUrl);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [sessionId]);

  return { presignedUrl, error, isLoading };
}


export function usePresignedStudentIdUrl(sessionId: string): UsePresignedUrl {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const response = await fetch(
          `https://8taeoi4dm2.execute-api.us-east-1.amazonaws.com/presigned-url/student-id?session_id=${sessionId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch presigned URL");
        }

        const { presignedUrl } = await response.json();
        setPresignedUrl(presignedUrl);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [sessionId]);

  return { presignedUrl, error, isLoading };
}
