import { VStack, Box, Text, Flex } from "@chakra-ui/react";
import { CardWrapper } from "../ui/CardWrapper";
import { DonutChart } from "../charts/DonutChart";
import { SectionHeader } from "../ui/SectionHeader";
import { generateRealisticInsight } from "../../lib/ai/realisticInsights";
import { SubSectionHeader } from "../ui/SubSectionHeader";

export type TransactionAnalysisCardProps = {
  total: number;
  categories: Record<string, number>;
  transactions: { category: string }[];
  stressScore: number;
  sortedCategories: [string, number][];
  budget: number;
  spent: number;
  daysPassed: number;
  daysInPeriod: number;
};

export const TransactionAnalysisCard = (
  props: TransactionAnalysisCardProps
) => {
  const {
    total,
    categories,
    transactions,
    sortedCategories,
    budget,
    spent,
    daysPassed,
    daysInPeriod,
  } = props;

  const insight = generateRealisticInsight({
    sortedCategories,
    budget,
    spent,
    daysPassed,
    daysInPeriod,
  });

  return (
    <CardWrapper>
      <VStack align="start" spacing={4} w="full">
        {/* Hoofdheader */}
        <SectionHeader
          label="Transactie-analyse"
          info="Dit inzicht helpt je begrijpen hoe jouw uitgaven verdeeld zijn over categorieën en welke uitgaven het zwaarst wegen in je maandbudget."
        />

        {/* Grijze subcontainer */}
        <Box
          w="full"
          bg="gray.900"
          borderRadius="md"
          px={4}
          py={3}
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          {/* Insight tekst */}
          <Text fontSize="sm" color="gray.300" mb={3}>
            {insight}
          </Text>

          {/* Subheader + info ballon */}
          <SubSectionHeader
            label="Uitgavenverdeling"
            info="Deze grafiek laat zien hoe jouw uitgaven verdeeld zijn over categorieën. Het percentage toont welk deel van je totale uitgaven naar een categorie ging. Dit helpt je snel zien welke categorieën het zwaarst wegen in je maandelijkse uitgaven."
          />

          {/* Donut chart */}
          <Box w="full" mt={3}>
            <DonutChart
              total={total}
              categories={categories}
              transactions={transactions}
            />
          </Box>
        </Box>
      </VStack>
    </CardWrapper>
  );
};
