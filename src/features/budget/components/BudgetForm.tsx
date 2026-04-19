import {
  Box,
  VStack,
  Text,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { saveBudget } from "../api/budgetApi";
import { useBudget } from "../hooks/useBudget";
import { useDateFilter } from "@/context/DateFilterContext";

import { useNeonColor } from "@/hooks/useNeonColor";

export function BudgetForm() {
  const toast = useToast();
  const { range } = useDateFilter();
  const month = range.from.toISOString().slice(0, 7);

  const { budget, refetch } = useBudget(month);

  const [value, setValue] = useState(budget?.amount ?? 0);
  const [loading, setLoading] = useState(false);

  // Sync value when budget loads
  useEffect(() => {
    if (budget?.amount != null) {
      setValue(budget.amount);
    }
  }, [budget]);

  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  // Dynamische neon kleur op basis van maand
  const neon = useNeonColor(month);

  const handleSave = async () => {
    try {
      setLoading(true);

      await saveBudget({
        amount: value,
        month,
        userId: "demo-user",
      });

      toast({
        title: "Budget opgeslagen",
        status: "success",
        duration: 2000,
      });

      refetch();
    } catch (err) {
      toast({
        title: "Opslaan mislukt",
        status: "error",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={5}
      borderRadius="lg"
      bg={bg}
      border="1px solid"
      borderColor={border}
      backdropFilter="blur(8px)"
      boxShadow={`0 0 25px ${neon.glow}`}
      transition="0.25s ease"
      _hover={{
        transform: "scale(1.01)",
        boxShadow: `0 0 35px ${neon.glow}`,
      }}
    >
      <VStack align="stretch" spacing={3}>
        <Text fontSize="sm" color="gray.400">
          Stel je maandbudget in
        </Text>

        <NumberInput
          value={value}
          onChange={(v) => setValue(Number(v))}
          min={0}
          precision={2}
        >
          <NumberInputField
            placeholder="Bijv. 3000"
            fontSize="lg"
            fontWeight="bold"
            borderColor={neon.color}
            _focus={{
              borderColor: neon.color,
              boxShadow: `0 0 15px ${neon.glow}`,
            }}
          />
        </NumberInput>

        <Button
          onClick={handleSave}
          isLoading={loading}
          size="md"
          borderRadius="md"
          bg={neon.color}
          color="white"
          _hover={{
            bg: neon.color,
            boxShadow: `0 0 20px ${neon.glow}`,
            transform: "scale(1.02)",
          }}
          transition="0.2s ease"
        >
          Opslaan
        </Button>
      </VStack>
    </Box>
  );
}
