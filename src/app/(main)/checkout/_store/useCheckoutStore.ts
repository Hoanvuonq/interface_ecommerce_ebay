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

      // updateShopVouchers: (shopId: string, codes: any) => {
      //   const { request } = get();
      //   if (!request) return;

      //   const updatedShops = request.shops.map((s: any) => {
      //     if (s.shopId !== shopId) return s; // Shop vouchers

      //     const newVouchers = [];
      //     if (codes.order !== undefined) {
      //       if (codes.order !== null) newVouchers.push(codes.order);
      //     } else if (s.vouchers?.[0]) {
      //       newVouchers.push(s.vouchers[0]);
      //     }
      //     if (codes.shipping !== undefined) {
      //       if (codes.shipping !== null) newVouchers.push(codes.shipping);
      //     } else if (s.vouchers?.[1]) {
      //       newVouchers.push(s.vouchers[1]);
      //     } // Platform/global vouchers

      //     const newGlobalVouchers = [];
      //     if (codes.platformOrder !== undefined) {
      //       if (codes.platformOrder !== null)
      //         newGlobalVouchers.push(codes.platformOrder);
      //     } else if (s.globalVouchers?.[0]) {
      //       newGlobalVouchers.push(s.globalVouchers[0]);
      //     }
      //     if (codes.platformShipping !== undefined) {
      //       if (codes.platformShipping !== null)
      //         newGlobalVouchers.push(codes.platformShipping);
      //     } else if (s.globalVouchers?.[1]) {
      //       newGlobalVouchers.push(s.globalVouchers[1]);
      //     }
      updateShopVouchers: (shopId: string, codes: any) => {
        const { request } = get();
        if (!request) return;

        const updatedShops = request.shops.map((s: any) => {
          if (s.shopId !== shopId) return s; // Shop vouchers

          const newVouchers = [];
          if (codes.order !== undefined) {
            if (codes.order !== null) newVouchers.push(codes.order);
          } else if (s.vouchers?.[0]) {
            newVouchers.push(s.vouchers[0]);
          }
          if (codes.shipping !== undefined) {
            if (codes.shipping !== null) newVouchers.push(codes.shipping);
          } else if (s.vouchers?.[1]) {
            newVouchers.push(s.vouchers[1]);
          }

          return {
            ...s,
            vouchers: newVouchers,
          };
        });
        set({ request: { ...request, shops: updatedShops } });
      },

      updateGlobalVouchers: (codes: any) => {
        const { request } = get();
        if (!request) return;
        // Platform/global vouchers
        const newGlobalVouchers = [];
        if (codes.platformOrder !== undefined) {
          if (codes.platformOrder !== null)
            newGlobalVouchers.push(codes.platformOrder);
        }
        if (codes.platformShipping !== undefined) {
          if (codes.platformShipping !== null)
            newGlobalVouchers.push(codes.platformShipping);
        }
        set({ request: { ...request, globalVouchers: newGlobalVouchers } });
      },
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: any) => ({ request: state.request }),
    },
  ),
);
