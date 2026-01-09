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
} from "@chakra-ui/react";

type CategoryStat = {
  name: string;
  amount: number;
  count: number;
};

type CategoryStatsCardProps = {
  stats: CategoryStat[];
  onSelectCategory?: (name: string) => void; // ⭐ klikbare categorie
};

export function CategoryStatsCard({
  stats,
  onSelectCategory,
}: CategoryStatsCardProps) {
  const total = stats.reduce((sum, c) => sum + c.amount, 0);

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
                key={cat.name}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                onClick={() => onSelectCategory?.(cat.name)} // ⭐ klik event
              >
                <HStack justify="space-between">
                  <Text fontWeight="bold">{cat.name}</Text>
                  <Text>€{cat.amount}</Text>
                </HStack>

                <HStack justify="space-between" fontSize="sm" opacity={0.7}>
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
