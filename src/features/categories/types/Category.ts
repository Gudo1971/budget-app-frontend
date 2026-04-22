export interface Subcategory {
  id: number;
  name: string;
  color: string | null;
}

export interface Category {
  id: number;
  name: string;
  color: string | null; // ⭐ correcte definitie
  type: string;
  subcategories?: Subcategory[];
}
