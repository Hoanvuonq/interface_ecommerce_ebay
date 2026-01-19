import { create } from "zustand";
import {
  CampaignResponse,
  CampaignSlotProductResponse,
  CampaignSlotResponse,
} from "../campaigns/_types/campaign.type";
import {
  ProductResponse,
  ShopCampaignDetailResponse,
} from "../campaigns/_types/shop.campaign.types";

type VariantConfig = {
  selected: boolean;
  salePrice?: number;
  discountPercent: number;
  stockLimit: number;
};

interface CampaignStore {
  authState: any;
  setAuthState: (v: any) => void;
  availableCampaigns: CampaignResponse[];
  setAvailableCampaigns: (v: CampaignResponse[]) => void;
  myRegistrations: CampaignSlotProductResponse[];
  setMyRegistrations: (v: CampaignSlotProductResponse[]) => void;
  myCampaigns: CampaignResponse[];
  setMyCampaigns: (v: CampaignResponse[]) => void;
  selectedCampaign: CampaignResponse | ShopCampaignDetailResponse | null;
  setSelectedCampaign: (
    v: CampaignResponse | ShopCampaignDetailResponse | null,
  ) => void;
  selectedCampaignProducts: CampaignSlotProductResponse[];
  setSelectedCampaignProducts: (v: CampaignSlotProductResponse[]) => void;
  campaignSlots: CampaignSlotResponse[];
  setCampaignSlots: (v: CampaignSlotResponse[]) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  activeTab: "join" | "my-registrations" | "my-shop-sales";
  setActiveTab: (v: "join" | "my-registrations" | "my-shop-sales") => void;
  showRegisterModal: boolean;
  setShowRegisterModal: (v: boolean) => void;
  showCreateModal: "simple" | "addProduct" | null;
  setShowCreateModal: (v: "simple" | "addProduct" | null) => void;
  selectedSlot: CampaignSlotResponse | null;
  setSelectedSlot: (v: CampaignSlotResponse | null) => void;
  targetCampaignId: string | null;
  setTargetCampaignId: (v: string | null) => void;
  createForm: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    recurringStartTime: string;
    recurringEndTime: string;
  };
  setCreateForm: (v: any) => void;
  createStep: "INFO" | "PRODUCTS" | "CONFIRM";
  setCreateStep: (v: "INFO" | "PRODUCTS" | "CONFIRM") => void;
  myProducts: ProductResponse[];
  setMyProducts: (v: ProductResponse[]) => void;
  productsLoading: boolean;
  setProductsLoading: (v: boolean) => void;
  selectedVariants: { [variantId: string]: VariantConfig };
  setSelectedVariants: (v: { [variantId: string]: VariantConfig }) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  authState: null,
  setAuthState: (v) => set({ authState: v }),

  availableCampaigns: [],
  setAvailableCampaigns: (v) =>
    set((state) =>
      state.availableCampaigns === v ? state : { availableCampaigns: v },
    ),

  myRegistrations: [],
  setMyRegistrations: (v) =>
    set((state) =>
      state.myRegistrations === v ? state : { myRegistrations: v },
    ),

  myCampaigns: [],
  setMyCampaigns: (v) =>
    set((state) => (state.myCampaigns === v ? state : { myCampaigns: v })),

  selectedCampaign: null,
  setSelectedCampaign: (v) => set({ selectedCampaign: v }),
  selectedCampaignProducts: [],
  setSelectedCampaignProducts: (v) => set({ selectedCampaignProducts: v }),
  campaignSlots: [],
  setCampaignSlots: (v) => set({ campaignSlots: v }),

  loading: false,
  setLoading: (v) => set({ loading: v }),
  activeTab: "join",
  setActiveTab: (v) => set({ activeTab: v }),
  showRegisterModal: false,
  setShowRegisterModal: (v) => set({ showRegisterModal: v }),
  showCreateModal: null,
  setShowCreateModal: (v) => set({ showCreateModal: v }),
  selectedSlot: null,
  setSelectedSlot: (v) => set({ selectedSlot: v }),
  targetCampaignId: null,
  setTargetCampaignId: (v) => set({ targetCampaignId: v }),

  createForm: {
    name: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    isRecurring: false,
    recurringStartTime: "09:00",
    recurringEndTime: "21:00",
  },
  setCreateForm: (v) =>
    set((state) => ({
      createForm: { ...state.createForm, ...v },
    })),

  createStep: "INFO",
  setCreateStep: (v) => set({ createStep: v }),
  myProducts: [],
  setMyProducts: (v) =>
    set((state) => (state.myProducts === v ? state : { myProducts: v })),
  productsLoading: false,
  setProductsLoading: (v) => set({ productsLoading: v }),
  selectedVariants: {},
  setSelectedVariants: (v) => set({ selectedVariants: v }),
}));
