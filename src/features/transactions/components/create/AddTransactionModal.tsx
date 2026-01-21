import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { Transaction } from "@shared/types/Transaction";
import { cleanMerchant } from "../../../../../../backend/src/utils/cleanMerchant";

type AddTransactionModalProps = {
  onAdd: (tx: Transaction) => void;
};

export function AddTransactionModal({ onAdd }: AddTransactionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!description || !amount || !category || !merchant || !date) return;

    const newTx: Transaction = {
      id: Date.now(), // number, niet string
      date, // bankdatum
      transaction_date: date, // aankoopdatum = zelfde bij handmatig

      description,
      amount: parseFloat(amount),

      merchant: cleanMerchant(merchant), // nette UI-naam
      merchant_raw: merchant, // ruwe input

      category, // leesbaar label
      category_id: null,
      subcategory: null,
      subcategory_id: null,

      recurring,

      receipt_id: null, // handmatige transacties hebben geen bon
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
              {/* Beschrijving */}
              <Box w="100%">
                <Text mb={1}>Beschrijving</Text>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>

              {/* Bedrag */}
              <Box w="100%">
                <Text mb={1}>Bedrag</Text>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              {/* Categorie */}
              <Box w="100%">
                <Text mb={1}>Categorie</Text>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E0",
                  }}
                >
                  <option value="">Selecteer categorie</option>
                  <option value="Boodschappen">Boodschappen</option>
                  <option value="Vervoer">Vervoer</option>
                  <option value="Abonnementen">Abonnementen</option>
                  <option value="Uit eten">Uit eten</option>
                </select>
              </Box>

              {/* Merchant */}
              <Box w="100%">
                <Text mb={1}>Merchant</Text>
                <Input
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                />
              </Box>

              {/* Datum */}
              <Box w="100%">
                <Text mb={1}>Datum</Text>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Box>

              {/* Recurring */}
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

            {/* Footer */}
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
