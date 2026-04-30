import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/api";

type CreateCategoryInput = {
  name: string;
  type: "fixed" | "flexible";
};

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      return apiPost("/categories", {
        userId: "demo-user",
        ...data,
      });
    },
  });
}
