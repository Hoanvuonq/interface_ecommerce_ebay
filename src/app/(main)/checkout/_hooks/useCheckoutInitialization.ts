import { buyerService } from "@/services/buyer/buyer.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useRef } from "react";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";

export const useCheckoutInitialization = (initialPreview: any) => {
  const store = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const hasInitialized = useRef(false);
  const user = getStoredUserDetail();

  const { data: buyerData, isSuccess } = useQuery({
    queryKey: ["buyer-detail", user?.buyerId],
    queryFn: () => buyerService.getBuyerDetail(user?.buyerId!),
    enabled: !!user?.buyerId,
  });

  useEffect(() => {
    const runInit = async () => {
      if (hasInitialized.current || !isSuccess || !buyerData) return;

      const addresses = _.get(buyerData, "addresses") || [];
      const defaultAddr =
        _.find(addresses, { isDefault: true }) || addresses[0];

      if (!defaultAddr) {
        store.setBuyerData(buyerData, []);
        hasInitialized.current = true;
        return;
      }

      hasInitialized.current = true;
      store.setBuyerData(
        buyerData,
        _.orderBy(addresses, ["isDefault"], ["desc"])
      );

      const initPayload = {
        addressId: defaultAddr.addressId,
        shops:
          initialPreview?.shops?.map((s: any) => ({
            shopId: s.shopId,
            itemIds: s.items.map((i: any) => i.itemId || i.id),
            serviceCode: 400021,

            vouchers: [],
          })) || [],
        globalVouchers: [],
      };
      // ------------------------------------

      store.setRequest(initPayload);

      try {
        const result = await syncPreview(initPayload);
        const data = result?.data || result;

        const finalRequest = {
          ...initPayload,
          globalVouchers: _.get(data, "summary.globalVouchers", []),
          shops: initPayload.shops.map((shop: any) => {
            const freshShop = _.find(data.shops, { shopId: shop.shopId });

            const options =
              _.get(freshShop, "availableShippingOptions") ||
              _.get(freshShop, "shipping.services") ||
              [];

            let bestServiceCode = shop.serviceCode;
            let bestFee = _.get(freshShop, "summary.shippingFee", 0);

            if (options && options.length > 0) {
              const sorted = _.sortBy(options, [(o) => Number(o.fee)]);
              const cheapest = sorted[0];
              if (cheapest) {
                bestServiceCode = cheapest.serviceCode;
                bestFee = cheapest.fee;
              }
            }

            return {
              ...shop,
              serviceCode: Number(bestServiceCode),
              shippingFee: bestFee,
              vouchers: _.get(freshShop, "voucherResult.validVouchers", []),
            };
          }),
        };

        store.setRequest(finalRequest);
      } catch (e) {
        console.error("❌ Init Error:", e);
        hasInitialized.current = false;
      }
    };

    runInit();
  }, [isSuccess, buyerData, initialPreview]);
};
