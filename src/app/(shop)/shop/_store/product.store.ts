import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CategorySummaryResponse } from "@/types/categories/category.summary";
import { UploadFile } from '@/app/(main)/orders/_types/review';

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
  selectedLevel1: CategorySummaryResponse | null;
  selectedLevel2: CategorySummaryResponse | null;
  selectedLevel3: CategorySummaryResponse | null;
  selectedLevel4: CategorySummaryResponse | null;
  
  // Media
  fileList: UploadFile[];
  videoList: UploadFile[];

  // Variants
  optionGroups: OptionConfig[];
  variants: VariantData[];
}

interface ProductActions {
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setBasicInfo: (field: keyof Pick<ProductState, 'name' | 'description' | 'basePrice' | 'active'>, value: any) => void;
  
  // Category
  setCategoryTree: (tree: CategorySummaryResponse[]) => void;
  selectCategoryLevel: (level: 1 | 2 | 3 | 4, category: CategorySummaryResponse | null) => void;
  confirmCategorySelection: () => void;
  setCategoryId: (id: string, path: string) => void;

  // Media
  setFileList: (files: UploadFile[] | ((prev: UploadFile[]) => UploadFile[])) => void;
  setVideoList: (videos: UploadFile[] | ((prev: UploadFile[]) => UploadFile[])) => void;

  // Options
  addOptionGroup: (name: string) => void;
  removeOptionGroup: (index: number) => void;
  updateOptionGroupName: (index: number, name: string) => void;
  addOptionValue: (groupIndex: number) => void;
  removeOptionValue: (groupIndex: number, valueIndex: number) => void;
  updateOptionValue: (groupIndex: number, valueIndex: number, value: string) => void;

  // Variants
  setVariants: (variants: VariantData[]) => void;
  updateVariant: (index: number, field: keyof VariantData, value: any) => void;
  updateAllVariants: (field: keyof VariantData, value: any) => void;
  regenerateVariants: () => void;
  
  reset: () => void; // Clean up store
}

// --- Helpers ---
const MAX_OPTION_VALUES = 20;

const createDefaultVariant = (basePrice: number, optionValues: string[] = []): VariantData => ({
  sku: "",
  corePrice: basePrice,
  price: basePrice,
  stockQuantity: 0,
  optionValueNames: optionValues,
});

const cartesianProduct = (arrays: string[][]): string[][] => {
  if (!arrays.length) return [];
  return arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((accItem) => curr.map((currItem) => [...accItem, currItem])),
    [[]]
  );
};

const initialState: ProductState = {
  isLoading: false,
  activeTab: 'basic',
  name: "",
  description: "",
  basePrice: 0,
  active: true,
  categoryId: "",
  categoryPath: "",
  categoryTree: [],
  selectedLevel1: null,
  selectedLevel2: null,
  selectedLevel3: null,
  selectedLevel4: null,
  fileList: [],
  videoList: [],
  optionGroups: [],
  variants: [],
};

