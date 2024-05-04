export const createSession = async (name: string, university: string) => {
  // Extract base endpoint to the environment
  const response = await fetch(
    `https://8taeoi4dm2.execute-api.us-east-1.amazonaws.com/get-session-id?name=${name}&university=${university}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  // Log the response
  console.log(response);

  const { sessionId } = await response.json();
  return sessionId;
};
