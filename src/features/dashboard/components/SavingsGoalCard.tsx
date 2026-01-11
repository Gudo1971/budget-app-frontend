import { VStack, Heading, Text } from "@chakra-ui/react";
import { CardWrapper } from "../../../components/ui/CardWrapper";

export function SavingsGoalCard() {
  return (
    <CardWrapper>
      <VStack align="start" spacing={3}>
        <Heading size="sm">Spaardoel</Heading>
        <Text fontSize="sm" color="gray.600">
          Later kun je hier een spaardoel instellen en slimme inzichten krijgen.
        </Text>
      </VStack>
    </CardWrapper>
  );
}
