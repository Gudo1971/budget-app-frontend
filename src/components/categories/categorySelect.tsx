import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
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

      {categories.length === 0 ? (
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
