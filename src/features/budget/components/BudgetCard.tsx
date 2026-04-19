import {
  Box,
  VStack,
  Text,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDateFilter } from "@/context/DateFilterContext";
import { useBudgetAmount } from "../hooks/useBudgetAmount";

import { useNeonColor } from "@/hooks/useNeonColor";

export function BudgetCard() {
  const navigate = useNavigate();
  const { range } = useDateFilter();
  const month = range.from.toISOString().slice(0, 7);

  const { amount: budget, loading } = useBudgetAmount(month);

  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  // Dynamische neon kleur op basis van maand
  const neon = useNeonColor(month);

  // Placeholder until transactions hook is ready
  const totalSpent = 2776;
  const leftover = budget ? budget - totalSpent : 0;

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg={bg}
      border="1px solid"
      borderColor={border}
      backdropFilter="blur(8px)"
      boxShadow={`0 0 25px ${neon.glow}`}
      cursor="pointer"
      onClick={() => navigate("/budget")}
      transition="0.25s ease"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: `0 0 35px ${neon.glow}`,
      }}
    >
      <VStack align="stretch" spacing={1}>
        <Text fontSize="sm" color="gray.400">
          Budget
        </Text>

        {loading ? (
          <Skeleton height="20px" />
        ) : (
          <Text
            fontSize="lg"
            fontWeight="bold"
            bgGradient={`linear(to-r, ${neon.text}, ${neon.color})`}
            bgClip="text"
          >
            €{totalSpent} van €{budget ?? 0}
          </Text>
        )}

        {!loading && (
          <Text fontSize="sm" color={leftover >= 0 ? neon.color : "red.300"}>
            {leftover >= 0
              ? `€${leftover} over`
              : `€${Math.abs(leftover)} overspent`}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
