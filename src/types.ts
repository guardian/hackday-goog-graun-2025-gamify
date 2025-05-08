export type AgentId = "test_guardian_agent" | "test_joke_agent";

export type SessionInfo = {
  sessionId: string;
  agentId: AgentId;
};
