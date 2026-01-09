import { useState } from "react";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";

export function ReceiptUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    setUploading(true);

    const res = await fetch("http://localhost:3001/receipts/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      alert("Upload mislukt");
      return;
    }

    alert("Bon geüpload!");
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <VStack align="start" spacing={4}>
        <Text>Kies een kassabon (foto of PDF)</Text>

        <Input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button
          colorScheme="blue"
          onClick={handleUpload}
          isLoading={uploading}
          isDisabled={!file}
        >
          Uploaden
        </Button>
      </VStack>
    </Box>
  );
}
