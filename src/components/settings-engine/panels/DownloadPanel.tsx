import { Box, Button, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useReceiptStore } from "../../../stores/receiptStore";

export function DownloadPanel() {
  const receipts = useReceiptStore((state) => state.receipts);
  const selectedIds = useReceiptStore((state) => state.selectedIds);
  const toggleSelect = useReceiptStore((state) => state.toggleSelect);

  const selectedReceipts = receipts.filter((r) => selectedIds.includes(r.id));

  const handleDownload = async () => {
    if (selectedReceipts.length === 0) return;

    const query = selectedReceipts.map((r) => r.id).join(",");
    const res = await fetch(`/api/receipts/zip?ids=${query}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bonnen.zip";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <VStack align="start" spacing={4}>
      <Text fontWeight="bold" fontSize="lg">
        Download ZIP
      </Text>
      <Text>Klik op bonnen om ze te selecteren.</Text>

      <SimpleGrid columns={[2, 3, 4]} spacing={3} w="100%">
        {receipts.map((receipt) => {
          const isSelected = selectedIds.includes(receipt.id);

          return (
            <Box
              key={receipt.id}
              border="2px solid"
              borderColor={isSelected ? "blue.400" : "gray.300"}
              borderRadius="md"
              p={2}
              cursor="pointer"
              onClick={() => toggleSelect(receipt.id)}
            >
              <Image src={receipt.thumbnailUrl} borderRadius="md" mb={2} />
              <Text fontSize="sm">{receipt.date || `Bon ${receipt.id}`}</Text>
            </Box>
          );
        })}
      </SimpleGrid>

      <Button
        colorScheme="green"
        onClick={handleDownload}
        isDisabled={selectedReceipts.length === 0}
      >
        Download ZIP ({selectedReceipts.length})
      </Button>
    </VStack>
  );
}
