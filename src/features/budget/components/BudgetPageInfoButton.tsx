import {
  Tooltip,
  IconButton,
  VStack,
  HStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export function BudgetPageInfoButton() {
  return (
    <Tooltip
      hasArrow
      bg="gray.900"
      color="white"
      p={4}
      borderRadius="md"
      maxW="260px"
      placement="left-start"
      label={
        <VStack align="start" spacing={3}>
          <Text fontSize="sm" fontWeight="bold">
            Uitleg Budgetten
          </Text>

          {/* ⭐ Bullets netjes onder elkaar */}
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.300">
              • Stel per maand een budget in
            </Text>
            <Text fontSize="xs" color="gray.300">
              • Kopieer eenvoudig het budget van vorige maand
            </Text>
            <Text fontSize="xs" color="gray.300">
              • Bekijk je huidig budget en resterende ruimte
            </Text>
            <Text fontSize="xs" color="gray.300">
              • Gebruik de maandselector om snel te wisselen
            </Text>
          </VStack>

          {/* ⭐ Marker uitleg */}
          <VStack align="start" spacing={1} pt={1}>
            <HStack>
              <Box w="8px" h="8px" bg="purple.300" borderRadius="full" />
              <Text fontSize="xs">Budget ingesteld</Text>
            </HStack>

            <HStack>
              <Box w="8px" h="8px" bg="cyan.300" borderRadius="full" />
              <Text fontSize="xs">Transacties aanwezig</Text>
            </HStack>

            <HStack>
              <Box w="8px" h="8px" bg="green.300" borderRadius="full" />
              <Text fontSize="xs">Inkomsten ontvangen</Text>
            </HStack>
          </VStack>
        </VStack>
      }
    >
      <IconButton
        aria-label="Info"
        icon={<InfoOutlineIcon />}
        size="sm"
        variant="ghost"
        color="gray.400"
        _hover={{ color: "white" }}
      />
    </Tooltip>
  );
}
