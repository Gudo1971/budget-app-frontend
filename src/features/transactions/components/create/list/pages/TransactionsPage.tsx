import {
  Box,
  Heading,
  Text,
  Input,
  VStack,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { parseCsv } from "@/lib/parser/parseCsv";
import { categorizeWithAI } from "@/lib/ai/aiCategorize";
import { callAIStream } from "@/lib/ai/ai";
import { TransactionCard } from "@/features/dashboard/components/TransactionCard";
import { useTransactions } from "@/features/transactions/shared/hooks/useTransactions";
import { useUser } from "@/context/UserContext";

export default function TransactionsPage() {
  const normalizeBackendTransaction = (t: any) => ({
    id: String(t.id),
    description: t.description,
    amount: t.amount,
    category: t.category?.name ?? "Onbekend",
    merchant: t.merchant ?? undefined,
    recurring: t.recurring ?? false,
    date: t.date ?? undefined,
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvTransactions, setCsvTransactions] = useState<any[]>([]);

  const { id: userId } = useUser();

  // ⭐ Backend transacties ophalen
  const { data: backendTransactions = [] } = useTransactions();

  // ⭐ CSV upload handler
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const parsed = await parseCsv(file);
    const categorized = await categorizeWithAI(parsed);

    setCsvTransactions(categorized);
    setLoading(false);
  };

  // ⭐ CSV transacties opslaan
  const saveTransactionsToBackend = async () => {
    setLoading(true);

    for (const tx of csvTransactions) {
      await fetch("http://localhost:3001/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: tx.amount,
          description: tx.description,
          date: tx.date,
          category: tx.category,
          userId,
        }),
      });
    }

    setLoading(false);
    alert("Transacties opgeslagen!");
  };

  return (
    <>
      <Heading mb={6}>Transacties</Heading>

      {/* AI Test */}
      <Button
        colorScheme="teal"
        mb={4}
        onClick={async () => {
          await callAIStream("Test of de AI werkt", (chunk) => {
            console.log("AI chunk:", chunk);
          });
        }}
      >
        Test AI
      </Button>

      {/* CSV UPLOAD */}
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <VStack align="start" gap={4}>
          <Text color="gray.600">Upload een CSV-bestand met transacties.</Text>

          <Input type="file" accept=".csv" onChange={handleFile} />

          {fileName && (
            <Text fontSize="sm" color="teal.600">
              Bestand geselecteerd: {fileName}
            </Text>
          )}

          {loading && (
            <VStack pt={4}>
              <Spinner />
              <Text>AI categoriseert transacties…</Text>
            </VStack>
          )}
        </VStack>
      </Box>

      {/* RECEIPT UPLOAD */}
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm" mt={6}>
        <VStack align="start" gap={4}>
          <Text color="gray.600">Upload een kassabon (foto of PDF).</Text>

          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("receipt", file);

              try {
                const res = await fetch(
                  "http://localhost:3001/receipts/upload",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const data = await res.json();
                alert("Bon geüpload! ID: " + data.receiptId);
              } catch (err) {
                alert("Upload mislukt");
              }
            }}
          />

          <Text fontSize="sm" color="gray.500">
            Ondersteund: JPG, PNG, PDF
          </Text>
        </VStack>
      </Box>

      {/* BACKEND TRANSACTIONS */}
      <Heading size="md" mt={10} mb={4}>
        Jouw transacties
      </Heading>

      <VStack align="stretch" gap={4}>
        {backendTransactions.map((t) => (
          <TransactionCard
            key={t.id}
            transaction={{
              ...t,
              id: String(t.id),
              category: t.category?.name ?? "Onbekend",
            }}
          />
        ))}

        {backendTransactions.length === 0 && (
          <Text color="gray.500">Nog geen transacties gevonden.</Text>
        )}
      </VStack>

      {/* CSV PREVIEW */}
      {csvTransactions.length > 0 && (
        <>
          <Heading size="md" mt={10} mb={4}>
            Nieuwe transacties (CSV)
          </Heading>

          <VStack align="stretch" gap={4}>
            {csvTransactions.map((t, i) => (
              <TransactionCard key={i} transaction={t} />
            ))}

            <Button colorScheme="green" onClick={saveTransactionsToBackend}>
              Sla transacties op
            </Button>
          </VStack>
        </>
      )}
    </>
  );
}
