import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type CreateCategoryInput = {
  name: string;
  type: "fixed" | "flexible";
};

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const res = await axios.post("/api/categories", {
        userId: "demo-user",
        ...data,
      });
      return res.data;
    },
  });
}
