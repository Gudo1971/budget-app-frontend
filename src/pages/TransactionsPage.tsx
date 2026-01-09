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
import { parseCsv } from "../lib/parseCsv";
import { categorizeWithAI } from "../lib/aiCategorize";
import { callAIStream } from "../service/ai";
import { TransactionCard } from "../components/cards/TransactionCard";
import { useTransactions } from "../hooks/useTransactions";
import { useUser } from "../context/UserContext";
import { DashboardTransactions } from "./dashboard/DashboardTransactions";

export default function TransactionsPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const { id: userId } = useUser();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const parsed = await parseCsv(file);
    const categorized = await categorizeWithAI(parsed);

    setTransactions(categorized);
    setLoading(false);
  };

  const saveTransactionsToBackend = async () => {
    setLoading(true);

    for (const tx of transactions) {
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

          <Input
            type="file"
            accept=".csv"
            onChange={handleFile}
            cursor="pointer"
          />

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
            cursor="pointer"
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
                console.log("Receipt upload response:", data);

                alert("Bon geüpload! ID: " + data.receiptId);
              } catch (err) {
                console.error(err);
                alert("Upload mislukt");
              }
            }}
          />

          <Text fontSize="sm" color="gray.500">
            Ondersteund: JPG, PNG, PDF
          </Text>
        </VStack>
      </Box>

      {/* TRANSACTIONS PREVIEW */}
      {transactions.length > 0 && (
        <VStack mt={8} align="stretch" gap={4}>
          {transactions.map((t, i) => (
            <TransactionCard key={i} transaction={t} />
          ))}

          <Button colorScheme="green" onClick={saveTransactionsToBackend}>
            Sla transacties op
          </Button>
        </VStack>
      )}

      <DashboardTransactions />
    </>
  );
}
