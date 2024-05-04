import { useEffect, useState } from "react";

type UsePresignedUrl = {
  presignedUrl: string | null;
  error: Error | null;
  isLoading: boolean;
};

function usePresignedUrl(url: string, sessionId: string): UsePresignedUrl {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch presigned URL");
        }

        const presignedUrl = await response.json();

        setPresignedUrl(presignedUrl);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [url, sessionId]);

  return { presignedUrl, error, isLoading };
}

export function usePresignedSelfieUrl(sessionId: string): UsePresignedUrl {
  return usePresignedUrl(
    `${process.env.NEXT_PUBLIC_API_URL}/presigned-url/selfie`,
    sessionId
  );
}

export function usePresignedStudentIdUrl(sessionId: string): UsePresignedUrl {
  return usePresignedUrl(
    `${process.env.NEXT_PUBLIC_API_URL}/presigned-url/student-id`,
    sessionId
  );
}
