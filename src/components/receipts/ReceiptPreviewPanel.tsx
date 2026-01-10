import { useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Heading,
  VStack,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";

// -------------------- TYPES --------------------

export type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
};

export type ExtractedItem = {
  name: string;
  quantity: number;
  price: number;
  total?: number | null;
  category?: string | null;
};

export type ExtractedReceipt = {
  merchant: string | null;
  date: string | null;
  total: number | null;
  currency: string | null;
  items: ExtractedItem[];
};

// -------------------- COMPONENT --------------------

export function ReceiptPreviewPanel({ receipt }: { receipt: Receipt }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);

  async function analyze() {
    setLoading(true);

    const res = await fetch(`/api/receipts/${receipt.id}/extract`, {
      method: "POST",
    });

    const data = await res.json();
    setExtracted(data.extracted);
    setLoading(false);
  }

  return (
    <Box p={4} borderRadius="md" bg="gray.800" color="white" boxShadow="md">
      {/* IMAGE */}
      <Box mb={4}>
        <img
          src={`/api/receipts/${receipt.id}/file`}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </Box>

      {/* BUTTON */}
      {!extracted && !loading && (
        <Button colorScheme="blue" onClick={analyze}>
          Analyseer bon
        </Button>
      )}

      {/* LOADING */}
      {loading && (
        <HStack mt={2}>
          <Spinner size="sm" />
          <Text>Bon analyseren…</Text>
        </HStack>
      )}

      {/* RESULT */}
      {!loading && extracted && (
        <VStack align="stretch" spacing={4} mt={4}>
          <Divider />

          <Box>
            <Heading size="sm" mb={1}>
              Winkel
            </Heading>
            <Text>{extracted.merchant || "Onbekend"}</Text>
          </Box>

          <Box>
            <Heading size="sm" mb={1}>
              Datum
            </Heading>
            <Text>{extracted.date || "Onbekend"}</Text>
          </Box>

          <Box>
            <Heading size="sm" mb={1}>
              Totaal
            </Heading>
            <Text>
              {extracted.total
                ? `${extracted.total} ${extracted.currency || ""}`
                : "Onbekend"}
            </Text>
          </Box>

          <Divider />

          <Box>
            <Heading size="sm" mb={2}>
              Artikelen
            </Heading>

            {extracted.items?.length > 0 ? (
              <VStack align="stretch" spacing={2}>
                {extracted.items.map((item: ExtractedItem, i: number) => (
                  <Box key={i} p={2} bg="gray.700" borderRadius="md">
                    <HStack justify="space-between">
                      <Text>{item.name}</Text>
                      <Text>
                        {item.price} × {item.quantity}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>Geen items gevonden.</Text>
            )}
          </Box>
        </VStack>
      )}
    </Box>
  );
}
