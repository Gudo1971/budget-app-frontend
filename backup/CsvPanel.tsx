import { VStack, Text } from "@chakra-ui/react";
import { CSVUploader } from "@/features/import/components/CsvUploader";

export function CsvPanel() {
  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="bold">
        CSV importeren
      </Text>

      <Text fontSize="sm" color="gray.500">
        Upload een CSV‑bestand om transacties te importeren.
      </Text>

      <CSVUploader
        onData={(rows) => {
          console.log("Geïmporteerde CSV data:", rows);
          // hier kun je straks transacties opslaan
        }}
      />
    </VStack>
  );
}
