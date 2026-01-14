// ===============================
// CSVUploader.tsx
// ===============================

import { useRef, useState } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import Papa from "papaparse";

export function CSVUploader({ onData }: { onData: (rows: any[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.endsWith(".csv")) {
      setError("Geen geldige CSV");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  }

  function handleImport() {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        onData(result.data);
      },
      error: () => {
        setError("CSV kon niet worden gelezen");
      },
    });
  }

  return (
    <VStack align="start" w="100%" gap={3}>
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <Button colorScheme="blue" onClick={() => inputRef.current?.click()}>
        Selecteer een CSV
      </Button>

      {file && (
        <Text fontSize="sm" color="gray.600">
          Geselecteerd: {file.name}
        </Text>
      )}

      {file && (
        <Button colorScheme="green" onClick={handleImport}>
          CSV inladen
        </Button>
      )}

      {error && (
        <Box bg="red.100" color="red.700" p={2} borderRadius="md" w="100%">
          {error}
        </Box>
      )}
    </VStack>
  );
}
