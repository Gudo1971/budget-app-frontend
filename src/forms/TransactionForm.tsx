import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../context/UserContext";

type Category = {
  id: string;
  name: string;
};

const [categories, setCategories] = useState<Category[]>([]);

const schema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Voer een geldig positief getal in",
  }),
  description: z.string().min(1, "Omschrijving is verplicht"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ongeldige datum",
  }),
  category: z.string().min(1, "Kies een categorie"),
});

type FormData = z.infer<typeof schema>;

export function TransactionForm() {
  const { id: userId } = useUser();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch("http://localhost:3001/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        amount: Number(data.amount),
        userId,
      }),
    });

    reset();
    alert("Transactie toegevoegd!");
  };

  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="sm" mt={8}>
      <Heading size="md" mb={4}>
        Handmatig transactie toevoegen
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <FormControl isInvalid={!!errors.amount}>
            <FormLabel>Bedrag</FormLabel>
            <Input type="number" step="0.01" {...register("amount")} />
            {errors.amount && (
              <Text color="red.500">{errors.amount.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>Omschrijving</FormLabel>
            <Input {...register("description")} />
            {errors.description && (
              <Text color="red.500">{errors.description.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.date}>
            <FormLabel>Datum</FormLabel>
            <Input type="date" {...register("date")} />
            {errors.date && <Text color="red.500">{errors.date.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.category}>
            <FormLabel>Categorie</FormLabel>
            <Select placeholder="Kies een categorie" {...register("category")}>
              {" "}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {" "}
                  {cat.name}{" "}
                </option>
              ))}{" "}
            </Select>
            {errors.category && (
              <Text color="red.500">{errors.category.message}</Text>
            )}
          </FormControl>

          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Voeg transactie toe
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
