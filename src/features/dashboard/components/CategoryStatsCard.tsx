import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  HStack,
  Text,
  Box,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";

type CategoryStat = {
  id: number;
  name: string;
  amount: number;
  count: number;
};

type CategoryStatsCardProps = {
  stats: CategoryStat[];
  onSelectCategory?: (id: number) => void;
};

export function CategoryStatsCard({
  stats,
  onSelectCategory,
}: CategoryStatsCardProps) {
  const total = stats.reduce((sum, c) => sum + c.amount, 0);

  // ⭐ Dark-mode veilige kleuren
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textMuted = useColorModeValue("gray.600", "gray.400");

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Categorie Analyse</Heading>
      </CardHeader>

      <CardBody
        overflowY="auto"
        maxH="320px"
        pr={2}
        css={{
          scrollbarWidth: "thin",
          scrollbarColor: "#999 transparent",
        }}
      >
        <VStack align="stretch" spacing={4}>
          {stats.map((cat) => {
            const percentage = total > 0 ? (cat.amount / total) * 100 : 0;

            return (
              <Box
                key={cat.id}
                p={3}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                _hover={{ bg: hoverBg, cursor: "pointer" }}
                onClick={() => onSelectCategory?.(cat.id)}
              >
                <HStack justify="space-between">
                  <Text fontWeight="bold">{cat.name}</Text>
                  <Text>€{cat.amount}</Text>
                </HStack>

                <HStack justify="space-between" fontSize="sm" color={textMuted}>
                  <Text>{cat.count} transacties</Text>
                  <Text>{percentage.toFixed(0)}%</Text>
                </HStack>

                <Progress
                  value={percentage}
                  size="sm"
                  mt={2}
                  colorScheme="teal"
                  borderRadius="md"
                />
              </Box>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
}
