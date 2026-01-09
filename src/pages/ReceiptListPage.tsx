import { useEffect, useState } from "react";
import { Box, Heading, VStack, HStack, Text, Spinner } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { ReceiptCard } from "../components/receipts/ReceiptCard";
import { SettingsLauncher } from "../components/settings-engine/SettingsLauncher";
import { GearMenu } from "../components/ui/GearMenu";
import { UploadBarIcon } from "../components/icons/UploadBarIcon";
import { UploadBarTopIcon } from "@/components/icons/UploadBarTopIcon";
type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
};

export default function ReceiptListPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3001/api/receipts");
    const data = await res.json();
    setReceipts(data);
    setLoading(false);
  };

  const deleteReceipt = async (id: number) => {
    if (!confirm("Weet je zeker dat je deze bon wilt verwijderen")) return;

    await fetch(`http://localhost:3001/api/receipts/${id}`, {
      method: "DELETE",
    });

    fetchReceipts();
  };

  const downloadReceipt = (id: number) => {
    window.open(`http://localhost:3001/api/receipts/${id}/file`, "_blank");
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading>Bonnen</Heading>

        <SettingsLauncher route="/settings/receipts" />
      </HStack>

      {loading && (
        <VStack pt={4}>
          <Spinner />
          <Text>Bonnen laden…</Text>
        </VStack>
      )}

      {!loading && receipts.length === 0 && (
        <Text color="gray.500">Nog geen bonnen geüpload.</Text>
      )}

      <VStack align="stretch" gap={4}>
        {receipts.map((r) => (
          <ReceiptCard
            key={r.id}
            receipt={r}
            onDelete={deleteReceipt}
            onDownload={downloadReceipt}
          />
        ))}
      </VStack>
    </Box>
  );
}
