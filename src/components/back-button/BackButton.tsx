import { Flex, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <Flex
      align="center"
      gap={2}
      mb={2}
      cursor="pointer"
      onClick={() => navigate(-1)}
      _hover={{
        transform: "translateX(-2px)",
        color: "blue.300",
      }}
      transition="all 0.18s ease"
      w="fit-content"
      userSelect="none"
    >
      <ArrowBackIcon boxSize={5} />
      <Text fontSize="md" fontWeight="medium">
        Terug
      </Text>
    </Flex>
  );
}
