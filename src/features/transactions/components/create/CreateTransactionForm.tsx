import {
  Box,
  Button,
  Input,
  VStack,
  Select,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CreateTransactionFromReceiptInput } from "../../match/types/matchTypes";
import {
  ExtractedReceipt,
  Receipt,
} from "../../../receipts/extract/types/extractTypes";

// -----------------------------
// AI → category_id mapping
// -----------------------------
const CATEGORY_MAP: Record<string, number> = {
  cafe: 2,
  restaurant: 2,
  eten: 2,
  snackbar: 2,
  supermarkt: 1,
  boodschappen: 1,
  vervoer: 3,
  ov: 3,
  trein: 3,
  energie: 6,
  huur: 5,
  abonnement: 4,
  abonnementen: 4,
};

// -----------------------------
// Merchant memory (self-learning)
// -----------------------------
function saveMerchantMemory(merchant: string, categoryId: number) {
  const key = merchant.toLowerCase().trim();
  const memory = JSON.parse(localStorage.getItem("merchantMemory") || "{}");
  memory[key] = categoryId;
  localStorage.setItem("merchantMemory", JSON.stringify(memory));
}

function loadMerchantMemory(merchant: string): number | null {
  const key = merchant.toLowerCase().trim();
  const memory = JSON.parse(localStorage.getItem("merchantMemory") || "{}");
  return memory[key] ?? null;
}

type Props = {
  receipt: Receipt;
  extracted: ExtractedReceipt;
  onClose?: () => void;
};

export function CreateTransactionForm({ receipt, extracted, onClose }: Props) {
  const toast = useToast();

  const [form, setForm] = useState<CreateTransactionFromReceiptInput>({
    amount: extracted.total ?? 0,
    date: extracted.date ?? "",
    merchant: extracted.merchant ?? "",
    category_id: null,
    description: extracted.merchant ?? "",
  });

  function update<K extends keyof CreateTransactionFromReceiptInput>(
    key: K,
    value: CreateTransactionFromReceiptInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const [categories, setCategories] = useState<
    { id: number; name: string; type: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // -----------------------------
  // Automatic category prefill
  // -----------------------------
  useEffect(() => {
    const merchantKey = extracted.merchant?.toLowerCase().trim();

    const learned = merchantKey ? loadMerchantMemory(merchantKey) : null;
    if (learned) {
      update("category_id", learned);
      return;
    }

    const aiKey = extracted.merchant_category?.toLowerCase().trim();
    if (aiKey && CATEGORY_MAP[aiKey]) {
      update("category_id", CATEGORY_MAP[aiKey]);
      return;
    }
  }, [extracted]);

  return (
    <VStack
      align="stretch"
      spacing={4}
      bg="gray.900"
      p={6}
      borderRadius="md"
      color="white"
      boxShadow="md"
    >
      <Box>
        <FormLabel color="gray.400">Bedrag</FormLabel>
        <Input
          bg="gray.800"
          color="white"
          borderColor="gray.700"
          type="number"
          value={form.amount}
          onChange={(e) => update("amount", parseFloat(e.target.value))}
        />
      </Box>

      <Box>
        <FormLabel color="gray.400">Datum</FormLabel>
        <Input
          bg="gray.800"
          color="white"
          borderColor="gray.700"
          type="datetime-local"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
        />
      </Box>

      <Box>
        <FormLabel color="gray.400">Winkel</FormLabel>
        <Input
          bg="gray.800"
          color="white"
          borderColor="gray.700"
          value={form.merchant}
          onChange={(e) => update("merchant", e.target.value)}
        />
      </Box>

      <Box>
        <FormLabel color="gray.400">Omschrijving</FormLabel>
        <Input
          bg="gray.800"
          color="white"
          borderColor="gray.700"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </Box>

      <Box>
        <FormLabel color="gray.400">Categorie</FormLabel>
        <Select
          bg="gray.800"
          color="white"
          borderColor="gray.700"
          value={form.category_id ?? 0}
          onChange={(e) => {
            const id = Number(e.target.value);
            update("category_id", id === 0 ? null : id);
          }}
        >
          <option value={0}>Selecteer categorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Box>

      <Button
        colorScheme="green"
        size="md"
        mt={2}
        onClick={async () => {
          try {
            // ⭐ ALWAYS NEGATIVE AMOUNT
            const rawAmount = form.amount ?? extracted.total ?? 0;
            const amount = -Math.abs(rawAmount);

            const res = await fetch("/api/transactions/from-extracted", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                receiptId: receipt.id,
                extracted,
                form: {
                  ...form,
                  amount, // ⭐ OVERRIDDEN HERE
                  description: form.description || form.merchant,
                },
              }),
            });

            if (res.status === 409) {
              toast({
                title: "Transactie bestaat al",
                description: "Deze bon is al eerder opgeslagen.",
                status: "warning",
                duration: 4000,
                isClosable: true,
              });

              onClose?.();
              return;
            }

            if (!res.ok) {
              toast({
                title: "Fout bij opslaan",
                description: "Er ging iets mis tijdens het opslaan.",
                status: "error",
                duration: 4000,
                isClosable: true,
              });
              return;
            }

            toast({
              title: "Transactie opgeslagen",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            if (form.merchant && form.category_id) {
              saveMerchantMemory(form.merchant, form.category_id);
            }

            onClose?.();
          } catch (err) {
            console.error("Failed to save transaction", err);
            toast({
              title: "Netwerkfout",
              description: "Kan geen verbinding maken met de server.",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          }
        }}
      >
        Maak transactie aan
      </Button>
    </VStack>
  );
}
