// Can't be bothered typing this
type Body = any;

const USER_ID = "user-id";

export const sendRequest = async (url: string, body?: Body) => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  const request = fetch(url, options);
  const response = await request;
  if (response.status !== 200) {
    throw new Error("Request failed");
  }
  return await response.json();
};

export const startSession = async () => {
  // TODO: allow choice of agent?
  const agentId = "agent";
  const sessionId = crypto.randomUUID();
  const url = `http://localhost:8000/apps/${agentId}/users/${USER_ID}/sessions/${sessionId}`;

  return sendRequest(url);
};

export const sendCommand = async (sessionId: string, command: string) => {
  const url = `http://localhost:8000/run`;
  const body = {
    app_name: "agent",
    user_id: USER_ID,
    session_id: sessionId,
    new_message: {
      role: "user",
      parts: [
        {
          text: command,
        },
      ],
    },
  };

  const response = await sendRequest(url, body);

  return response[0].content.parts
    .map((part: any) => part.text)
    .filter(Boolean)
    .join(",");
};
