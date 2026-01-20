import {
  Box,
  Button,
  Input,
  VStack,
  Select,
  FormLabel,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ExtractedReceipt,
  Receipt,
} from "../../../receipts/extract/types/extractTypes";
import { NewCategoryModal } from "./NewCategoryModal";
import { normalizeCategory as normalizeCategoryUtil } from "./mapping/categoryMap";
import { apiGet } from "../../../../lib/api/api";

type Props = {
  receipt: Receipt;
  extracted: ExtractedReceipt;
  userId: string;
  onClose?: () => void;
};

type Category = { id: number; name: string };

export function CreateTransactionForm({
  receipt,
  extracted,
  userId,
  onClose,
}: Props) {
  const toast = useToast();
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const {
    isOpen: isMatchOpen,
    onOpen: onMatchOpen,
    onClose: onMatchClose,
  } = useDisclosure();

  const [categories, setCategories] = useState<Category[]>([]);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isLinking, setIsLinking] = useState(false);

  // ⭐ Automatische categorie: Restaurant > Food & Drink > ""
  const initialCategory = normalizeCategoryUtil(
    extracted.merchant_category ?? extracted.category ?? "",
  );

  const [form, setForm] = useState({
    amount: extracted.total ?? 0,
    date: extracted.date ?? "",
    merchant: extracted.merchant ?? "",
    category: initialCategory,
    subcategory: extracted.subcategory ?? "",
    description: extracted.merchant ?? "",
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  console.log(
    "RAW AI CATEGORY:",
    extracted.category,
    extracted.merchant_category,
  );

  // ⭐ Laad DB-categorieën → voeg AI-categorie toe → normaliseer
  useEffect(() => {
    fetch(`http://localhost:3001/api/categories?userId=${userId}`)
      .then((res) => res.json())
      .then((data: Category[]) => {
        const names = data.map((c) => c.name);

        const aiCat = normalizeCategoryUtil(
          extracted.merchant_category ?? extracted.category ?? undefined,
        );

        const extra: Category[] = [];

        if (aiCat && !names.includes(aiCat)) {
          extra.push({ id: -1, name: aiCat });
        }

        setCategories([...data, ...extra]);

        if (aiCat) update("category", aiCat);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, [userId, extracted.category, extracted.merchant_category]);

  async function handleSubmit() {
    try {
      setIsLinking(true);

      // ⭐ STAP 0: Garantir que receipt foi analisado (POST /extract)
      console.log("📄 Ensuring receipt is analyzed...");
      const res = await fetch(
        `http://localhost:3001/api/receipts/${receipt.id}/extract`,
        {
          method: "POST",
        },
      );
      if (!res.ok) throw new Error("Failed to analyze receipt");
      console.log("✅ Receipt analyzed");

      // ⭐ STAP 1: Check for matches
      console.log("🔍 Checking for matching transactions...");
      const match = await apiGet<any>(`/receipts/${receipt.id}/match`);
      console.log("📊 Match result:", match);

      // ⭐ ALS DUPLICATE FOUND: TOON CONFIRM MODAL
      if (match.action === "duplicate" && match.duplicate) {
        setMatchResult(match);
        onMatchOpen();
        setIsLinking(false);
        return;
      }

      // ⭐ GEEN DUPLICATE: Direct koppelen
      await performLink();
    } catch (err: any) {
      console.error("❌ Error during submit:", err);
      console.error("Error message:", err?.message);
      console.error("Full error:", JSON.stringify(err, null, 2));

      // Tenta extrair mais detalhes do erro
      let errorMsg = String(err);
      if (err?.response) {
        errorMsg = await err.response.text();
      }

      toast({
        title: "Erro ao processar",
        description:
          errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsLinking(false);
    }
  }

  async function performLink() {
    try {
      const res = await fetch(
        `http://localhost:3001/api/receipts/${receipt.id}/link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: form.amount,
            date: form.date,
            merchant: form.merchant,
            category: form.category,
            subcategory: form.subcategory,
            description: form.description,
            userId,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to link receipt");

      toast({
        title: "Bon gelinkt",
        description: "De bon is succesvol gekoppeld aan een transactie.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // ⭐ FORCE REFRESH - sluit modal en trigger herlaad
      onMatchClose();
      onClose?.();

      // ⭐ Terug naar transacties met refresh
      setTimeout(() => {
        window.location.href = "/transactions?refresh=" + Date.now();
      }, 1500);
    } catch (err) {
      console.error("Failed to save transaction", err);
      toast({
        title: "Fout",
        description: "Kon de bon niet koppelen.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLinking(false);
    }
  }

  function handleConfirmMatch() {
    performLink();
  }

  function handleCancelMatch() {
    setMatchResult(null);
    onMatchClose();
    setIsLinking(false);
  }

  return (
    <>
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
            type="date"
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
            value={form.category}
            onChange={(e) => {
              if (e.target.value === "__new__") {
                onOpen();
                return;
              }
              update("category", e.target.value);
            }}
          >
            <option value="">Selecteer categorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="__new__">+ Nieuwe categorie toevoegen</option>
          </Select>
        </Box>

        <Button colorScheme="green" size="md" mt={2} onClick={handleSubmit}>
          Maak transactie aan
        </Button>
      </VStack>

      {/* ⭐ CONFIRM MATCH MODAL */}
      <Modal isOpen={isMatchOpen} onClose={onMatchClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Mogelijke overeenkomst gevonden</ModalHeader>
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Text>
                We hebben een bestaande transactie gevonden die overeenkomt met
                deze bon. Wil je deze bon aan die transactie koppelen?
              </Text>

              <Divider />

              {matchResult?.duplicate && (
                <Box bg="gray.900" p={4} borderRadius="md" w="100%">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">Bestaande transactie:</Text>
                    <Text fontSize="sm">📅 {matchResult.duplicate.date}</Text>
                    <Text fontSize="sm">
                      🏪 {matchResult.duplicate.merchant}
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="green.300">
                      💰 € {matchResult.duplicate.amount}
                    </Text>
                  </VStack>
                </Box>
              )}

              <Divider />

              <Text fontSize="sm" color="gray.400">
                Selecteer "Ja, koppelen" om deze bon aan de gevonden transactie
                te koppelen, of "Annuleren" om een nieuwe transactie aan te
                maken.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={handleCancelMatch}>
                Annuleren
              </Button>
              <Button
                colorScheme="green"
                onClick={handleConfirmMatch}
                isLoading={isLinking}
              >
                Ja, koppelen
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <NewCategoryModal
        userId={userId}
        isOpen={isOpen}
        onClose={closeModal}
        onCreated={(newCat: Category) => {
          setCategories((prev) => [...prev, newCat]);
          update("category", newCat.name);
        }}
      />
    </>
  );
}
