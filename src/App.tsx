import { VStack } from "@chakra-ui/react";
import { Game } from "./Game";

export const App = () => (
  <VStack gap="24px" margin="12px auto" maxWidth="640px" padding="24px">
    <Game />
  </VStack>
);
