import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { YearListProps } from "../types/periodSelector";

export function YearList({
  selectedYear,
  multiSelected = [],
  onSelect,
  years,
}: YearListProps) {
  const currentYear = new Date().getFullYear();
  const defaultYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const yearOptions = years ?? defaultYears;

  // Dark‑mode aware kleuren
  const bgNormal = useColorModeValue("gray.100", "gray.700");
  const bgHover = useColorModeValue("gray.200", "gray.600");
  const textNormal = useColorModeValue("black", "gray.100");
  const bgMulti = useColorModeValue("blue.200", "blue.600");
  const bgMultiHover = useColorModeValue("blue.300", "blue.500");

  return (
    <VStack align="stretch" spacing={1}>
      {yearOptions.map((year) => {
        const isSelected = year === selectedYear;
        const isMulti = multiSelected.includes(year);

        return (
          <Box
            key={year}
            p={2}
            borderRadius="md"
            cursor="pointer"
            bg={isSelected ? "blue.500" : isMulti ? bgMulti : bgNormal}
            color={isSelected ? "white" : textNormal}
            _hover={{
              bg: isSelected ? "blue.600" : isMulti ? bgMultiHover : bgHover,
            }}
            onClick={() => onSelect(year)}
          >
            <Text
              fontWeight={isSelected ? "bold" : isMulti ? "semibold" : "normal"}
            >
              {year}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
}
