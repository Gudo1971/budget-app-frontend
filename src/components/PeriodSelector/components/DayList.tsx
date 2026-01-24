import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";

type DayListProps = {
  weekNumber: number;
  selectedDays: (string | number)[];
  multiSelected?: (string | number)[];
  onSelect: (day: number) => void;
};

const DAYS = [
  { day: 0, label: "Zondag" },
  { day: 1, label: "Maandag" },
  { day: 2, label: "Dinsdag" },
  { day: 3, label: "Woensdag" },
  { day: 4, label: "Donderdag" },
  { day: 5, label: "Vrijdag" },
  { day: 6, label: "Zaterdag" },
];

export function DayList({
  weekNumber,
  selectedDays,
  multiSelected = [],
  onSelect,
}: DayListProps) {
  const bgNormal = useColorModeValue("gray.100", "gray.700");
  const bgHover = useColorModeValue("gray.200", "gray.600");
  const textNormal = useColorModeValue("black", "gray.100");
  const bgMulti = useColorModeValue("blue.200", "blue.600");
  const bgMultiHover = useColorModeValue("blue.300", "blue.500");

  return (
    <VStack align="stretch" spacing={1}>
      {DAYS.map(({ day, label }) => {
        const isSelected = selectedDays.includes(day);
        const isMulti = multiSelected.includes(day);

        return (
          <Box
            key={day}
            p={2}
            borderRadius="md"
            cursor="pointer"
            bg={isSelected ? "blue.500" : isMulti ? bgMulti : bgNormal}
            color={isSelected ? "white" : textNormal}
            _hover={{
              bg: isSelected ? "blue.600" : isMulti ? bgMultiHover : bgHover,
            }}
            onClick={() => onSelect(day)}
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
