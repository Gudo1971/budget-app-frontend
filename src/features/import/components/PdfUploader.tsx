import { useState } from "react";
import {
  Button,
  VStack,
  Text,
  useToast,
  Spinner,
  HStack,
} from "@chakra-ui/react";

export function PdfUploader({ onData }: { onData: (rows: any[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const toastId = toast({
      title: "PDF wordt verwerkt…",
      status: "loading",
      duration: null,
    });

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("/api/ai/pdf-extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload mislukt");
      }

      const data = await res.json();
      console.log("PDF LOADED!", data.rows);

      toast.update(toastId, {
        title: "PDF geladen",
        status: "success",
        duration: 2000,
      });

      setLoading(false);

      // ⭐ Alleen data doorgeven
      onData(data.rows);
    } catch (e) {
      console.error(e);

      toast.update(toastId, {
        title: "PDF kon niet worden gelezen",
        status: "error",
        duration: 3000,
      });

      setLoading(false);
      setError("PDF kon niet worden gelezen");
    }
  }

  return (
    <VStack align="start" spacing={3}>
      <Button
        as="label"
        htmlFor="pdf-input"
        colorScheme="blue"
        isDisabled={loading}
      >
        {loading ? (
          <HStack>
            <Spinner size="sm" />
            <Text>Bezig…</Text>
          </HStack>
        ) : (
          "Selecteer een PDF"
        )}
      </Button>

      <input
        id="pdf-input"
        type="file"
        accept=".pdf"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      {error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}
    </VStack>
  );
}
