import { VStack, Heading, Box } from "@chakra-ui/react";
import { BudgetForm } from "./components/BudgetForm";
import { BudgetList } from "./components/BudgetList";
import { useBudget } from "./hooks/useBudget";
import { useDateFilter } from "@/context/DateFilterContext";

export function BudgetPage() {
  const { range } = useDateFilter();
  const month = range.from.toISOString().slice(0, 7);

  const { budget, loading } = useBudget(month);

  return (
    <VStack w="full" align="stretch" spacing={6} p={4}>
      <Heading size="md">Budgetten</Heading>

      <BudgetForm />

      <Box>
        <BudgetList budget={budget} loading={loading} />
      </Box>
    </VStack>
  );
}
