import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CategorySummaryResponse } from "@/types/categories/category.summary";
import { UploadFile } from "@/app/(main)/orders/_types/review";
import { CategoryResponse } from "@/types/categories/category.detail";

// --- Types ---
export type OptionConfig = {
  id: string;
  name: string;
  values: string[];
};

export interface VariantData {
  sku: string;
  corePrice: number;
  price: number;
  stockQuantity: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
  optionValueNames: string[];
  imageUrl?: string;
  imageAssetId?: string;
  imageExtension?: string;
  imageProcessing?: boolean;
}

interface ProductState {
  isLoading: boolean;
  activeTab: string;

  // Basic Info
  name: string;
  description: string;
  basePrice: number;
  active: boolean;

  // Category
  categoryId: string;
  categoryPath: string;
  categoryTree: CategorySummaryResponse[];
  categories: CategoryResponse[];
  categoriesLoading: boolean;
  loadingCategoryTree: boolean;
  categoryModalOpen: boolean;
  categorySearchText: string;
  selectedLevel1: CategorySummaryResponse | null;
  selectedLevel2: CategorySummaryResponse | null;
  selectedLevel3: CategorySummaryResponse | null;
  selectedLevel4: CategorySummaryResponse | null;
  secondLevelCategories: CategorySummaryResponse[];
  thirdLevelCategories: CategorySummaryResponse[];
  fourthLevelCategories: CategorySummaryResponse[];

  // Media
  fileList: UploadFile[];
  videoList: UploadFile[];
  uploading: boolean;
  uploadingVideo: boolean;

  // Options
  optionGroups: OptionConfig[];
  addOptionModalOpen: boolean;
  newOptionName: string;

  // Variants
  variants: VariantData[];

  // Form state
  hasUnsavedChanges: boolean;
}

interface ProductActions {
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setBasicInfo: (
    field: keyof Pick<
      ProductState,
      "name" | "description" | "basePrice" | "active"
    >,
    value: any,
  ) => void;

  // Category actions
  setCategoryTree: (tree: CategorySummaryResponse[]) => void;
  setCategories: (categories: CategoryResponse[]) => void;
  setCategoriesLoading: (loading: boolean) => void;
  setLoadingCategoryTree: (loading: boolean) => void;
  setCategoryModalOpen: (open: boolean) => void;
  setCategorySearchText: (text: string) => void;
  selectCategoryLevel: (
    level: 1 | 2 | 3 | 4,
    category: CategorySummaryResponse | null,
  ) => void;
  confirmCategorySelection: () => void;
  setCategoryId: (id: string, path: string) => void;
  setSecondLevelCategories: (categories: CategorySummaryResponse[]) => void;
  setThirdLevelCategories: (categories: CategorySummaryResponse[]) => void;
  setFourthLevelCategories: (categories: CategorySummaryResponse[]) => void;

  // Media actions
  setFileList: (
    files: UploadFile[] | ((prev: UploadFile[]) => UploadFile[]),
  ) => void;
  setVideoList: (
    videos: UploadFile[] | ((prev: UploadFile[]) => UploadFile[]),
  ) => void;
  setUploading: (uploading: boolean) => void;
  setUploadingVideo: (uploading: boolean) => void;
  updateVariantByKey: (
    key: string,
    field: keyof VariantData,
    value: any,
  ) => void;
  // Options actions
  setOptionGroups: (groups: OptionConfig[]) => void;
  setAddOptionModalOpen: (open: boolean) => void;
  setNewOptionName: (name: string) => void;
  addOptionGroup: (name: string) => void;
  removeOptionGroup: (index: number) => void;
  updateOptionGroupName: (index: number, name: string) => void;
  addOptionValue: (groupIndex: number) => void;
  removeOptionValue: (groupIndex: number, valueIndex: number) => void;
  updateOptionValue: (
    groupIndex: number,
    valueIndex: number,
    value: string,
  ) => void;

  // Variants actions
  setVariants: (variants: VariantData[]) => void;
  updateVariant: (index: number, field: keyof VariantData, value: any) => void;
  updateAllVariants: (field: keyof VariantData, value: any) => void;
  regenerateVariants: () => void;

  // Form state
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  reset: () => void; // Clean up store
}

// --- Helpers ---
const MAX_OPTION_VALUES = 20;

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function generateProductPrefix(productName: string): string {
  if (!productName) return "";
  
  const words = productName
    .split(" ")
    .filter(word => word.length > 0)
    .slice(0, 5); // Lấy 5 chữ đầu tiên
  
  return words
    .map(word => {
      const firstChar = word.charAt(0).toUpperCase();
      // Giữ nguyên ký tự Việt Nam, chỉ viết hoa
      return firstChar;
    })
    .join("");
}

