import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SplitFormValues = {
  item_name: string;
  amount: number;
};

export function SplitForm({ transactionId }: { transactionId: number }) {
  const { register, handleSubmit, reset } = useForm<SplitFormValues>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: SplitFormValues) => {
      const res = await fetch("http://localhost:3001/split-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: transactionId,
          items: [
            {
              item_name: data.item_name,
              amount: data.amount,
              category_id: null,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Failed to save split");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["split-items", transactionId],
      });
      reset();
    },
  });

  return (
    <Box mt={6} p={4} borderWidth="1px" borderRadius="md">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <FormControl mb={3}>
          <FormLabel>Naam</FormLabel>
          <Input
            placeholder="Bijv. Boodschappen"
            {...register("item_name", { required: true })}
          />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Bedrag</FormLabel>
          <NumberInput min={0} precision={2}>
            <NumberInputField
              {...register("amount", { required: true, valueAsNumber: true })}
            />
          </NumberInput>
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={mutation.isPending}>
          Toevoegen
        </Button>
      </form>
    </Box>
  );
}
