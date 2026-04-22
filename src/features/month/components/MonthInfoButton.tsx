import { Tooltip, IconButton, HStack, Box, Text } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export function MonthInfoButton() {
  return (
    <Tooltip
      hasArrow
      bg="gray.800"
      color="white"
      p={3}
      borderRadius="md"
      label={
        <HStack spacing={4}>
          <HStack>
            <Box w="8px" h="8px" bg="purple.300" borderRadius="full" />
            <Text fontSize="xs">Budget</Text>
          </HStack>

          <HStack>
            <Box w="8px" h="8px" bg="cyan.300" borderRadius="full" />
            <Text fontSize="xs">Transacties</Text>
          </HStack>

          <HStack>
            <Box w="8px" h="8px" bg="green.300" borderRadius="full" />
            <Text fontSize="xs">Income</Text>
          </HStack>
        </HStack>
      }
    >
      <IconButton
        aria-label="Info"
        icon={<InfoOutlineIcon />}
        size="xs"
        variant="ghost"
        color="gray.400"
        _hover={{ color: "white" }}
      />
    </Tooltip>
  );
}
