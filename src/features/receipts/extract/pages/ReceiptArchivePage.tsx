import { useEffect, useState } from "react";
import { Box, Spinner, Text, Flex, Heading } from "@chakra-ui/react";
import { ReceiptCard } from "../../list/components/ReceiptCard";
import { SettingsLauncher } from "../../../settings-enigine/SettingsLauncher";

export function ReceiptArchivePage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/receipts`);
      const data = await res.json();

      const archived = data.filter((r: any) => r.status === "archived");

      archived.sort(
        (a: any, b: any) =>
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime(),
      );

      setReceipts(archived);
      setLoading(false);
    }

    load();
  }, [API]);

  function handleDownload(id: number) {
    window.open(`${API}/receipts/${id}/file`, "_blank");
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/receipts/${id}`, { method: "DELETE" });
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
