import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export default function Layout() {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
      <Header />

      <Box py={10}>
        <Container maxW="container.md">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
