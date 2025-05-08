from google.adk.agents import Agent
from google.adk.tools import google_search

root_agent = Agent(
    name="test_agent",
    model="gemini-2.5-flash-preview-04-17",
    description=(
        "Agent to lookup articles on theguardian.com and provide an investigative experience for the Panama papers"
    ),
    instruction=(
        "You are a helpful agent who can search theguardian.com using the 'google_search' tool."
    ),
    tools=[google_search],
)
