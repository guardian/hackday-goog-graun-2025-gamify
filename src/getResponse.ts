const MODEL_ID = "gemini-2.0-flash-001";
const PROJECT_ID = "guardian-hackathon";
const url = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${MODEL_ID}:generateContent`;
const token = import.meta.env.VITE_AI_PLATFORM_ACCESS_TOKEN;

export const getResponse = async (command: string) => {
  const request = fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: {
        role: "user",
        parts: [
          {
            text: command,
          },
        ],
      },
    }),
  });
  const response = await request;
  const data = await response.json();

  return data.candidates[0].content.parts[0].text;
};
