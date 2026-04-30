import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/api";

type Category = {
  id: number;
  name: string;
  type: string;
};

type Props = {
  value: number | null;
  onChange: (id: number | null) => void;
};

export function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiGet<Category[]>("/categories")
      .then((data) => {
        if (mounted) setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Select
      bg="gray.800"
      color="white"
      borderColor="gray.700"
      value={value ?? 0}
      onChange={(e) => {
        const id = Number(e.target.value);
        onChange(id === 0 ? null : id);
      }}
    >
      <option value={0}>Selecteer categorie</option>

      {loading ? (
        <option value={0} disabled>
          Laden...
        </option>
      ) : (
        categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))
      )}
    </Select>
  );
}
