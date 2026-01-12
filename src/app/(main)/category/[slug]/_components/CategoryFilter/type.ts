export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export interface CategoryFilterProps {
  currentCategory: Category | null;
  currentChildren: Category[];
  allCategories: Category[];
  currentSlug: string;
}