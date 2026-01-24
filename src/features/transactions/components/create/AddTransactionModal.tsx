import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Transaction } from "@shared/types/Transaction";

const CATEGORY_LABELS: Record<number, string> = {
  1: "Boodschappen",
  2: "Horeca",
  3: "Persoonlijke verzorging",
  4: "Vervoer",
  5: "Gezondheid",
  6: "Abonnementen",
  7: "Woonkosten",
  8: "Overig",
};

type AddTransactionModalProps = {
  onAdd: (tx: Transaction) => void;
};

export function AddTransactionModal({ onAdd }: AddTransactionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!description || !amount || !merchant || !date || !categoryId) return;

    const newTx: Transaction = {
      id: Date.now(),
      date,
      transaction_date: date,
      description,
      amount: parseFloat(amount),

      merchant_raw: merchant,
      merchant: merchant.trim(),

      category_id: categoryId,

      subcategory_id: null,

      recurring,
      receipt_id: null,
    };

    onAdd(newTx);
    onClose();
  };

  return (
    <>
      <Button colorScheme="blue" borderRadius="full" onClick={onOpen}>
        + Toevoegen
      </Button>

      {isOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={1000}
        >
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            w="90%"
            maxW="420px"
            boxShadow="xl"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Nieuwe transactie
            </Text>

            <VStack gap={4}>
              <Box w="100%">
                <Text mb={1}>Beschrijving</Text>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>

              <Box w="100%">
                <Text mb={1}>Bedrag</Text>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              <Box w="100%">
                <Text mb={1}>Categorie</Text>
                <select
                  value={categoryId ?? ""}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E0",
                  }}
                >
                  <option value="">Selecteer categorie</option>
                  {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </Box>

              <Box w="100%">
                <Text mb={1}>Merchant</Text>
                <Input
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                />
              </Box>

              <Box w="100%">
                <Text mb={1}>Datum</Text>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Box>

              <Box
                w="100%"
                display="flex"
                alignItems="center"
                gap={3}
                cursor="pointer"
              >
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  style={{ marginRight: "8px" }}
                />
                <Text>Terugkerend</Text>
              </Box>
            </VStack>

            <Box mt={6} display="flex" justifyContent="flex-end" gap={3}>
              <Button onClick={onClose}>Annuleren</Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Opslaan
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
