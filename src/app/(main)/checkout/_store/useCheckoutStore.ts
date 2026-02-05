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

      // useCheckoutStore.ts
      updateShopVouchers: (shopId: string, codes: any) => {
        const { request } = get();
        if (!request) return;

        const updatedShops = request.shops.map((s: any) => {
          if (s.shopId !== shopId) return s;

          // Giữ lại giá trị cũ nếu codes truyền vào không có field đó
          const newVouchers = [
            codes.order !== undefined ? codes.order : s.vouchers?.[0] || null,
            codes.shipping !== undefined
              ? codes.shipping
              : s.vouchers?.[1] || null,
          ].filter((v) => v !== null);

          const newGlobalVouchers = [
            codes.platformOrder !== undefined
              ? codes.platformOrder
              : s.globalVouchers?.[0] || null,
            codes.platformShipping !== undefined
              ? codes.platformShipping
              : s.globalVouchers?.[1] || null,
          ].filter((v) => v !== null);

          return {
            ...s,
            vouchers: newVouchers,
            globalVouchers: newGlobalVouchers,
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

          const validV = _.get(freshShop, "voucher.valid", []);
          const serverShopV = validV
            .filter((v: any) => v.type === "SHOP")
            .map((v: any) => v.code);
          const serverGlobalV = validV
            .filter((v: any) => v.type === "PLATFORM")
            .map((v: any) => v.code);

          return {
            ...s,
            vouchers: s.vouchers?.length > 0 ? s.vouchers : serverShopV,
            globalVouchers:
              s.globalVouchers?.length > 0 ? s.globalVouchers : serverGlobalV,

            serviceCode:
              freshShop.shipping?.selectedCodes?.serviceCode || s.serviceCode,
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
