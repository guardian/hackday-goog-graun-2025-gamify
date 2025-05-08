import { useState } from "react";
import { Button, Input, HStack, Text, Spinner } from "@chakra-ui/react";
import { startSession, sendCommand } from "./server";

// TODO: offer different initial prompt depending on which agent user is interacting with
const initialPrompt =
  "You are an intrepid reporter investigating data. What will you do?";

type GameState = "start" | "createSession" | "playing";

type History = {
  value: string;
  type: "command" | "response";
}[];

const initialHistory: History = [
  {
    value: initialPrompt,
    type: "response",
  },
];

const historyStyles = {
  command: {
    fontStyle: "italic",
    opacity: 0.5,
  },
  response: {
    whiteSpace: "pre-wrap",
  },
};

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState(initialHistory);
  const [pendingCommand, setPendingCommand] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (gameState === "start") {
    return (
      <>
        <Button
          onClick={async () => {
            setGameState("createSession");
            try {
              const response = await startSession();
              setSessionId(response.id);
              setGameState("playing");
            } catch (error) {
              console.error(error);
              setGameState("start");
              // TODO: toasts for errors?
            }
          }}
        >
          Start
        </Button>
      </>
    );
  }

  if (gameState === "createSession") {
    return <Spinner />;
  }

  return (
    <>
      {history.map((entry, index) => (
        <Text key={index} {...historyStyles[entry.type]}>
          {entry.value}
        </Text>
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

          if (!sessionId) {
            throw Error("No session id");
          }

          const response = await sendCommand(sessionId, pendingCommand);

          console.log(response);

          setSubmitting(false);
          setHistory((history) => [
            ...history,
            { value: response, type: "response" },
          ]);
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
          <Button minWidth={"120px"} disabled={!pendingCommand || submitting}>
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
    </>
  );
};
