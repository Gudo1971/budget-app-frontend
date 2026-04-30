import { useEffect, useState } from "react";
import { Box, Spinner, Text, Flex, Heading } from "@chakra-ui/react";
import { ReceiptCard } from "../../list/components/ReceiptCard";
import { SettingsLauncher } from "../../../settings-enigine/SettingsLauncher";
import { apiGet, apiDelete, apiBaseUrl } from "@/lib/api/api";

type Receipt = {
  id: number;
  status: "archived" | "pending" | "linked";
  uploaded_at: string;
  filename: string;
  original_name: string;
};

export function ReceiptArchivePage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await apiGet<Receipt[]>("/receipts");

      const archived = data
        .filter((r) => r.status === "archived")
        .sort(
          (a, b) =>
            new Date(b.uploaded_at).getTime() -
            new Date(a.uploaded_at).getTime(),
        );

      setReceipts(archived);
      setLoading(false);
    }

    load();
  }, []);

  function handleDownload(id: number) {
    // ⭐ Gebruik apiBaseUrl i.p.v. losse env var
    window.open(`${apiBaseUrl}/receipts/${id}/file`, "_blank");
  }

  async function handleDelete(id: number) {
    await apiDelete(`/receipts/${id}`);
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Archief</Heading>
        <SettingsLauncher route="/receipts/settings" />
      </Flex>

      {loading && (
        <Box p={4}>
          <Spinner size="sm" />
          <Text ml={2} display="inline">
            Archief laden…
          </Text>
        </Box>
      )}

      {!loading && receipts.length === 0 && (
        <Box p={4} color="gray.500">
          Geen gearchiveerde bonnen.
        </Box>
      )}

      {!loading &&
        receipts.map((r) => (
          <Box key={r.id} mb={4}>
            <ReceiptCard
              receipt={r}
              onClick={() => {}}
              isSelected={false}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          </Box>
        ))}
    </Box>
  );
}
