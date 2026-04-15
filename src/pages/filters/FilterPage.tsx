import { Box } from "@chakra-ui/react";
import { PeriodSelector } from "../../components/PeriodSelector/PeriodSelector";
import { useState } from "react";
import type { PeriodSelection } from "@shared/types/period";

export default function FilterPage() {
  const [period, setPeriod] = useState<PeriodSelection | null>(null);

  return (
    <Box p={4}>
      <PeriodSelector
        onChange={(newPeriod: PeriodSelection) => setPeriod(newPeriod)}
      />
    </Box>
  );
}
