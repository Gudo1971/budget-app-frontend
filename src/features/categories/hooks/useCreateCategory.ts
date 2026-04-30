import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type CreateCategoryInput = {
  name: string;
  type: "fixed" | "flexible";
};

export function useCreateCategory() {
  const API = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const res = await axios.post(`${API}/categories`, {
        userId: "demo-user",
        ...data,
      });
      return res.data;
    },
  });
}
