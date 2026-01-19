import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useProductStore } from "../_stores/product.store";
import { CategoryService } from "@/app/(main)/category/_service/category.service";
import { CategoryResponse } from "@/types/categories/category.detail";

export const useCategoryLogic = () => {
  const { success, warning, error } = useToast();
  const {
    categoryTree,
    setCategoryTree,
    setCategoryId,
    categoryId,
    confirmCategorySelection,
  } = useProductStore();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [loadingCategoryTree, setLoadingCategoryTree] = useState(false);

  useEffect(() => {
    const loadCategoryTree = async () => {
      if (categoryTree.length > 0) return;
      try {
        setLoadingCategoryTree(true);
        const response = await CategoryService.getCategoryTree();
        const tree = response?.data || [];
        setCategoryTree(tree);
      } catch (err: any) {
        console.error("Failed to load category tree:", err);
        error("Không thể tải danh mục");
      } finally {
        setLoadingCategoryTree(false);
      }
    };
    loadCategoryTree();
  }, []);

  const handleOpenCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  const handleConfirmCategory = () => {
    const storeState = useProductStore.getState();
    const finalCategory =
      storeState.selectedLevel4 ||
      storeState.selectedLevel3 ||
      storeState.selectedLevel2 ||
      storeState.selectedLevel1;

    if (!finalCategory) {
      warning("Vui lòng chọn ngành hàng");
      return;
    }

    if (finalCategory.children && finalCategory.children.length > 0) {
      warning("Vui lòng chọn đến cấp cuối cùng của ngành hàng");
      return;
    }

    confirmCategorySelection();
    setCategoryModalOpen(false);
    success("Đã chọn ngành hàng thành công");
  };

  return {
    categoryModalOpen,
    setCategoryModalOpen,
    loadingCategoryTree,
    handleOpenCategoryModal,
    handleConfirmCategory,
  };
};
