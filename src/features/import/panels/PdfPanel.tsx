// ===============================
// PdfPanel.tsx (gecorrigeerd)
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
  // Stap 1: PDF inlezen + duplicate check
  // ===============================
  async function handlePdfLoaded(rows: any[]) {
    const mapped = rows.map(mapPdfRowToTransaction);

    const existing = await fetch("/api/transactions").then((r) => r.json());
    const filtered = mapped.filter((tx) => !isDuplicate(existing.data, tx));

    setPreview(filtered);

    if (filtered.length === 0) {
      toast({
        title: "Geen nieuwe transacties",
        description: "Alle transacties in deze PDF zijn al bekend.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      if (onClose) onClose();
    }
  }

  // ===============================
  // Stap 2: Importeren van alleen nieuwe transacties
  // ===============================
  async function handleImport() {
    setImporting(true);

    try {
      console.log(`⏳ Starting import of ${preview.length} transactions...`);
      const startTime = Date.now();

      // ⭐ Wacht op ALLE saves
      await Promise.all(preview.map((tx) => saveTransaction(tx)));

      const elapsed = Date.now() - startTime;
      console.log(
        `✅ All ${preview.length} transactions saved in ${elapsed}ms`,
      );

      toast({
        title: `${preview.length} transacties geïmporteerd`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onClose) onClose();

      // ⭐ Verhoogde delay: wacht op database sync
      const refreshDelay = Math.max(1000, elapsed + 500);
      console.log(`⏱️ Navigating in ${refreshDelay}ms...`);

      setTimeout(() => {
        navigate("/transactions?refresh=" + Date.now());
      }, refreshDelay);
    } catch (error) {
      console.error("❌ Import error:", error);
      toast({
        title: "Fout bij importeren",
        description: String(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setImporting(false);
    }
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
