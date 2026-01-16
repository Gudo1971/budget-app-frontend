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

  // Duplicate flow state
  const [duplicateTransactionId, setDuplicateTransactionId] = useState<
    number | null
  >(null);
  const [duplicateTransaction, setDuplicateTransaction] = useState<any>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Form state
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

  // Categories
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

  // -----------------------------
  // Fetch transaction details
  // -----------------------------
  async function fetchTransaction(id: number) {
    const res = await fetch(`/api/transactions/${id}`);
    const tx = await res.json();
    setDuplicateTransaction(tx);
  }

  // -----------------------------
  // Link existing transaction
  // -----------------------------
  async function handleLinkExisting() {
    if (!duplicateTransactionId) return;

    try {
      const res = await fetch(`/api/receipts/${receipt.id}/link-existing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: duplicateTransactionId }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Bon gekoppeld",
          description: "De bon is gekoppeld aan de bestaande transactie.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setShowDuplicateModal(false);
        onClose?.();
      }
    } catch (err) {
      console.error("Failed to link existing transaction", err);
      toast({
        title: "Fout bij koppelen",
        description: "Kon de bon niet koppelen aan de transactie.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  // -----------------------------
  // Submit handler
  // -----------------------------
  async function handleSubmit() {
    try {
      const res = await fetch(`/api/receipts/${receipt.id}/create-or-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extracted,
          userChoice: undefined, // eerste call
        }),
      });

      const data = await res.json();

      // CASE A — AI match → vraag gebruiker
      if (data.action === "ask-user") {
        setDuplicateTransactionId(data.match.id);
        fetchTransaction(data.match.id);
        setShowDuplicateModal(true);
        return;
      }

      // CASE D — duplicate via duplicate-check
      if (data.action === "duplicate") {
        setDuplicateTransactionId(data.transactionId);
        fetchTransaction(data.transactionId);
        setShowDuplicateModal(true);
        return;
      }

      // CASE B — gekoppeld aan bestaande transactie
      if (data.action === "linked-existing") {
        toast({
          title: "Bon gekoppeld",
          description: "De bon is gekoppeld aan een bestaande transactie.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose?.();
        return;
      }

      // CASE D — nieuwe transactie aangemaakt
      if (data.action === "created-new") {
        toast({
          title: "Nieuwe transactie aangemaakt",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        if (form.merchant && form.category_id) {
          saveMerchantMemory(form.merchant, form.category_id);
        }

        onClose?.();
        return;
      }
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
  }

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
      {/* Form fields */}
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

      {/* Submit button */}
      <Button colorScheme="green" size="md" mt={2} onClick={handleSubmit}>
        Maak transactie aan
      </Button>

      {/* Duplicate modal */}
      {showDuplicateModal && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="blackAlpha.700"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <Box bg="gray.800" p={6} borderRadius="md" width="90%" maxW="400px">
            <FormLabel color="gray.300" fontSize="lg" mb={4}>
              Bestaande transactie gevonden
            </FormLabel>

            {duplicateTransaction && (
              <VStack align="start" spacing={2} mb={4}>
                <Box>
                  <b>Merchant:</b> {duplicateTransaction.merchant}
                </Box>
                <Box>
                  <b>Bedrag:</b> €
                  {Math.abs(duplicateTransaction.amount).toFixed(2)}
                </Box>
                <Box>
                  <b>Datum:</b> {duplicateTransaction.date}
                </Box>
              </VStack>
            )}

            <Box mb={4}>Wil je deze bon koppelen aan deze transactie?</Box>

            <VStack spacing={3}>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={handleLinkExisting}
              >
                Koppel bon
              </Button>

              <Button
                variant="outline"
                width="100%"
                onClick={() => setShowDuplicateModal(false)}
              >
                Annuleer
              </Button>
            </VStack>
          </Box>
        </Box>
      )}
    </VStack>
  );
}
