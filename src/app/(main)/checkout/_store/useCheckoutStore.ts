import { create } from 'zustand';
import { Province, Ward } from "vietnam-address-database";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";

interface ShopAddressInfo {
  province: string;
  district: string;
  ward: string;
}

interface CheckoutState {
  preview: any;
  request: any;
  loading: boolean;
  buyerInfo: any;
  savedAddresses: BuyerAddressResponse[];
  
  shopAddressIdMap: Record<string, string>;
  shopFullAddressMap: Record<string, ShopAddressInfo>;
  shopProvince: string | null;
  provincesData: Province[];
  allWardsData: Ward[];
  loadingAddress: boolean;

  setLoading: (val: boolean) => void;
  setPreview: (preview: any) => void;
  setRequest: (request: any) => void;
  setAddressMasterData: (p: Province[], w: Ward[]) => void;
  setBuyerData: (info: any, addresses: BuyerAddressResponse[]) => void;
  setShopAddressData: (data: { 
    idMap: Record<string, string>, 
    fullMap: Record<string, ShopAddressInfo>, 
    mainProvince: string 
  }) => void;
  setLoadingAddress: (val: boolean) => void;
  
  updateRequestPatch: (patch: any) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  // --- States ---
  preview: null,
  request: null,
  loading: false,
  buyerInfo: null,
  savedAddresses: [],
  shopAddressIdMap: {},
  shopFullAddressMap: {},
  shopProvince: null,
  provincesData: [],
  allWardsData: [],
  loadingAddress: false,

  // --- Actions ---
  setLoading: (val) => set({ loading: val }),
  
  setPreview: (preview) => set({ preview }),
  
  setRequest: (request) => set({ request }),
  
  setAddressMasterData: (p, w) => set({ 
    provincesData: p, 
    allWardsData: w 
  }),
  
  setBuyerData: (info, addresses) => set({ 
    buyerInfo: info, 
    savedAddresses: addresses 
  }),
  
  setShopAddressData: (data) => set({
    shopAddressIdMap: data.idMap,
    shopFullAddressMap: data.fullMap,
    shopProvince: data.mainProvince
  }),
  
  setLoadingAddress: (val) => set({ loadingAddress: val }),
  
  updateRequestPatch: (patch) => set((state) => ({
    request: state.request ? { ...state.request, ...patch } : patch
  })),
}));