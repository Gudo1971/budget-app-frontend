import { Button, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ExtractedReceipt,
  Receipt,
} from "../../../receipts/extract/types/extractTypes";
import { normalizeCategory as normalizeCategoryUtil } from "./mapping/categoryMap";
import { NewCategoryModal } from "./NewCategoryModal";
import { TransactionFormFields } from "./TransactionFormFields";
import { DuplicateMatchModal } from "./DuplicateMatchModal";
import { useCreateTransactionFlow } from "../../create/hooks/useCreateTransactionFlow";

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

  const { isLoading, matchResult, runCreateFlow, linkToExisting } =
    useCreateTransactionFlow();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const initialCategory = normalizeCategoryUtil(
    extracted.merchant_category ?? extracted.category ?? "",
  );

  const [form, setForm] = useState({
    amount: -(extracted.total ?? 0),
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

  // ⭐ Categorieën laden
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

  // ⭐ Submit → hook regelt alles
  function handleSubmit() {
    runCreateFlow({
      receiptId: receipt.id,
      userId,
      form,
      onDuplicateFound: () => {},
      onSuccess: () => {
        toast({
          title: "Transactie aangemaakt",
          description: "De bon is gekoppeld aan een nieuwe transactie.",
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

  // ⭐ Duplicate bevestigen
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
        <TransactionFormFields
          form={form}
          update={update}
          categories={categories}
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
          update("category", newCat.name);
        }}
      />
    </>
  );
}
