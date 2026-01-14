import { VStack, Text, Button, Input } from "@chakra-ui/react";
import { useRef } from "react";

export function PdfPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // TODO: hier komt jouw PDF-import logic
    console.log("PDF geselecteerd:", file);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="bold">
        PDF importeren
      </Text>

      <Text fontSize="sm" color="gray.500">
        Upload een PDF-bestand om transacties te importeren of te koppelen.
      </Text>

      <Input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        display="none"
        onChange={handleFileSelect}
      />

      <Button colorScheme="blue" onClick={() => fileInputRef.current?.click()}>
        PDF kiezen
      </Button>
    </VStack>
  );
}