function generateVariantSuffix(combo: string[]): string {
  return combo
    .map(val => {
      // Xử lý màu sắc đặc biệt
      const normalized = val.trim().toLowerCase();
      if (normalized === "đỏ") return "ĐỎ";
      if (normalized === "đen") return "ĐE"; 
      if (normalized === "trắng") return "TR";
      if (normalized === "xanh") return "XA";
      if (normalized === "vàng") return "VÀ";
      if (normalized === "nâu") return "NÂ";
      if (normalized === "hồng") return "HỒ";
      if (normalized === "tím") return "TÍ";
      if (normalized === "cam") return "CA";
      if (normalized === "xám") return "XÁ";
      
      // Với các giá trị khác, lấy 2-3 ký tự đầu, giữ nguyên tiếng Việt
      return val.substring(0, 2).toUpperCase();
    })
    .join("-");
}

const createDefaultVariant = (
  basePrice: number,
  optionValues: string[] = [],
): VariantData => ({
  sku: "",
  corePrice: basePrice,
  price: basePrice,
  stockQuantity: 0,
  optionValueNames: optionValues,
});

const cartesianProduct = (arrays: string[][]): string[][] => {
  if (!arrays.length) return [];
  return arrays.reduce<string[][]>(
    (acc, curr) =>
      acc.flatMap((accItem) => curr.map((currItem) => [...accItem, currItem])),
    [[]],
  );
};

const initialState: ProductState = {
  isLoading: false,
  activeTab: "basic",
  name: "",
  description: "",
  basePrice: 0,
  active: true,
  categoryId: "",
  categoryPath: "",
  categoryTree: [],
  categories: [],
  categoriesLoading: false,
  loadingCategoryTree: false,
  categoryModalOpen: false,
  categorySearchText: "",
  selectedLevel1: null,
  selectedLevel2: null,
  selectedLevel3: null,
  selectedLevel4: null,
  secondLevelCategories: [],
  thirdLevelCategories: [],
  fourthLevelCategories: [],
  fileList: [],
  videoList: [],
  uploading: false,
  uploadingVideo: false,
  optionGroups: [],
  addOptionModalOpen: false,
  newOptionName: "",
  variants: [],
  hasUnsavedChanges: false,
};

