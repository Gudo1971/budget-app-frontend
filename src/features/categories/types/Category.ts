export interface Subcategory {
  id: number;
  name: string;
  color?: string;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
  type: string;
  subcategories?: Subcategory[];
}
