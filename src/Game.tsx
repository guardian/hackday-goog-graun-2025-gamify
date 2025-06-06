import { useState } from "react";
import { Box, Button, Input, HStack, Text, Spinner } from "@chakra-ui/react";
import { useTransition, animated } from "@react-spring/web";
import { startSession, sendCommand } from "./server";
import type { AgentId, SessionInfo } from "./types";

const initialPrompts: Record<AgentId, string> = {
  you_be_the_journalist: "Shouldn't see this, something must have gone wrong",
  test_guardian_agent:
    "You are an intrepid reporter investigating data. What will you do?",
  test_joke_agent: "Prepare for your sides to be discombobulated",
};

type GameState = "start" | "createSession" | "playing";

type History = {
  value: string;
  type: "command" | "response";
}[];

const historyStyles = {
  command: {
    fontStyle: "italic",
    color: "gray",
  },
  response: {
    whiteSpace: "pre-wrap",
  },
};

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [history, setHistory] = useState<History>([]);
  const [pendingCommand, setPendingCommand] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const historyTransitions = useTransition(history, {
    from: {
      opacity: 0,
      transform: "translateY(10px)",
    },
    enter: [{ opacity: 1, transform: "translateY(0px)" }],
  });

  const startGame = async (agentId: AgentId) => {
    setGameState("createSession");
    try {
      const response = await startSession(agentId);
      const newSessionInfo = { sessionId: response.id, agentId };
      setSessionInfo(newSessionInfo);

      if (agentId === "you_be_the_journalist") {
        const gameStartResponse = await sendCommand(
          newSessionInfo,
          "Start the game"
        );
        setHistory([
          {
            type: "response",
            value: gameStartResponse,
          },
        ]);
      } else {
        setHistory([
          {
            type: "response",
            value: initialPrompts[agentId],
          },
        ]);
      }

      setGameState("playing");
    } catch (error) {
      console.error(error);
      setGameState("start");
      // TODO: toasts for errors?
    }
  };

  if (gameState === "start") {
    return (
      <>
        <Text>Pick the kind of game you want</Text>
        <HStack gap="1rem">
          <Button onClick={() => startGame("you_be_the_journalist")}>
            Be a journalist
          </Button>
          <Button onClick={() => startGame("test_guardian_agent")}>Test</Button>
          <Button onClick={() => startGame("test_joke_agent")}>Funny</Button>
        </HStack>
      </>
    );
  }

  if (gameState === "createSession") {
    return <Spinner />;
  }

  let gusIndex = 0;

  return (
    <>
      {historyTransitions((style, entry) => (
        <animated.div style={style}>
          {entry.type === "response" &&
            sessionInfo?.agentId === "you_be_the_journalist" && (
              <Box margin="0 24px 24px">
                <video
                  src={`/gus/gus-${(gusIndex++ % 6) + 1}.mp4`}
                  autoPlay
                  muted
                  loop
                />
              </Box>
            )}
          <Text {...historyStyles[entry.type]}>{entry.value}</Text>
        </animated.div>
      ))}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSubmitting(true);
          setPendingCommand("");
          setHistory((history) => [
            ...history,
            { value: pendingCommand, type: "command" },
          ]);

          if (!sessionInfo) {
            throw Error("No session started");
          }

          try {
            const response = await sendCommand(sessionInfo, pendingCommand);

            setHistory((history) => [
              ...history,
              { value: response, type: "response" },
            ]);
          } catch (error) {
            console.error(error);
          }

          setSubmitting(false);
        }}
        style={{ width: "100%" }}
      >
        <HStack gap="1rem">
          <Input
            placeholder="Enter your command..."
            flexGrow={1}
            value={pendingCommand}
            onChange={(event) => {
              setPendingCommand(event.target.value);
            }}
          />
          <Button
            minWidth={"120px"}
            disabled={!pendingCommand || submitting}
            type="submit"
          >
            Submit
            {submitting && (
              <>
                {" "}
                <Spinner />
              </>
            )}
          </Button>
        </HStack>
      </form>

      <HStack>
        <Text>Or</Text>{" "}
        <Button
          onClick={() => {
            setSessionInfo(null);
            setGameState("start");
          }}
        >
          pick a different game
        </Button>
      </HStack>
    </>
  );
};
