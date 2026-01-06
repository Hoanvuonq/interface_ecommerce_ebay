import { create } from 'zustand';
import { Province, Ward } from "vietnam-address-database";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
import _ from "lodash";

interface ShopAddressInfo {
  province: string;
  district: string;
  ward: string;
}

interface CheckoutState {
  preview: any; // Dữ liệu trả về từ API Preview (có validVouchers, shippingFee...)
  request: any; // Payload gửi lên API (addressId, shops, globalVouchers...)
  loading: boolean;
  buyerInfo: any;
  savedAddresses: BuyerAddressResponse[];
  
  shopAddressIdMap: Record<string, string>;
  shopFullAddressMap: Record<string, ShopAddressInfo>;
  shopProvince: string | null;
  provincesData: Province[];
  allWardsData: Ward[];
  loadingAddress: boolean;

  // Actions
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
  
  // Helper chuẩn để cập nhật từng phần của Request
  updateRequestPatch: (patch: any) => void;

  // Cập nhật Voucher cho một shop cụ thể (Dùng cho Modal chọn voucher)
  updateShopVouchers: (shopId: string, vouchers: { order?: string, shipping?: string }) => void;
  
  // Lấy danh sách voucher đang thực sự "Valid" từ Preview cho một shop
  getValidVouchersByShop: (shopId: string) => string[];
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
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

 updateShopVouchers: (shopId, { order, shipping }) => set((state) => {
    if (!state.request) return state;

    const updatedShops = state.request.shops.map((s: any) => {
      if (s.shopId === shopId) {
        // Backend yêu cầu mảng vouchers chứa các code chuỗi
        const newVouchers = [order, shipping].filter((code): code is string => !!code);
        return { ...s, vouchers: newVouchers };
      }
      return s;
    });

    const newRequest = { ...state.request, shops: updatedShops };
    
    // Lưu vào sessionStorage để tránh mất dữ liệu khi F5
    sessionStorage.setItem("checkoutRequest", JSON.stringify(newRequest));

    return { request: newRequest };
  }),

  // CHUẨN: Selector lấy mã voucher valid từ Preview
  getValidVouchersByShop: (shopId) => {
    const preview = get().preview;
    const shops = _.get(preview, "data.shops", []);
    const shop = _.find(shops, { shopId });
    
    return _.chain(shop?.voucherResult?.discountDetails)
      .filter({ valid: true }) // Chỉ lấy cái nào valid: true
      .map('voucherCode')
      .value();
  }
}));