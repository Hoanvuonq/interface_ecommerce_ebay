import { create } from "zustand";
import { CreateCategoryRequest } from "@/types/categories/category.create";

interface CategoryFormState {
  formData: CreateCategoryRequest;
  slug: string;
  localPreview: string | null;
  errors: Record<string, string>;
  setLocalPreview: (url: string | null) => void;
  setFormField: (field: string, value: any) => void;
  setSlug: (slug: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
}

const initialFormData: CreateCategoryRequest = {
  name: "",
  description: "",
  parentId: undefined,
  active: true,
  defaultShippingRestrictions: {
    restrictionType: "NONE",
    countryRestrictionType: "ALLOW_ONLY",
    restrictedCountries: [],
    restrictedRegions: [],
  },
};

export const useCategoryFormStore = create<CategoryFormState>((set) => ({
  formData: initialFormData,
  slug: "",
  errors: {},
  setFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  localPreview: null,
  setLocalPreview: (url) => set({ localPreview: url }),
  resetForm: () =>
    set({
      formData: initialFormData,
      slug: "",
      localPreview: null,
      errors: {},
    }),
  setSlug: (slug) => set({ slug }),
  setErrors: (errors) => set({ errors }),
}));
