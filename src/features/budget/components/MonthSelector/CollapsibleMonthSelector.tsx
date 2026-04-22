import { useState } from "react";
import { Box, Button, Collapse } from "@chakra-ui/react";
import { MonthGrid } from "./MonthGrid";

interface Props {
  selectedMonth: string; // "YYYY-MM"
  onChange: (value: string) => void;
}

export function CollapsibleMonthSelector({ selectedMonth, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // "2026-04" → [2026, 4]
  const [year, month] = selectedMonth.split("-").map(Number);

  const handleSelect = (y: number, m: number) => {
    const formatted = `${y}-${String(m).padStart(2, "0")}`;
    onChange(formatted);
    setIsOpen(false);
  };

  return (
    <Box>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(!isOpen)}>
        Maand wijzigen {isOpen ? "▲" : "▼"}
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={3}
          p={4}
          borderRadius="lg"
          bg="gray.800"
          border="1px solid rgba(255,255,255,0.08)"
        >
          <MonthGrid
            selectedYear={year}
            selectedMonth={month}
            onSelect={handleSelect}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
