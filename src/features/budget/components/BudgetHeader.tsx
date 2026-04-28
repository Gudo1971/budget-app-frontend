import { HStack, Text, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Props {
  year: string | undefined;
  month: string | undefined;
  neon?: { color: string };
  onNavigate: (y: string, m: string) => void;
}

export function BudgetHeader({ year, month, neon, onNavigate }: Props) {
  const y = Number(year);
  const m = Number(month);

  const prev = () => {
    const newMonth = m - 1;
    if (newMonth < 1) onNavigate(String(y - 1), "12");
    else onNavigate(String(y), String(newMonth));
  };

  const next = () => {
    const newMonth = m + 1;
    if (newMonth > 12) onNavigate(String(y + 1), "1");
    else onNavigate(String(y), String(newMonth));
  };

  return (
    <HStack justify="space-between" w="100%">
      <IconButton
        aria-label="Vorige maand"
        icon={<ChevronLeftIcon />}
        onClick={prev}
        variant="ghost"
      />

      <Text fontSize="xl" fontWeight="bold" color={neon?.color ?? "gray.200"}>
        {year}-{month?.padStart(2, "0")}
      </Text>

      <IconButton
        aria-label="Volgende maand"
        icon={<ChevronRightIcon />}
        onClick={next}
        variant="ghost"
      />
    </HStack>
  );
}
