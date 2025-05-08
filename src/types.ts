export type AgentId =
  | "you_be_the_journalist"
  | "test_guardian_agent"
  | "test_joke_agent";

export type SessionInfo = {
  sessionId: string;
  agentId: AgentId;
};
