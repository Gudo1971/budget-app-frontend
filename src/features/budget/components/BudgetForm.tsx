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
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

import { saveBudget, updateBudget } from "../api/budgetApi";
import { useBudget } from "../hooks/useBudget";

import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNeonColor } from "@/hooks/useNeonColor";

type BudgetFormProps = {
  month: string;
  suggested: number | null;
  message: string;
  onUpdated: () => void | Promise<void>;
  isSaved: boolean;
  onRequireSave: () => void;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
  remaining: number; // ⭐ UI‑remaining komt hier binnen
  totalExpenses: number;
};

export function BudgetForm({
  month,
  suggested,
  message,
  onUpdated,
  isSaved,
  onRequireSave,
  remaining, // ⭐ UI‑remaining
  totalExpenses,
}: BudgetFormProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const { budget } = useBudget(month);

  const inputRef = useRef<HTMLInputElement>(null);

  const hasBudget =
    budget &&
    typeof budget.total_budget === "number" &&
    budget.total_budget > 0;

  const initialValue = hasBudget ? budget.total_budget : (suggested ?? 0);

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  // ⭐ Belangrijk: we bewaren UI‑remaining lokaal
  const [localRemaining, setLocalRemaining] = useState(remaining);
  useEffect(() => {
    setLocalRemaining(value - totalExpenses); // ⭐ dynamisch herberekenen
  }, [value, totalExpenses]);

  // ⭐ Wanneer UI‑remaining verandert → update localRemaining
  useEffect(() => {
    setLocalRemaining(remaining);
  }, [remaining]);

  const isSuggested = !hasBudget;

  useEffect(() => {
    if (hasBudget) {
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

      // ⭐ We sturen ALTIJD localRemaining mee
      if (hasBudget) {
        await updateBudget(month, {
          total_budget: value,
          remaining: localRemaining,
        });
      } else {
        await saveBudget({
          month,
          total_budget: value,
          remaining: localRemaining,
        });
      }

      toast({
        title: "Budget opgeslagen",
        status: "success",
        duration: 2000,
      });

      await onUpdated();
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
      minH="140px"
      _hover={{
        transform: "scale(1.01)",
        boxShadow: `0 0 35px ${neon.glow}`,
      }}
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="flex-start" w="100%">
          <VStack align="flex-start" spacing={0} flex="1">
            <Text fontSize="sm" color="gray.400">
              Stel je maandbudget in
            </Text>

            {suggested !== null && suggested > 0 && !hasBudget && (
              <Text fontSize="xs" color="orange.300" mt={1} lineHeight="1.2">
                Slim voorstel: €{suggested.toFixed(2)}
              </Text>
            )}
          </VStack>

          <IconButton
            icon={<FiSettings />}
            aria-label="Instellingen"
            variant="ghost"
            color="gray.300"
            onClick={() => {
              if (!isSaved) {
                onRequireSave();
                return;
              }
              navigate("/budget/settings");
            }}
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
            ref={inputRef}
            placeholder="Bijv. 3000"
            fontSize="lg"
            fontWeight="bold"
            color={isSuggested ? "gray.400" : "white"}
            borderColor={isSuggested ? "orange.300" : neon.color}
            _focus={{
              borderColor: neon.color,
              boxShadow: `0 0 15px ${neon.glow}`,
              color: "white",
            }}
          />
        </NumberInput>

        {!hasBudget && (
          <Text fontSize="xs" color="orange.300">
            Dit is een voorgesteld bedrag. Sla op om te bevestigen.
          </Text>
        )}

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
