import { Button, VStack, useToast, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ExtractedReceipt,
  Receipt,
} from "../../../receipts/extract/types/extractTypes";
import { NewCategoryModal } from "./NewCategoryModal";
import { TransactionFormFields } from "./TransactionFormFields";
import { DuplicateMatchModal } from "./DuplicateMatchModal";
import { useCreateTransactionFlow } from "../../create/hooks/useCreateTransactionFlow";
import { useMerchantMemory } from "@/features/merchantMemory/hooks/useMerchantMemory";

// ⭐ FRONTEND-SAFE merchant normalizer
function normalizeMerchantFrontend(name: string) {
  return name.trim().toLowerCase();
}

// Normalize any extracted date to an ISO yyyy-mm-dd string for the date input
function formatDateForInput(raw?: string | null) {
  if (!raw) return "";
  const value = raw.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const euro = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (euro) {
    const [, d, m, y] = euro;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  }

  const named = value.match(/^(\d{1,2})[-\s]([a-zA-Z]{3,})[-\s](\d{2,4})$/);
  if (named) {
    const [, d, mon, y] = named;
    const date = new Date(`${d} ${mon} ${y.length === 2 ? "20" + y : y}`);
    if (!isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  }

  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  return "";
}

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

  const { suggestCategory } = useMerchantMemory();
  const { isLoading, matchResult, runCreateFlow, linkToExisting } =
    useCreateTransactionFlow();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [userChangedCategory, setUserChangedCategory] = useState(false);

  // ⭐ Use frontend-safe normalizer
  const normalizedMerchant = normalizeMerchantFrontend(
    extracted.merchant ?? "",
  );

  const normalizedDate = formatDateForInput(extracted.date);

  const [form, setForm] = useState({
    amount: -(extracted.total ?? 0),
    date: normalizedDate,
    merchant: normalizedMerchant,
    description: normalizedMerchant,
    category_id: null as number | null,
    subcategory_id: null as number | null,
  });

  function getConfidenceColor(confidence: number) {
    if (confidence >= 0.8) return "green.300";
    if (confidence >= 0.5) return "yellow.300";
    return "orange.300";
  }

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "category_id") {
      setUserChangedCategory(true);
    }
  }

  // ⭐ Load categories from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories?userId=${userId}`)
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, [userId]);

  useEffect(() => {
    setUserChangedCategory(false);
  }, [normalizedMerchant]);

  const [memorySuggestion, setMemorySuggestion] = useState<{
    category_id: number;
    subcategory_id: number | null;
    confidence: number;
  } | null>(null);

  useEffect(() => {
    if (!memorySuggestion) return;

    if (form.category_id !== memorySuggestion.category_id) {
      setMemorySuggestion(null);
    }
  }, [form.category_id, memorySuggestion]);

  useEffect(() => {
    if (!normalizedMerchant || userChangedCategory) {
      return;
    }

    let suggestion = suggestCategory(normalizedMerchant);

    if (!suggestion && extracted.merchant_category) {
      suggestion = {
        category_id: extracted.merchant_category,
        subcategory_id: null,
        confidence: 0.6,
      };
    }

    if (suggestion) {
      setMemorySuggestion(suggestion);
      update("category_id", suggestion.category_id);
      update("subcategory_id", suggestion.subcategory_id ?? null);
    }
  }, [
    normalizedMerchant,
    userChangedCategory,
    suggestCategory,
    extracted.merchant_category,
  ]);

  function handleSubmit() {
    if (!form.category_id) {
      toast({
        title: "Categorie verplicht",
        description: "Selecteer een categorie voordat je verder gaat.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    runCreateFlow({
      receiptId: receipt.id,
      userId,
      form,
      onDuplicateFound: () => {},
      onSuccess: () => {
        toast({
          title: "Transactie aangemaakt",
          description: "De bon is gekoppeld.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onClose?.();

        setTimeout(() => {
          window.location.href = "/transactions?refresh=" + Date.now();
        }, 1500);
      },
      onError: (err) => {
        toast({
          title: "Fout",
          description: String(err),
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      },
    });
  }

  async function handleConfirmDuplicate() {
    try {
      await linkToExisting(receipt.id, matchResult.duplicate.id);

      toast({
        title: "Bon gelinkt",
        description: "De bon is gekoppeld aan de bestaande transactie.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose?.();

      setTimeout(() => {
        window.location.href = "/transactions?refresh=" + Date.now();
      }, 1500);
    } catch (err) {
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
        {memorySuggestion && (
          <Box bg="purple.700" p={3} borderRadius="md" mb={2} boxShadow="sm">
            <Text
              fontWeight="semibold"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <span>✨</span> Onze suggestie
            </Text>

            <Text fontSize="sm" opacity={0.85}>
              {
                categories.find((c) => c.id === memorySuggestion.category_id)
                  ?.name
              }
            </Text>

            <Text
              fontSize="sm"
              color={getConfidenceColor(memorySuggestion.confidence)}
            >
              {Math.round(memorySuggestion.confidence * 100)}% zeker
            </Text>
          </Box>
        )}

        <TransactionFormFields
          form={form}
          update={update}
          categories={categories}
          memorySuggestion={memorySuggestion}
          onOpen={() => setIsCategoryModalOpen(true)}
        />

        <Button
          colorScheme="green"
          size="md"
          mt={2}
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Maak transactie aan
        </Button>
      </VStack>

      <DuplicateMatchModal
        isOpen={!!matchResult?.duplicate}
        duplicate={matchResult?.duplicate ?? null}
        isLoading={isLoading}
        onConfirm={handleConfirmDuplicate}
        onCancel={() => window.location.reload()}
      />

      <NewCategoryModal
        userId={userId}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreated={(newCat: Category) => {
          setCategories((prev) => [...prev, newCat]);
          update("category_id", newCat.id);
        }}
      />
    </>
  );
}