export const useProductStore = create<ProductState & ProductActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setLoading: (loading) => set({ isLoading: loading }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      setBasicInfo: (field, value) =>
        set((state) => {
          state[field] = value as never;
          if (
            field === "basePrice" &&
            state.optionGroups.length === 0 &&
            state.variants.length === 1
          ) {
            state.variants[0].price = value;
            state.variants[0].corePrice = value;
          }
        }),

      setCategoryTree: (tree) => set({ categoryTree: tree }),
      setCategories: (categories) => set({ categories }),
      setCategoriesLoading: (loading) => set({ categoriesLoading: loading }),
      setLoadingCategoryTree: (loading) =>
        set({ loadingCategoryTree: loading }),
      setCategoryModalOpen: (open) => set({ categoryModalOpen: open }),
      setCategorySearchText: (text) => set({ categorySearchText: text }),
      setCategoryId: (id, path) => set({ categoryId: id, categoryPath: path }),
      setSecondLevelCategories: (categories) =>
        set({ secondLevelCategories: categories }),
      setThirdLevelCategories: (categories) =>
        set({ thirdLevelCategories: categories }),
      setFourthLevelCategories: (categories) =>
        set({ fourthLevelCategories: categories }),

      selectCategoryLevel: (level, category) =>
        set((state) => {
          if (level === 1) {
            state.selectedLevel1 = category;
            state.selectedLevel2 = null;
            state.selectedLevel3 = null;
            state.selectedLevel4 = null;
          } else if (level === 2) {
            state.selectedLevel2 = category;
            state.selectedLevel3 = null;
            state.selectedLevel4 = null;
          } else if (level === 3) {
            state.selectedLevel3 = category;
            state.selectedLevel4 = null;
          } else if (level === 4) {
            state.selectedLevel4 = category;
          }
        }),

      confirmCategorySelection: () =>
        set((state) => {
          const cat =
            state.selectedLevel4 ||
            state.selectedLevel3 ||
            state.selectedLevel2 ||
            state.selectedLevel1;
          if (cat) {
            state.categoryId = cat.id;
            const pathParts = [
              state.selectedLevel1?.name,
              state.selectedLevel2?.name,
              state.selectedLevel3?.name,
              state.selectedLevel4?.name,
            ].filter(Boolean);
            state.categoryPath = pathParts.join(" > ");
          }
        }),

      // --- Media ---
      setFileList: (files) =>
        set((state) => {
          const newFiles =
            typeof files === "function" ? files(state.fileList) : files;
          state.fileList = newFiles as any;
        }),
      setVideoList: (videos) =>
        set((state) => {
          const newVideos =
            typeof videos === "function" ? videos(state.videoList) : videos;
          state.videoList = newVideos as any;
        }),
      setUploading: (uploading) => set({ uploading }),
      setUploadingVideo: (uploading) => set({ uploadingVideo: uploading }),

      // --- Options ---
      setOptionGroups: (groups) => set({ optionGroups: groups }),
      setAddOptionModalOpen: (open) => set({ addOptionModalOpen: open }),
      setNewOptionName: (name) => set({ newOptionName: name }),

      addOptionGroup: (name) =>
        set((state) => {
          state.optionGroups.push({
            id: `opt-${Date.now()}`,
            name,
            values: [""],
          });
          get().regenerateVariants();
        }),
      removeOptionGroup: (index) =>
        set((state) => {
          state.optionGroups.splice(index, 1);
          get().regenerateVariants();
        }),
      updateOptionGroupName: (index, name) =>
        set((state) => {
          state.optionGroups[index].name = name;
        }),
      addOptionValue: (groupIndex) =>
        set((state) => {
          const group = state.optionGroups[groupIndex];
          if (group.values.length < MAX_OPTION_VALUES) group.values.push("");
        }),
      removeOptionValue: (groupIndex, valueIndex) =>
        set((state) => {
          const group = state.optionGroups[groupIndex];
          if (group.values.length === 1) group.values[0] = "";
          else group.values.splice(valueIndex, 1);
          get().regenerateVariants();
        }),
      updateOptionValue: (groupIndex, valueIndex, value) =>
        set((state) => {
          state.optionGroups[groupIndex].values[valueIndex] = value;
          get().regenerateVariants();
        }),

      // --- Variants ---
      setVariants: (variants) => set({ variants }),
      updateVariant: (index, field, value) =>
        set((state) => {
          if (state.variants[index])
            state.variants[index][field] = value as never;
        }),
      updateAllVariants: (field, value) =>
        set((state) => {
          state.variants.forEach((v) => {
            v[field] = value as never;
          });
        }),
      updateVariantByKey: (key: string, field: keyof VariantData, value: any) =>
        set((state) => {
          const index = state.variants.findIndex(
            (v) => v.optionValueNames.join("|") === key,
          );
          if (index !== -1) {
            state.variants[index][field] = value as never;
          }
        }),
      regenerateVariants: () =>
        set((state) => {
          const groups = state.optionGroups;
          const basePrice = state.basePrice;
          const productName = state.name; // Lấy tên sản phẩm từ state

          const existingVariantsMap = new Map(
            state.variants.map((v) => [v.optionValueNames.join("|"), v]),
          );

          const normalizedGroups = groups
            .map((g) => ({
              ...g,
              values: g.values.map((v) => v.trim()).filter(Boolean),
            }))
            .filter((g) => g.name.trim() && g.values.length > 0);

          if (normalizedGroups.length === 0) {
            state.variants = [createDefaultVariant(basePrice)];
            return;
          }

          const combinations = cartesianProduct(
            normalizedGroups.map((g) => g.values),
          );

          state.variants = combinations.map((combo) => {
            const key = combo.join("|");
            const oldVariant = existingVariantsMap.get(key);
            if (oldVariant) {
             
              return oldVariant;
            }

            // Tạo SKU mới theo format: [ProductPrefix]-[VariantSuffix]
            const productPrefix = generateProductPrefix(productName);
            const variantSuffix = generateVariantSuffix(combo);
            const generatedSku = productPrefix && variantSuffix 
              ? `${productPrefix}-${variantSuffix}` 
              : productPrefix || variantSuffix || "VAR";

            return {
              ...createDefaultVariant(basePrice, combo),
              sku: generatedSku,
            };
          });
        }),
      setHasUnsavedChanges: (hasChanges) =>
        set({ hasUnsavedChanges: hasChanges }),

      reset: () => set(initialState),
    })),
  ),
);
