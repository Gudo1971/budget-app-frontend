import { useState, useEffect } from "react";
import { Box, Spinner, Text, Flex, Heading } from "@chakra-ui/react";
import { SettingsLauncher } from "../components/settings-engine/SettingsLauncher";
import { ReceiptCard } from "../components/receipts/ReceiptCard";
import { ReceiptPreviewPanel } from "../features/transactions/extract/components/ReceiptPreviewPanel";

export function ReceiptListPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingReceipts, setLoadingReceipts] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/receipts");
      const data = await res.json();
      setReceipts(data);
      setLoadingReceipts(false);
    }
    load();
  }, []);

  function toggleSelect(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  async function handleDelete(id: number) {
    await fetch(`/api/receipts/${id}`, { method: "DELETE" });
    setReceipts((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleDownload(id: number) {
    window.open(`/api/receipts/${id}/file`, "_blank");
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Bonnetjes</Heading>
        <SettingsLauncher route="/receipts/settings" />
      </Flex>

      {loadingReceipts && (
        <Box p={4}>
          <Spinner size="sm" />
          <Text ml={2} display="inline">
            Bonnen laden…
          </Text>
        </Box>
      )}

      {!loadingReceipts && receipts.length === 0 && (
        <Box p={4} color="gray.500">
          Nog geen bonnen geüpload.
        </Box>
      )}

      {!loadingReceipts &&
        receipts.map((r) => (
          <Box key={r.id} mb={4}>
            <ReceiptCard
              receipt={r}
              onClick={() => toggleSelect(r.id)}
              isSelected={selectedId === r.id}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />

            {selectedId === r.id && (
              <Box mt={2}>
                <ReceiptPreviewPanel receipt={r} />
              </Box>
            )}
          </Box>
        ))}
    </Box>
  );
}
