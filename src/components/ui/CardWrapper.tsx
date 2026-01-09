import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const CardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      w="100%"
      maxW="500px"
      bg="gray.800"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      mx="auto"
      display="flex"
      flexDirection="column"
      gap={4}
      overflow="hidden" // ⭐ FIX: hoeken blijven rond, inhoud blijft binnen de kaart
    >
      {children}
    </Box>
  );
};
