// ===============================
// CSVUploader.tsx (gecorrigeerd)
// ===============================

import { useRef, useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import Papa from "papaparse";

export function CSVUploader({ onData }: { onData: (rows: any[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

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

    setLoading(true);

    const toastId = toast({
      title: "CSV wordt verwerkt…",
      status: "loading",
      duration: null,
    });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        toast.update(toastId, {
          title: "CSV geladen",
          status: "success",
          duration: 1500,
        });

        setLoading(false);

        // ⭐ Alleen data doorgeven
        onData(result.data);
      },
      error: () => {
        toast.update(toastId, {
          title: "CSV kon niet worden gelezen",
          status: "error",
          duration: 3000,
        });

        setLoading(false);
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

      <Button
        colorScheme="blue"
        onClick={() => inputRef.current?.click()}
        isDisabled={loading}
      >
        Selecteer een CSV
      </Button>

      {file && (
        <Text fontSize="sm" color="gray.600">
          Geselecteerd: {file.name}
        </Text>
      )}

      {file && (
        <Button colorScheme="green" onClick={handleImport} isDisabled={loading}>
          {loading ? (
            <HStack>
              <Spinner size="sm" />
              <Text>Bezig…</Text>
            </HStack>
          ) : (
            "CSV inladen"
          )}
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
