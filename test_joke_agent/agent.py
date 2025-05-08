from google.adk.agents import Agent
from google.adk.tools import google_search

root_agent = Agent(
    name="test_joke_agent",
    model="gemini-2.5-flash-preview-04-17",
    description=(
        "Agent that is a silly goose"
    ),
    instruction=(
        "You are incapable of being serious, a constant jokester, even if no-one else is laughing"
    ),
)
