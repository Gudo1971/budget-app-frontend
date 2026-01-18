import {
  Box,
  Button,
  Input,
  VStack,
  Select,
  FormLabel,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ExtractedReceipt,
  Receipt,
} from "../../../receipts/extract/types/extractTypes";
import { NewCategoryModal } from "./NewCategoryModal";
import { normalizeCategory as normalizeCategoryUtil } from "./mapping/categoryMap";

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

  const [categories, setCategories] = useState<Category[]>([]);

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
    fetch(`/api/categories?userId=${userId}`)
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
      const res = await fetch(`/api/receipts/${receipt.id}/link`, {
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
      });

      if (!res.ok) throw new Error("Failed to link receipt");

      toast({
        title: "Bon gelinkt",
        description: "De bon is succesvol gekoppeld aan een transactie.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose?.();
    } catch (err) {
      console.error("Failed to save transaction", err);
      toast({
        title: "Fout",
        description: "Kon de bon niet koppelen.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
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
