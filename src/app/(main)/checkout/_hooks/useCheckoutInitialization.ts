import { buyerService } from "@/services/buyer/buyer.service";
import { getAllShopAddresses } from "@/services/shop/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useQueries, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { voucherService } from "@/components/voucher/_service/voucher.service";
import { useEffect, useMemo, useRef } from "react";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";

export const useCheckoutInitialization = (initialPreview: any) => {
  const store = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const hasInitializedRef = useRef(false);
  const user = getStoredUserDetail();

  const { data: buyerData, isSuccess: isBuyerSuccess } = useQuery({
    queryKey: ["buyer-detail", user?.buyerId],
    queryFn: () => buyerService.getBuyerDetail(user?.buyerId!),
    enabled: !!user?.buyerId,
  });

  useEffect(() => {
    const autoInit = async () => {
      if (
        hasInitializedRef.current ||
        !isBuyerSuccess ||
        !buyerData ||
        !initialPreview?.shops?.length
      ) {
        return;
      }

      hasInitializedRef.current = true;

      const addresses = _.get(buyerData, "addresses") || [];
      const sortedAddr = _.orderBy(addresses, ["isDefault"], ["desc"]);
      const defaultAddress =
        _.find(sortedAddr, { isDefault: true }) || _.first(sortedAddr);
      store.setBuyerData(buyerData, sortedAddr);

      if (defaultAddress?.addressId) {
        try {
          store.setLoading(true);

          const fullPayload = {
            addressId: defaultAddress.addressId,
            globalVouchers: [],
            shops: initialPreview.shops.map((s: any) => ({
              shopId: s.shopId,
              itemIds: s.items.map((i: any) => i.itemId),
              serviceCode: Number(s.selectedShippingMethod || 400021),
              shippingFee: s.summary?.shippingFee || 0,
            })),
          };
          await syncPreview(fullPayload);
          const result = await syncPreview(fullPayload);

          store.setBuyerData(buyerData, sortedAddr);
        } catch (error) {
          console.error("Init Checkout Failed:", error);
        } finally {
          store.setLoading(false);
        }
      }
    };

    autoInit();
  }, [isBuyerSuccess, initialPreview?.shops?.length]);

  return { isLoading: !isBuyerSuccess };
};
