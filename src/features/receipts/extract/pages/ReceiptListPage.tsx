import { useState, useEffect } from "react";
import { Box, Spinner, Text, Flex, Heading } from "@chakra-ui/react";
import { SettingsLauncher } from "../../../settings-enigine/SettingsLauncher";
import { ReceiptCard } from "../../list/components/ReceiptCard";
import { ReceiptPreviewPanel } from "../components/ReceiptPreviewPanel";
import { useLocation } from "react-router-dom";

export function ReceiptListPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const location = useLocation();

  // ------------------------------------------------------------
  // Load inbox receipts (pending + linked)
  // ------------------------------------------------------------
  async function loadReceipts() {
    const res = await fetch("/api/receipts");
    const data = await res.json();

    const inbox = data.filter(
      (r: any) => r.status === "pending" || r.status === "linked"
    );

    inbox.sort(
      (a: any, b: any) =>
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );

    setReceipts(inbox);
    setLoadingReceipts(false);
  }

  useEffect(() => {
    loadReceipts();
  }, []);

  // ------------------------------------------------------------
  // Auto-select bij single upload (autoAnalyze)
  // ------------------------------------------------------------
  useEffect(() => {
    if (location.state?.autoAnalyze && location.state?.receiptId) {
      setSelectedId(location.state.receiptId);
    }
  }, [location.state]);

  // ------------------------------------------------------------
  // UI handlers
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
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
          Geen openstaande bonnen.
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
                <ReceiptPreviewPanel
                  receipt={r}
                  onClose={() => {
                    setSelectedId(null);
                    loadReceipts(); // ⭐ lijst verversen
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
    </Box>
  );
}
