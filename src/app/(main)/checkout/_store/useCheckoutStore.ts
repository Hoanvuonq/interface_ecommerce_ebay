import { create } from "zustand";
import { Province, Ward } from "vietnam-address-database";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
import _ from "lodash";

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
    idMap: Record<string, string>;
    fullMap: Record<string, ShopAddressInfo>;
    mainProvince: string;
  }) => void;
  setLoadingAddress: (val: boolean) => void;
  updateRequestPatch: (patch: any) => void;
  updateShopVouchers: (
    shopId: string,
    vouchers: {
      order?: string;
      shipping?: string;
      platformOrder?: string;
      platformShipping?: string;
    },
  ) => void;
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

  setPreview: (nextPreview) => {
    if (_.isEqual(get().preview, nextPreview)) return;
    set({ preview: nextPreview });
  },
  initRequest: (initialData: any) => {
    const current = get().request;
    if (!current || !current.addressId) {
      set({ request: initialData });
    }
  },

  setRequest: (nextRequest) => {
    set({ request: nextRequest });
    if (nextRequest) {
      sessionStorage.setItem("checkoutRequest", JSON.stringify(nextRequest));
    }
  },

  setAddressMasterData: (p, w) => {
    const { provincesData, allWardsData } = get();

    if (provincesData.length === p.length && allWardsData.length === w.length) {
      return;
    }

    set({
      provincesData: p,
      allWardsData: w,
    });
  },

  setBuyerData: (info, addresses) => {
    if (_.isEqual(get().savedAddresses, addresses)) return;
    set({
      buyerInfo: info,
      savedAddresses: addresses,
    });
  },

  setShopAddressData: (data) =>
    set({
      shopAddressIdMap: data.idMap,
      shopFullAddressMap: data.fullMap,
      shopProvince: data.mainProvince,
    }),

  setLoadingAddress: (val) => set({ loadingAddress: val }),

  updateRequestPatch: (patch) => {
    const currentRequest = get().request;
    const nextRequest = currentRequest
      ? { ...currentRequest, ...patch }
      : patch;

    if (_.isEqual(currentRequest, nextRequest)) return;
    set({ request: nextRequest });
  },

  updateShopVouchers: (
    shopId,
    { order, shipping, platformOrder, platformShipping },
  ) => {
    const state = get();
    if (!state.request) return;

    const updatedShops = state.request.shops.map((s: any) => {
      if (s.shopId === shopId) {
        const vouchers = [order, shipping].filter(
          (code): code is string => !!code,
        );
        const globalVouchers = [platformOrder, platformShipping].filter(
          (code): code is string => !!code,
        );
        return { ...s, vouchers, globalVouchers };
      }
      return s;
    });

    const newRequest = { ...state.request, shops: updatedShops };

    if (_.isEqual(state.request, newRequest)) return;

    try {
      sessionStorage.setItem("checkoutRequest", JSON.stringify(newRequest));
    } catch (e) {
      console.error("Storage error", e);
    }

    set({ request: newRequest });
  },

  getValidVouchersByShop: (shopId) => {
    const preview = get().preview;
    const shops = _.get(preview, "data.shops", []);
    const shop = _.find(shops, { shopId });

    return _.chain(shop?.voucherResult?.discountDetails)
      .filter({ valid: true })
      .map("voucherCode")
      .value();
  },

  updateRequestFromPreview: (previewData: any) => {
    const currentRequest = get().request;
    const data = previewData?.data || previewData;

    if (!currentRequest || !data) return;

    const shopsFromBackend = _.get(data, "shops", []);
    const backendGlobal = _.get(data, "summary.globalVouchers", []) || [];
    const updatedShops = currentRequest.shops.map((s: any) => {
      const freshShop = _.find(shopsFromBackend, { shopId: s.shopId });
      const validVouchers = _.get(freshShop, "voucherResult.validVouchers", []);

      return {
        ...s,
        vouchers: validVouchers,
      };
    });

    const nextRequest = {
      ...currentRequest,
      shops: updatedShops,
      globalVouchers:
        backendGlobal.length > 0
          ? backendGlobal
          : currentRequest.globalVouchers,
    };

    set({ request: nextRequest });
  },
}));
