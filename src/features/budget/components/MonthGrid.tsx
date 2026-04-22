import { Box, SimpleGrid, Button } from "@chakra-ui/react";

export interface MonthGridProps {
  selectedYear: number;
  selectedMonth: number;
  onSelect: (year: number, month: number) => void;
}

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export function MonthGrid({
  selectedYear,
  selectedMonth,
  onSelect,
}: MonthGridProps) {
  return (
    <Box>
      <SimpleGrid columns={7} spacing={2} mb={4}>
        {years.map((y) => (
          <Button
            key={y}
            size="sm"
            variant={y === selectedYear ? "solid" : "outline"}
            onClick={() => onSelect(y, selectedMonth)}
          >
            {y}
          </Button>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={12} spacing={2}>
        {months.map((m, i) => (
          <Button
            key={m}
            size="sm"
            variant={i + 1 === selectedMonth ? "solid" : "outline"}
            onClick={() => onSelect(selectedYear, i + 1)}
          >
            {m}
          </Button>
        ))}
      </SimpleGrid>
    </Box>
  );
}
