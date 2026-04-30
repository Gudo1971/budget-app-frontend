import { VStack, Box, Text } from "@chakra-ui/react";
import { CardWrapper } from "../../../components/ui/CardWrapper";
import { DonutChart } from "../../../components/charts/DonutChart";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { generateRealisticInsight } from "../../../lib/ai/realisticInsights";
import { SubSectionHeader } from "../../../components/ui/SubSectionHeader";
import { useEffect, useState } from "react";
import { useDateFilter } from "../../../context/DateFilterContext";
import { useCategories } from "@/features/categories/hooks/useCategories";

export type TransactionAnalysisCardProps = {
  total: number;
  categories: Record<string, number>;
  transactions: { category_id: number | null }[];
  stressScore: number;
  sortedCategories: [string, number][];
  budget: number;
  spent: number;
  daysPassed: number;
  daysInPeriod: number;
};

// ⭐ Type voor backend summary items
type SummaryItem = {
  category_id: number;
  name: string;
  total: number;
};

export const TransactionAnalysisCard = (
  props: TransactionAnalysisCardProps,
) => {
  const { sortedCategories, budget, spent, daysPassed, daysInPeriod } = props;

  const [summaryData, setSummaryData] = useState([]);
  const { range } = useDateFilter();

  // ⭐ Haal categorieën op (met kleur)
  const { categories } = useCategories();

  // ⭐ FETCH SUMMARY DATA
  useEffect(() => {
    async function load() {
      const API = import.meta.env.VITE_API_URL;

      const from = range.from.toISOString().slice(0, 10);
      const to = range.to.toISOString().slice(0, 10);

      const res = await fetch(
        `${API}/summary?userId=demo-user&from=${from}&to=${to}`,
      );

      const json = await res.json();

      if (!json.success || !json.data) {
        setSummaryData([]);
        return;
      }

      const mapped = json.data.map((item: SummaryItem) => ({
        name: item.name,
        value: Math.abs(item.total),
        category_id: item.category_id,
      }));

      setSummaryData(mapped);
    }

    load();
  }, [range]);

  const insight = generateRealisticInsight({
    sortedCategories,
    budget,
    spent,
    daysPassed,
    daysInPeriod,
  });

  const remaining = budget - spent;
  const spentPct = (spent / budget) * 100;

  return (
    <CardWrapper>
      <VStack align="start" spacing={4} w="full">
        <SectionHeader
          label="Transactie-analyse"
          info="Dit inzicht helpt je begrijpen hoe jouw uitgaven verdeeld zijn over categorieën en welke uitgaven het zwaarst wegen in je maandbudget."
        />

        <Box
          w="full"
          bg="gray.900"
          borderRadius="md"
          px={4}
          py={3}
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Text fontSize="sm" color="gray.300" mb={3}>
            {insight}
          </Text>

          <SubSectionHeader
            label="Uitgavenverdeling"
            info="Deze grafiek laat zien hoe jouw uitgaven verdeeld zijn over categorieën."
          />

          {/* ⭐ Donut chart */}
          <Box w="full" mt={3}>
            <DonutChart
              data={summaryData}
              categories={categories} // ⭐ FIX — voorkomt crash
            />
          </Box>

          {/* ⭐ Budget Progress Bar */}
          <Box mt={5}>
            <Text fontSize="sm" color="gray.400" mb={1}>
              Budgetvoortgang
            </Text>

            <Box
              w="full"
              h="10px"
              bg="gray.700"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="full"
                w={`${spentPct}%`}
                bg={
                  spentPct > 90
                    ? "red.400"
                    : spentPct > 60
                      ? "orange.400"
                      : "green.400"
                }
                transition="width 0.3s ease"
              />
            </Box>

            <Text fontSize="xs" color="gray.400" mt={1}>
              €{spent.toFixed(0)} van €{budget.toFixed(0)} uitgegeven €
              {remaining.toFixed(0)} over
            </Text>
          </Box>
        </Box>
      </VStack>
    </CardWrapper>
  );
};
