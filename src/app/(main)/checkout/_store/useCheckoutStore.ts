import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import _ from "lodash";

export const useCheckoutStore = create<any>()(
  persist(
    (set, get) => ({
      preview: null,
      request: null,
      loading: false,
      isSyncing: false,
      savedAddresses: [],
      provincesData: [],
      allWardsData: [],

      setLoading: (val: boolean) => set({ loading: val }),
      setIsSyncing: (val: boolean) => set({ isSyncing: val }),
      setPreview: (preview: any) => set({ preview }),
      setRequest: (request: any) => set({ request }),
      setBuyerData: (info: any, addresses: any[]) =>
        set({ savedAddresses: addresses }),
      setAddressMasterData: (p: any[], w: any[]) =>
        set({ provincesData: p, allWardsData: w }),

      updateShopVouchers: (shopId: string, codes: any) => {
        const { request } = get();
        if (!request) return;

        const updatedShops = request.shops.map((s: any) => {
          if (s.shopId !== shopId) return s;
          const currentV = s.vouchers || [];
          const currentG = s.globalVouchers || [];

          return {
            ...s,

            vouchers: _.compact([
              codes.order !== undefined ? codes.order : currentV[0],
              codes.shipping !== undefined ? codes.shipping : currentV[1],
            ]),
            globalVouchers: _.compact([
              codes.platformOrder !== undefined
                ? codes.platformOrder
                : currentG[0],
              codes.platformShipping !== undefined
                ? codes.platformShipping
                : currentG[1],
            ]),
          };
        });
        set({ request: { ...request, shops: updatedShops } });
      },

      syncRequestFromPreview: (previewData: any) => {
        const { request } = get();
        const data = previewData?.data || previewData;
        if (!request || !data) return;

        const updatedShops = request.shops.map((s: any) => {
          const freshShop = _.find(data.shops, { shopId: s.shopId });
          if (!freshShop) return s;

          return {
            ...s,
            serviceCode: Number(
              freshShop.selectedShippingMethod || s.serviceCode,
            ),
            shippingFee: _.get(freshShop, "summary.shippingFee", 0),
          };
        });

        set({ request: { ...request, shops: updatedShops } });
      },
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: any) => ({ request: state.request }),
    },
  ),
);
