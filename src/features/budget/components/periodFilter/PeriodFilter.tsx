import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";

type Props = {
  onChange: (from: string, to: string) => void;
};

export function PeriodFilter({ onChange }: Props) {
  const selectMonth = (year: number, month: number) => {
    const from = dayjs()
      .year(year)
      .month(month)
      .startOf("month")
      .format("YYYY-MM-DD");
    const to = dayjs()
      .year(year)
      .month(month)
      .endOf("month")
      .format("YYYY-MM-DD");

    onChange(from, to);
  };

  return (
    <Box display="flex" gap={2}>
      <Button onClick={() => selectMonth(2025, 0)}>Januari</Button>
      <Button onClick={() => selectMonth(2025, 1)}>Februari</Button>
      <Button onClick={() => selectMonth(2025, 2)}>Maart</Button>
    </Box>
  );
}
