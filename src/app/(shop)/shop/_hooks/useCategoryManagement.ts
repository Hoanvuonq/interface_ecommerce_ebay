import { useState, useEffect } from "react";
import { CategoryService } from "@/app/(main)/category/_service/category.service";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CategorySummaryResponse } from "@/types/categories/category.summary";

export const useCategoryManagement = (
  onError: (message: string) => void,
  onSuccess: (message: string) => void
) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryTree, setCategoryTree] = useState<CategorySummaryResponse[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>("");

  const [secondLevelCategories, setSecondLevelCategories] = useState<
    CategorySummaryResponse[]
  >([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState<
    CategorySummaryResponse[]
  >([]);
  const [fourthLevelCategories, setFourthLevelCategories] = useState<
    CategorySummaryResponse[]
  >([]);

  const [selectedLevel1, setSelectedLevel1] =
    useState<CategorySummaryResponse | null>(null);
  const [selectedLevel2, setSelectedLevel2] =
    useState<CategorySummaryResponse | null>(null);
  const [selectedLevel3, setSelectedLevel3] =
    useState<CategorySummaryResponse | null>(null);
  const [selectedLevel4, setSelectedLevel4] =
    useState<CategorySummaryResponse | null>(null);

  const [categorySearchText, setCategorySearchText] = useState<string>("");
  const [loadingCategoryTree, setLoadingCategoryTree] = useState(false);

  const loadCategoryTree = async () => {
    if (categoryTree.length > 0) {
      return;
    }
    try {
      setLoadingCategoryTree(true);
      const response = await CategoryService.getCategoryTree();
      const tree = response?.data || [];
      setCategoryTree(tree);
    } catch (err: any) {
      console.error("Failed to load category tree:", err);
      onError("Không thể tải danh mục");
    } finally {
      setLoadingCategoryTree(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await CategoryService.getAllParents();


      let categoriesData: CategoryResponse[] = [];

      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray((response as any).data)
      ) {
        categoriesData = (response as any).data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }

      const flattenCategories = (
        categories: CategoryResponse[],
        level = 0
      ): CategoryResponse[] => {
        const result: CategoryResponse[] = [];

        categories.forEach((cat) => {
          if (cat.active) {
            const prefix = "—".repeat(level);
            result.push({
              ...cat,
              name: level > 0 ? `${prefix} ${cat.name}` : cat.name,
            });

            if (cat.children && cat.children.length > 0) {
              result.push(...flattenCategories(cat.children, level + 1));
            }
          }
        });

        return result;
      };

      const flatCategories = flattenCategories(categoriesData);
      setCategories(flatCategories);
    
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      onError(err?.response?.data?.message || "Không thể tải danh mục");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSelectLevel1 = (category: CategorySummaryResponse) => {
    setSelectedLevel1(category);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);

    const children = category.children || [];
    setSecondLevelCategories(children);
    setThirdLevelCategories([]);
    setFourthLevelCategories([]);
  };

  const handleSelectLevel2 = (category: CategorySummaryResponse) => {
    setSelectedLevel2(category);
    setSelectedLevel3(null);
    setSelectedLevel4(null);

    const children = category.children || [];
    setThirdLevelCategories(children);
    setFourthLevelCategories([]);
  };

  const handleSelectLevel3 = (category: CategorySummaryResponse) => {
    setSelectedLevel3(category);
    setSelectedLevel4(null);

    const children = category.children || [];
    setFourthLevelCategories(children);
  };

  const handleConfirmCategory = (
    onConfirm: (categoryId: string, path: string) => void
  ) => {
    const finalCategory =
      selectedLevel4 || selectedLevel3 || selectedLevel2 || selectedLevel1;
    if (!finalCategory) {
      onError("Vui lòng chọn ngành hàng");
      return;
    }

    if (finalCategory.children && finalCategory.children.length > 0) {
      onError(
        "Vui lòng chọn đến cấp cuối cùng của ngành hàng (danh mục không có danh mục con)"
      );
      return;
    }

    const pathParts: string[] = [];
    if (selectedLevel1) pathParts.push(selectedLevel1.name);
    if (selectedLevel2) pathParts.push(selectedLevel2.name);
    if (selectedLevel3) pathParts.push(selectedLevel3.name);
    if (selectedLevel4) pathParts.push(selectedLevel4.name);

    const path = pathParts.join(" > ");
    onConfirm(finalCategory.id, path);
    setCategoryModalOpen(false);
    onSuccess("Đã chọn ngành hàng: " + path);
  };

  const handleOpenCategoryModal = () => {
    setCategoryModalOpen(true);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setSecondLevelCategories([]);
    setThirdLevelCategories([]);
    setFourthLevelCategories([]);
    setCategorySearchText("");
  };

  const findCategoryPath = (
    tree: CategorySummaryResponse[],
    targetId: string,
    path: string[] = []
  ): string[] | null => {
    for (const cat of tree) {
      const currentPath = [...path, cat.name];
      if (cat.id === targetId) {
        return currentPath;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryPath(cat.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const updateCategoryPath = (categoryId: string) => {
    if (!categoryId) {
      setSelectedCategoryPath("");
      return;
    }

    if (categoryTree.length > 0) {
      const path = findCategoryPath(categoryTree, String(categoryId));
      if (path && path.length > 0) {
        setSelectedCategoryPath(path.join(" > "));
        return;
      }
    }

    if (categories.length > 0) {
      const selectedCat = categories.find((c) => c.id === String(categoryId));
      if (selectedCat) {
        const cleanName = selectedCat.name.replace(/^—+\s*/, "");
        setSelectedCategoryPath(cleanName);
      } else {
        setSelectedCategoryPath("");
      }
    }
  };

  const filterCategories = (
    cats: CategorySummaryResponse[],
    searchText: string
  ) => {
    if (!searchText.trim()) return cats;
    const lowerSearch = searchText.toLowerCase();
    return cats.filter((cat) => cat.name.toLowerCase().includes(lowerSearch));
  };

  return {
    categories,
    categoriesLoading,
    categoryTree,
    categoryModalOpen,
    selectedCategoryPath,
    secondLevelCategories,
    thirdLevelCategories,
    fourthLevelCategories,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedLevel4,
    categorySearchText,
    loadingCategoryTree,
    setCategories,
    setCategoryModalOpen,
    setSelectedCategoryPath,
    setSecondLevelCategories,
    setThirdLevelCategories,
    setFourthLevelCategories,
    setCategorySearchText,
    loadCategoryTree,
    fetchCategories,
    handleSelectLevel1,
    handleSelectLevel2,
    handleSelectLevel3,
    setSelectedLevel4,
    handleConfirmCategory,
    handleOpenCategoryModal,
    findCategoryPath,
    updateCategoryPath,
    filterCategories,
  };
};
