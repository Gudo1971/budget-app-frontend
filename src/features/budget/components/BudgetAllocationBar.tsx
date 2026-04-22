import { Box, Tooltip, HStack } from "@chakra-ui/react";

interface Segment {
  label: string;
  amount: number;
  color: string;
}

interface Props {
  total: number;
  segments: Segment[];
}

export function BudgetAllocationBar({ total, segments }: Props) {
  return (
    <HStack
      w="full"
      h="14px"
      borderRadius="full"
      overflow="hidden"
      bg="rgba(255,255,255,0.08)"
      spacing={0}
    >
      {segments.map((seg) => {
        const pct = total > 0 ? (seg.amount / total) * 100 : 0;

        return (
          <Tooltip
            key={seg.label}
            label={`${seg.label}: €${seg.amount} (${pct.toFixed(1)}%)`}
            hasArrow
            bg="gray.800"
            color="white"
            borderRadius="md"
            p={2}
          >
            <Box
              h="full"
              w={`${pct}%`}
              bg={seg.color}
              transition="width 0.3s ease"
            />
          </Tooltip>
        );
      })}
    </HStack>
  );
}
