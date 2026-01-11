import { Box, Button, useColorMode } from "@chakra-ui/react";

export default function TestColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === "dark" ? "gray.900" : "gray.100"}
      color={colorMode === "dark" ? "white" : "black"}
      minH="100vh"
      p={8}
    >
      <h1>Actieve modus: {colorMode}</h1>
      <Button onClick={toggleColorMode}>Toggle</Button>
    </Box>
  );
}
