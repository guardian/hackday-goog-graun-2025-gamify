import { useState } from "react";
import {
  Button,
  Card,
  Input,
  VStack,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";

// Globally styling components with Chakra seems finicky, so doing this
const commonCardProps = {
  border: "1px",
  borderColor: "gray.400",
  marginX: "12px",
  shadow: "lg",
};

const fakeResponses = [
  "Your are an intrepid reporter investigating data. What will you do?",
  "Excellent! What will you do next?",
  "That`s brilliant! And then?",
  "Truly terrific. This is definitely going somewhere...",
];

let responsePosition = 0;

const getResponse = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 500 + 1500 * Math.random());
  });
  const response = fakeResponses[++responsePosition] ?? fakeResponses.at(-1);
  return response;
};

type History = {
  value: string;
  type: "command" | "response";
}[];

const initialHistory: History = [
  {
    value: fakeResponses[0],
    type: "response",
  },
];

function App() {
  const [history, setHistory] = useState(initialHistory);
  const [pendingCommand, setPendingCommand] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <VStack gap="24px" margin="12px auto" maxWidth="640px">
      <Card.Root {...commonCardProps}>
        <Card.Body>
          <VStack gap="1rem">
            {history.map((entry, index) => (
              <Text
                key={index}
                {...(entry.type === "command" && {
                  fontStyle: "italic",
                  opacity: 0.5,
                })}
              >
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

                const response = await getResponse();

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
                <Button
                  minWidth={"120px"}
                  disabled={!pendingCommand || submitting}
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
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}

export default App;
