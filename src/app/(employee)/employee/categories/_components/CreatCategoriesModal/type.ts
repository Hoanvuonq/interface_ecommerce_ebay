import { CategoryResponse } from "@/types/categories/category.detail";

export interface CreatCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryResponse | null;
}
