export interface SelectedVariantConfig {
  selected: boolean;
  salePrice?: number;
  discountPercent: number;
  stockLimit: number;
}

export interface CampaignFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerAssetId?: string;
  thumbnailAssetId?: string;
  bannerPreview?: string;
  thumbnailPreview?: string;
  displayPriority?: number;
}

export interface IStepInfo {
  form: CampaignFormData;
  setForm: (form: CampaignFormData) => void;
}

export interface ICreateCampaignModal {
  isOpen: boolean;
  onClose: () => void;
  step: "INFO" | "PRODUCTS" | "CONFIRM";
  setStep: (step: "INFO" | "PRODUCTS" | "CONFIRM") => void;
  form: CampaignFormData;
  setForm: (form: any) => void;
  loading: boolean;
  productsLoading: boolean;
  myProducts: any[];
  selectedVariants: Record<string, SelectedVariantConfig>;
  setSelectedVariants: React.Dispatch<
    React.SetStateAction<Record<string, SelectedVariantConfig>>
  >;
  onRefreshProducts: () => void;
  onSubmit: () => void;
}
