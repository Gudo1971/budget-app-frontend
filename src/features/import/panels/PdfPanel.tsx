// ===============================
// PdfPnel.tsx (previewpanel)
// ===============================

import { useState } from "react";
import { VStack, Text, Button, useToast } from "@chakra-ui/react";
import { PdfUploader } from "../components/PdfUploader";
import { mapPdfRowToTransaction } from "../logic/mapPdfRowsToTransactions";
import { isDuplicate } from "../logic/duplicateCheck";
import { saveTransaction } from "../logic/saveTransaction";
import { useNavigate } from "react-router-dom";

export function PdfPanel({ onClose }: { onClose?: () => void }) {
  const [preview, setPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // ===============================
  // Stap 1: CSV inlezen + duplicate check
  // ===============================
  async function handlePdfLoaded(rows: any[]) {
    const mapped = rows.map(mapPdfRowToTransaction);

    const existing = await fetch("/api/transactions").then((r) => r.json());
    const filtered = mapped.filter((tx) => !isDuplicate(existing.data, tx));

    setPreview(filtered);

    if (filtered.length === 0) {
      toast({
        title: "Geen nieuwe transacties",
        description: "Alle transacties in deze pdf zijn al bekend.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Panel mag direct sluiten als je dat wilt
      if (onClose) onClose();
    }
  }

  // ===============================
  // Stap 2: Importeren van alleen nieuwe transacties
  // ===============================
  async function handleImport() {
    setImporting(true);

    for (const tx of preview) {
      await saveTransaction(tx);
    }

    setImporting(false);

    toast({
      title: `${preview.length} transacties geïmporteerd`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    if (onClose) onClose();
    navigate("/transactions");
  }

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="bold">
        PDF importeren
      </Text>

      <PdfUploader
        onData={(rows) => {
          console.log("PDF LOADED!", rows);
          console.log("PDF ROW EXAMPLE:", rows[0]);

          handlePdfLoaded(rows);
        }}
      />

      {preview.length > 0 && (
        <>
          <Text fontWeight="bold">Nieuwe transacties ({preview.length})</Text>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {preview.map((row) => Object.values(row).join(", ")).join("\n")}
          </pre>

          <Button
            colorScheme="green"
            onClick={handleImport}
            isLoading={importing}
          >
            Importeren
          </Button>
        </>
      )}
    </VStack>
  );
}
