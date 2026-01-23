import { Box, Input, Select, FormLabel, VStack } from "@chakra-ui/react";

type Props = {
  form: {
    amount: number;
    date: string;
    merchant: string;
    description: string;
    category_id: number | null;
    subcategory_id: number | null;
  };
  update: <K extends keyof Props["form"]>(
    key: K,
    value: Props["form"][K],
  ) => void;
  categories: Array<{ id: number; name: string }>;
  memorySuggestion?: {
    category_id: number;
    subcategory_id: number | null;
    confidence: number;
  } | null;
  onOpen: () => void; // open new category modal
};

export function TransactionFormFields({
  form,
  update,
  categories,
  memorySuggestion,
  onOpen,
}: Props) {
  // ⭐ DEBUG: Log merchant changes
  const handleMerchantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log("🛠️ [TransactionFormFields] Merchant changed to:", newValue);
    update("merchant", newValue);
  };

  return (
    <VStack align="stretch" spacing={4}>
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
          onChange={handleMerchantChange}
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
          value={form.category_id ?? ""}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              onOpen();
              return;
            }
            update("category_id", Number(e.target.value));
          }}
        >
          <option value="">Selecteer categorie</option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {memorySuggestion?.category_id === c.id ? "⭐ " : ""}
              {c.name}
            </option>
          ))}

          <option value="__new__">+ Nieuwe categorie toevoegen</option>
        </Select>
      </Box>
    </VStack>
  );
}
