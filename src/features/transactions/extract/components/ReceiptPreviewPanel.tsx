import { useState } from "react";
import { Box, Spinner, Text, HStack, Button } from "@chakra-ui/react";

import {
  Receipt,
  ExtractedReceipt,
} from "@/features/transactions/extract/types/extractTypes";

import { analyzeReceipt } from "@/features/transactions/extract/services/extractService";

import { ReceiptImage } from "./ReceiptImage";
import { ReceiptExtractModal } from "./ReceiptExtractModal";

export function ReceiptPreviewPanel({ receipt }: { receipt: Receipt }) {
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  async function analyze() {
    setLoading(true);
    const parsed = await analyzeReceipt(receipt.id);
    setExtracted(parsed);
    setLoading(false);
    setModalOpen(true);
  }

  return (
    <Box p={4} borderRadius="md" bg="gray.800" color="white" boxShadow="md">
      <ReceiptImage receiptId={receipt.id} />

      {!extracted && !loading && (
        <Button colorScheme="blue" onClick={analyze}>
          Analyseer bon
        </Button>
      )}

      {loading && (
        <HStack mt={2}>
          <Spinner size="sm" />
          <Text>Bon analyseren…</Text>
        </HStack>
      )}

      {extracted && (
        <ReceiptExtractModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          extracted={extracted}
          receipt={receipt}
        />
      )}
    </Box>
  );
}