export const useProductStore = create<ProductState & ProductActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setLoading: (loading) => set({ isLoading: loading }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      setBasicInfo: (field, value) => set((state) => {
        state[field] = value as never;
        // Nếu thay đổi giá gốc và chưa có variants phức tạp, update luôn giá variants
        if (field === 'basePrice' && state.optionGroups.length === 0 && state.variants.length === 1) {
             state.variants[0].price = value;
             state.variants[0].corePrice = value;
        }
      }),

      // --- Category ---
      setCategoryTree: (tree) => set({ categoryTree: tree }),
      setCategoryId: (id, path) => set({ categoryId: id, categoryPath: path }),
      selectCategoryLevel: (level, category) => set((state) => {
        if (level === 1) { state.selectedLevel1 = category; state.selectedLevel2 = null; state.selectedLevel3 = null; state.selectedLevel4 = null; }
        else if (level === 2) { state.selectedLevel2 = category; state.selectedLevel3 = null; state.selectedLevel4 = null; }
        else if (level === 3) { state.selectedLevel3 = category; state.selectedLevel4 = null; }
        else if (level === 4) { state.selectedLevel4 = category; }
      }),
      confirmCategorySelection: () => set((state) => {
        const cat = state.selectedLevel4 || state.selectedLevel3 || state.selectedLevel2 || state.selectedLevel1;
        if (cat) {
            state.categoryId = cat.id;
            const pathParts = [state.selectedLevel1?.name, state.selectedLevel2?.name, state.selectedLevel3?.name, state.selectedLevel4?.name].filter(Boolean);
            state.categoryPath = pathParts.join(' > ');
        }
      }),

      // --- Media ---
      setFileList: (files) => set((state) => {
        const newFiles = typeof files === 'function' ? files(state.fileList) : files;
        state.fileList = newFiles as any;
      }),
      setVideoList: (videos) => set((state) => {
        const newVideos = typeof videos === 'function' ? videos(state.videoList) : videos;
        state.videoList = newVideos as any;
      }),

      // --- Options ---
      addOptionGroup: (name) => set((state) => {
         state.optionGroups.push({ id: `opt-${Date.now()}`, name, values: [""] });
         get().regenerateVariants();
      }),
      removeOptionGroup: (index) => set((state) => {
         state.optionGroups.splice(index, 1);
         get().regenerateVariants();
      }),
      updateOptionGroupName: (index, name) => set((state) => {
         state.optionGroups[index].name = name;
         // Tên nhóm không ảnh hưởng cấu trúc variants nên ko cần regenerate, chỉ cần UI update
      }),
      addOptionValue: (groupIndex) => set((state) => {
         const group = state.optionGroups[groupIndex];
         if (group.values.length < MAX_OPTION_VALUES) group.values.push("");
      }),
      removeOptionValue: (groupIndex, valueIndex) => set((state) => {
         const group = state.optionGroups[groupIndex];
         if (group.values.length === 1) group.values[0] = "";
         else group.values.splice(valueIndex, 1);
         get().regenerateVariants();
      }),
      updateOptionValue: (groupIndex, valueIndex, value) => set((state) => {
         state.optionGroups[groupIndex].values[valueIndex] = value;
         get().regenerateVariants();
      }),

      // --- Variants ---
      setVariants: (variants) => set({ variants }),
      updateVariant: (index, field, value) => set((state) => {
         if (state.variants[index]) state.variants[index][field] = value as never;
      }),
      updateAllVariants: (field, value) => set((state) => {
         state.variants.forEach(v => { v[field] = value as never; });
      }),
      regenerateVariants: () => set((state) => {
         const groups = state.optionGroups;
         const basePrice = state.basePrice;
         const currentVariants = state.variants;

         const normalizedGroups = groups
             .map(g => ({ ...g, values: g.values.map(v => v.trim()).filter(Boolean) }))
             .filter(g => g.name.trim() && g.values.length > 0);

         if (normalizedGroups.length === 0) {
             if (currentVariants.length !== 1 || currentVariants[0].optionValueNames.length > 0) {
                 state.variants = [createDefaultVariant(basePrice)];
             }
             return;
         }

         const combinations = cartesianProduct(normalizedGroups.map(g => g.values));
         if (combinations.length === 0) {
             state.variants = [];
             return;
         }

         const newVariants = combinations.map(combo => {
             const existingMatch = currentVariants.find(v => 
                 v.optionValueNames.length === combo.length &&
                 combo.every((val, idx) => v.optionValueNames[idx] === val)
             );
             if (existingMatch) return existingMatch;
             
             const skuSuffix = combo.map(val => val.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')).join('-');
             return { ...createDefaultVariant(basePrice, combo), sku: skuSuffix ? `SKU-${skuSuffix}` : "" };
         });
         state.variants = newVariants;
      }),

      reset: () => set(initialState),
    }))
  )
);