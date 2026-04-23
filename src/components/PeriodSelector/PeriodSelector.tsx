import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

import { YearList } from "./components/YearList";
import { MonthList } from "./components/MonthList";
import { WeekList } from "./components/WeekList";
import { DayList } from "./components/DayList";
import { MultiSelectOverlay } from "./components/MultiSelectOverlay";

import { getRangeForMonth, getRangeForWeek } from "../../utils/dateRanges";
import { FunnelSettingsIcon } from "../funnel-settings/FunnelSettingsIcon";

import { useDateFilter } from "@/context/DateFilterContext";
import { useNavigate } from "react-router-dom";

export function PeriodSelector() {
  const { range, mode, setRange } = useDateFilter();
  const navigate = useNavigate();

  // ⭐ ALLES werkt met Date-objecten
  const selectedYear = range.from.getFullYear();
  const selectedMonth = range.from.getMonth() + 1;

  // ⭐ Weeknummer bepalen
  const selectedWeek = (() => {
    const date = range.from;
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((temp.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7,
      )
    );
  })();

  // ⭐ Multi-select UI state (heeft GEEN invloed op filtering)
  const [multiYears, setMultiYears] = useState<(string | number)[]>([]);
  const [multiMonths, setMultiMonths] = useState<(string | number)[]>([]);
  const [multiWeeks, setMultiWeeks] = useState<(string | number)[]>([]);
  const [multiDays, setMultiDays] = useState<(string | number)[]>([]);
  const [multiMode, setMultiMode] = useState<
    "year" | "month" | "week" | "day" | null
  >(null);

  const [selectedWeekForDayFilter, setSelectedWeekForDayFilter] = useState<
    number | null
  >(null);

  // ⭐ Kleuren
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const containerBg = useColorModeValue("gray.100", "gray.800");
  const containerBorder = useColorModeValue("gray.300", "gray.600");
  const multiBg = useColorModeValue("blue.100", "blue.700");
  const multiBgHover = useColorModeValue("blue.200", "blue.600");
  const normalHover = useColorModeValue("gray.200", "gray.700");

  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeBorder = useColorModeValue("blue.300", "blue.600");
  const activeText = useColorModeValue("blue.600", "blue.300");

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={3}
      position="relative"
      bg={containerBg}
      borderColor={containerBorder}
    >
      <Accordion allowMultiple defaultIndex={[]}>
        {/* YEAR */}
        <AccordionItem>
          <AccordionButton
            bg={
              mode === "year"
                ? activeBg
                : multiYears.length > 0
                  ? multiBg
                  : undefined
            }
            borderLeft={
              mode === "year" ? `3px solid ${activeBorder}` : undefined
            }
            _hover={{
              bg:
                mode === "year"
                  ? activeBg
                  : multiYears.length > 0
                    ? multiBgHover
                    : normalHover,
            }}
          >
            <Flex
              flex="1"
              textAlign="left"
              fontWeight="bold"
              color={mode === "year" ? activeText : undefined}
            >
              {multiYears.length > 0
                ? `Jaren: ${multiYears.join(", ")}`
                : `Jaar: ${selectedYear}`}
            </Flex>

            <Box
              as="span"
              cursor="pointer"
              p={1}
              onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                if (multiYears.length === 0) setMultiYears([selectedYear]);
                setMultiMode("year");
              }}
            >
              <Icon
                as={FunnelSettingsIcon}
                boxSize={4}
                color={mode === "year" ? activeText : iconColor}
              />
            </Box>

            <ChevronDownIcon color={mode === "year" ? activeText : iconColor} />
          </AccordionButton>

          <AccordionPanel>
            <YearList
              selectedYear={selectedYear}
              multiSelected={multiYears}
              onSelect={(year) => {
                const from = new Date(year, 0, 1);
                const to = new Date(year, 11, 31);
                setRange({ from, to });
              }}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* MONTH */}
        <AccordionItem>
          <AccordionButton
            bg={
              mode === "month"
                ? activeBg
                : multiMonths.length > 0
                  ? multiBg
                  : undefined
            }
            borderLeft={
              mode === "month" ? `3px solid ${activeBorder}` : undefined
            }
            _hover={{
              bg:
                mode === "month"
                  ? activeBg
                  : multiMonths.length > 0
                    ? multiBgHover
                    : normalHover,
            }}
          >
            <Flex
              flex="1"
              textAlign="left"
              fontWeight="bold"
              color={mode === "month" ? activeText : undefined}
            >
              {multiMonths.length > 0
                ? `Maanden: ${multiMonths.join(", ")}`
                : `Maand: ${selectedMonth}`}
            </Flex>

            <Box
              as="span"
              cursor="pointer"
              p={1}
              onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                if (multiMonths.length === 0) setMultiMonths([selectedMonth]);
                setMultiMode("month");
              }}
            >
              <Icon
                as={FunnelSettingsIcon}
                boxSize={4}
                color={mode === "month" ? activeText : iconColor}
              />
            </Box>

            <ChevronDownIcon
              color={mode === "month" ? activeText : iconColor}
            />
          </AccordionButton>

          <AccordionPanel>
            <MonthList
              year={selectedYear}
              selectedMonth={selectedMonth}
              multiSelected={multiMonths}
              onSelect={(month) => {
                const from = new Date(selectedYear, month - 1, 1);
                const to = new Date(selectedYear, month, 0);
                setRange({ from, to });
              }}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
