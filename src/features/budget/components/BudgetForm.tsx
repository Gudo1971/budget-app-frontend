import {
  Flex,
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

import { saveBudget, updateBudget } from "../api/budgetApi";
import { useBudget } from "../hooks/useBudget";

import { IconButton } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNeonColor } from "@/hooks/useNeonColor";

// ⭐ FIX: props typen
type BudgetFormProps = {
  month: string; // ⭐ maand komt van BudgetPage
  suggested: number | null;
  message: string;
  onUpdated: () => void | Promise<void>;
};

export function BudgetForm({
  month,
  suggested,
  message,
  onUpdated,
}: BudgetFormProps) {
  const navigate = useNavigate();

  const toast = useToast();

  const { budget, refetch } = useBudget(month);

  // ⭐ Startwaarde bepalen
  const initialValue =
    budget?.total_budget ??
    (suggested !== null && suggested !== undefined ? suggested : 0);

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  // Sync wanneer budget of suggested verandert
  useEffect(() => {
    if (budget?.total_budget != null) {
      setValue(budget.total_budget);
    } else if (suggested != null) {
      setValue(suggested);
    }
  }, [budget, suggested]);

  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");
  const neon = useNeonColor(month);

  const handleSave = async () => {
    try {
      setLoading(true);

      if (budget) {
        await updateBudget(month, value);
      } else {
        await saveBudget({
          month,
          total_budget: value,
        });
      }

      toast({
        title: "Budget opgeslagen",
        status: "success",
        duration: 2000,
      });

      await onUpdated(); // ⭐ UI update direct
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
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.400">
            Stel je maandbudget in
          </Text>

          <IconButton
            aria-label="Instellingen"
            icon={<FiSettings />}
            variant="ghost"
            size="sm"
            onClick={() => navigate("/budget/settings")}
            _hover={{ color: neon.color }}
          />
        </Flex>

        {message && (
          <Text fontSize="sm" color="gray.400">
            {message}
          </Text>
        )}

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
