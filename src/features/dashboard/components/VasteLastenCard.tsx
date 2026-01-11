import { Text, VStack, Button } from "@chakra-ui/react";
import { CardWrapper } from "../../../components/ui/CardWrapper";

type InsightItem = {
  name: string;
  amount: number;
};

type VasteLastenCardProps = {
  totalPerMonth: number;
  insights: InsightItem[];
  onOpenOverview: () => void;
};

export function VasteLastenCard({
  totalPerMonth,
  insights,
  onOpenOverview,
}: VasteLastenCardProps) {
  return (
    <CardWrapper>
      <VStack spacing={3} flex="1" justify="center" align="start">
        <Text fontSize="lg" fontWeight="bold">
          Vaste lasten
        </Text>

        <Text fontSize="sm" color="gray.400">
          Totaal per maand: €{totalPerMonth.toFixed(2)}
        </Text>

        <VStack spacing={1} align="start">
          {insights.map((item) => (
            <Text key={item.name}>
              {item.name}: €{item.amount.toFixed(2)}
            </Text>
          ))}
        </VStack>

        <Button size="sm" mt={2} onClick={onOpenOverview}>
          Bekijk overzicht
        </Button>
      </VStack>
    </CardWrapper>
  );
}
