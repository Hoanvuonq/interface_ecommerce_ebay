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
      const defaultAddr = _.find(addresses, { isDefault: true }) || addresses[0];

      if (!defaultAddr) {
        store.setBuyerData(buyerData, []);
        hasInitialized.current = true;
        return;
      }

      hasInitialized.current = true;
      store.setBuyerData(buyerData, _.orderBy(addresses, ["isDefault"], ["desc"]));

      const initPayload = {
        addressId: defaultAddr.addressId,
        globalVouchers: [],
        shops: initialPreview?.shops?.map((s: any) => ({
          shopId: s.shopId,
          itemIds: s.items.map((i: any) => i.itemId || i.id),
          // serviceCode: s.serviceCode,
          serviceCode: 400021,
        })) || [],
      };

      try {
        await syncPreview(initPayload); 
      } catch (e) {
        console.error("❌ Init Error:", e);
        hasInitialized.current = false;
      }
    };

    runInit();
  }, [isSuccess, buyerData, initialPreview]);
};