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
