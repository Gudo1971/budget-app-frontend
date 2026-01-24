import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FunnelSettingsIcon } from "../../funnel-settings/FunnelSettingsIcon";

import type { WeekInfo } from "@shared/types/period";
import type { WeekListProps } from "../types/periodSelector";

// TEMP: placeholder weeks until dateRanges.ts is ready
function getPlaceholderWeeks(year: number, month: number): WeekInfo[] {
  return [
    { weekNumber: 1, from: `${year}-${month}-01`, to: `${year}-${month}-07` },
    { weekNumber: 2, from: `${year}-${month}-08`, to: `${year}-${month}-14` },
    { weekNumber: 3, from: `${year}-${month}-15`, to: `${year}-${month}-21` },
    { weekNumber: 4, from: `${year}-${month}-22`, to: `${year}-${month}-28` },
    { weekNumber: 5, from: `${year}-${month}-29`, to: `${year}-${month}-31` },
  ];
}

export function WeekList({
  year,
  month,
  selectedWeek,
  multiSelected = [],
  onSelect,
  onOpenFilter,
}: WeekListProps) {
  const weeks = getPlaceholderWeeks(year, month);

  // Dark‑mode aware kleuren
  const bgNormal = useColorModeValue("gray.100", "gray.700");
  const bgHover = useColorModeValue("gray.200", "gray.600");
  const textNormal = useColorModeValue("black", "gray.100");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const bgMulti = useColorModeValue("blue.200", "blue.600");
  const bgMultiHover = useColorModeValue("blue.300", "blue.500");

  return (
    <VStack align="stretch" spacing={1}>
      {weeks.map((week) => {
        const isSelected = week.weekNumber === selectedWeek;
        const isMulti = multiSelected.includes(week.weekNumber);

        return (
          <Flex
            key={week.weekNumber}
            p={2}
            borderRadius="md"
            cursor="pointer"
            align="center"
            justify="space-between"
            bg={isSelected ? "blue.500" : isMulti ? bgMulti : bgNormal}
            color={isSelected ? "white" : textNormal}
            _hover={{
              bg: isSelected ? "blue.600" : isMulti ? bgMultiHover : bgHover,
            }}
            onClick={() => onSelect(week.weekNumber)}
          >
            <Box>
              <Text
                fontWeight={
                  isSelected ? "bold" : isMulti ? "semibold" : "normal"
                }
              >
                Week {week.weekNumber}
              </Text>
              <Text fontSize="sm" opacity={0.8}>
                {week.from} – {week.to}
              </Text>
            </Box>

            <IconButton
              aria-label="Filter days"
              icon={<FunnelSettingsIcon />}
              size="sm"
              variant="ghost"
              color={isSelected ? "white" : iconColor}
              _hover={{ bg: "transparent" }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenFilter?.(week);
              }}
            />
          </Flex>
        );
      })}
    </VStack>
  );
}
