import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { MonthListProps, MONTHS } from "../types/periodSelector";

export function MonthList({
  year,
  selectedMonth,
  multiSelected = [],
  onSelect,
}: MonthListProps) {
  const bgNormal = useColorModeValue("gray.100", "gray.700");
  const bgHover = useColorModeValue("gray.200", "gray.600");
  const textNormal = useColorModeValue("black", "gray.100");
  const bgMulti = useColorModeValue("blue.200", "blue.600");
  const bgMultiHover = useColorModeValue("blue.300", "blue.500");

  return (
    <VStack align="stretch" spacing={1}>
      {MONTHS.map(({ month, label }) => {
        const isSelected = month === selectedMonth;
        const isMulti = multiSelected.includes(month);

        return (
          <Box
            key={month}
            p={2}
            borderRadius="md"
            cursor="pointer"
            bg={isSelected ? "blue.500" : isMulti ? bgMulti : bgNormal}
            color={isSelected ? "white" : textNormal}
            _hover={{
              bg: isSelected ? "blue.600" : isMulti ? bgMultiHover : bgHover,
            }}
            onClick={() => onSelect(month)}
          >
            <Text
              fontWeight={isSelected ? "bold" : isMulti ? "semibold" : "normal"}
            >
              {label}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
}
