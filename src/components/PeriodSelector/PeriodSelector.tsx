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
  const { range, mode } = useDateFilter();
  const navigate = useNavigate();

  // Afgeleide waarden uit DateFilterContext
  const selectedYear = range.from.getFullYear();
  const selectedMonth = range.from.getMonth() + 1;

  // Weeknummer bepalen uit range.from
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

  // UI‑state voor multi‑select (GEEN filtering)
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

  // Kleuren
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const containerBg = useColorModeValue("gray.100", "gray.800");
  const containerBorder = useColorModeValue("gray.300", "gray.600");
  const multiBg = useColorModeValue("blue.100", "blue.700");
  const multiBgHover = useColorModeValue("blue.200", "blue.600");
  const normalHover = useColorModeValue("gray.200", "gray.700");

  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeBorder = useColorModeValue("blue.300", "blue.600");
  const activeText = useColorModeValue("blue.600", "blue.300");

  const getMonthsLabel = () => {
    if (multiMonths.length > 0) {
      const names = [
        "Jan",
        "Feb",
        "Mrt",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ];
      return `Maanden: ${multiMonths.map((m) => names[Number(m) - 1]).join(", ")}`;
    }
    return `Maand: ${["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"][selectedMonth - 1]}`;
  };

  const getDaysLabel = () => {
    if (multiDays.length > 0) {
      const names = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
      return `Dagen: ${multiDays.map((d) => names[Number(d)]).join(", ")}`;
    }
    return "Dag: Alle";
  };

  const getActiveMulti = () => {
    if (multiMode === "year") return multiYears;
    if (multiMode === "month") return multiMonths;
    if (multiMode === "week") return multiWeeks;
    if (multiMode === "day") return multiDays;
    return [];
  };

  const handleApply = (values: (string | number)[]) => {
    if (multiMode === "year") setMultiYears(values);
    if (multiMode === "month") setMultiMonths(values);
    if (multiMode === "week") setMultiWeeks(values);
    if (multiMode === "day") setMultiDays(values);
    setMultiMode(null);
  };

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
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
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
                navigate(
                  `/transactions?from=${from.toISOString()}&to=${to.toISOString()}`,
                );
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
              {getMonthsLabel()}
            </Flex>

            <Box
              as="span"
              cursor="pointer"
              p={1}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
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
                const r = getRangeForMonth(selectedYear, month);
                const from = new Date(r.from);
                const to = new Date(r.to);
                navigate(
                  `/transactions?from=${from.toISOString()}&to=${to.toISOString()}`,
                );
              }}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* WEEK */}
        <AccordionItem>
          <AccordionButton
            bg={
              mode === "week"
                ? activeBg
                : multiWeeks.length > 0
                  ? multiBg
                  : undefined
            }
            borderLeft={
              mode === "week" ? `3px solid ${activeBorder}` : undefined
            }
            _hover={{
              bg:
                mode === "week"
                  ? activeBg
                  : multiWeeks.length > 0
                    ? multiBgHover
                    : normalHover,
            }}
          >
            <Flex
              flex="1"
              textAlign="left"
              fontWeight="bold"
              color={mode === "week" ? activeText : undefined}
            >
              {multiWeeks.length > 0
                ? `Weken: ${multiWeeks.join(", ")}`
                : `Week: ${selectedWeek}`}
            </Flex>

            <Box
              as="span"
              cursor="pointer"
              p={1}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                if (multiWeeks.length === 0) setMultiWeeks([selectedWeek]);
                setMultiMode("week");
              }}
            >
              <Icon
                as={FunnelSettingsIcon}
                boxSize={4}
                color={mode === "week" ? activeText : iconColor}
              />
            </Box>

            <ChevronDownIcon color={mode === "week" ? activeText : iconColor} />
          </AccordionButton>

          <AccordionPanel>
            <WeekList
              year={selectedYear}
              month={selectedMonth}
              selectedWeek={selectedWeek}
              multiSelected={multiWeeks}
              onSelect={(week) => {
                const r = getRangeForWeek(selectedYear, week);
                const from = new Date(r.from);
                const to = new Date(r.to);
                navigate(
                  `/transactions?from=${from.toISOString()}&to=${to.toISOString()}`,
                );
              }}
              onOpenFilter={(week) => {
                setSelectedWeekForDayFilter(week.weekNumber);
                setMultiMode("day");
              }}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* DAY */}
        <AccordionItem>
          <AccordionButton
            bg={
              mode === "day"
                ? activeBg
                : multiDays.length > 0
                  ? multiBg
                  : undefined
            }
            borderLeft={
              mode === "day" ? `3px solid ${activeBorder}` : undefined
            }
            _hover={{
              bg:
                mode === "day"
                  ? activeBg
                  : multiDays.length > 0
                    ? multiBgHover
                    : normalHover,
            }}
          >
            <Flex
              flex="1"
              textAlign="left"
              fontWeight="bold"
              color={mode === "day" ? activeText : undefined}
            >
              {getDaysLabel()}
            </Flex>

            <Box
              as="span"
              cursor="pointer"
              p={1}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                if (multiDays.length === 0) setMultiDays([]);
                setMultiMode("day");
                setSelectedWeekForDayFilter(selectedWeek);
              }}
            >
              <Icon
                as={FunnelSettingsIcon}
                boxSize={4}
                color={mode === "day" ? activeText : iconColor}
              />
            </Box>

            <ChevronDownIcon color={mode === "day" ? activeText : iconColor} />
          </AccordionButton>

          <AccordionPanel>
            <DayList
              weekNumber={selectedWeek}
              selectedDays={[]}
              multiSelected={multiDays}
              onSelect={(day) => {
                const date = new Date(range.from);
                date.setDate(date.getDate() - date.getDay() + day);
                navigate(
                  `/transactions?from=${date.toISOString()}&to=${date.toISOString()}`,
                );
              }}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {multiMode && (
        <MultiSelectOverlay
          multiMode={multiMode}
          currentYear={selectedYear}
          selectedMultiValues={getActiveMulti()}
          setSelectedMultiValues={(values) => {
            if (multiMode === "year") setMultiYears(values);
            if (multiMode === "month") setMultiMonths(values);
            if (multiMode === "week") setMultiWeeks(values);
            if (multiMode === "day") setMultiDays(values);
          }}
          onApply={handleApply}
          onClose={() => setMultiMode(null)}
          selectedWeekForDayFilter={selectedWeekForDayFilter}
        />
      )}
    </Box>
  );
}
