import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { SplitItemList } from "@/features/stress/components";
import { SplitForm } from "@/features/receipts/split/components/SplitForm";

async function fetchSplitItems(transactionId: string) {
  const res = await fetch(
    `http://localhost:3001/split-transactions/${transactionId}`
  );
  if (!res.ok) throw new Error("Failed to fetch split items");
  return res.json();
}

export default function SplitPage() {
  const { id } = useParams(); // /split/:id

  const { data, isLoading, isError } = useQuery({
    queryKey: ["split-items", id],
    queryFn: () => fetchSplitItems(id!),
    enabled: !!id,
  });

  const transactionId = Number(id);

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Heading size="lg" mb={4}>
        Split Transaction
      </Heading>

      {/* FIXED: id doorgeven */}
      <SplitForm transactionId={transactionId} />

      <Text fontSize="sm" color="gray.500" mb={6}>
        Bekijk en analyseer de opgesplitste items. Stress‑indicatoren helpen je
        begrijpen welke uitgaven mogelijk risico geven.
      </Text>

      <Divider mb={6} />

      {isLoading && (
        <HStack justify="center" mt={10}>
          <Spinner size="lg" />
        </HStack>
      )}

      {isError && (
        <Text color="red.500" textAlign="center">
          Kon split‑items niet laden.
        </Text>
      )}

      {data && data.length === 0 && (
        <Text textAlign="center" color="gray.500">
          Geen split‑items gevonden.
        </Text>
      )}

      {data && data.length > 0 && (
        <VStack spacing={4} align="stretch">
          <SplitItemList items={data} />
        </VStack>
      )}
    </Box>
  );
}
