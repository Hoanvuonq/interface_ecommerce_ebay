export interface ShopOnboardingContextType {
  current: number;
  setCurrent: (step: number) => void;
  formData: any;
  updateFormField: (fieldOrValues: any, value?: any) => void;
  loading: boolean;
  uploadingImage: boolean;
  initialLoading: boolean;
  rejectedReasons: Record<string, string>;
  isUpdateMode: boolean;
  saveToStorage: (step: number, values: any) => Promise<void>;
  handleFinish: () => Promise<void>;
  country: any | null;
  provinces: any[];
  wards: any[];
  fetchWardsByProvince: (provinceCode: string) => Promise<void>;
}
