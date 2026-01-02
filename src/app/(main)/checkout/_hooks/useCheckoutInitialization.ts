import { buyerService } from "@/services/buyer/buyer.service";
import { getAllShopAddresses } from "@/services/shop/shop.service";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
import { getStoredUserDetail } from "@/utils/jwt";
import { useQueries } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";

export const useCheckoutInitialization = (
  initialPreview: any,
  initialRequest: any
) => {
  const store = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const hasInitializedRef = useRef(false);
  const shopAddressLoadedRef = useRef(false);

  const user = getStoredUserDetail();
  const shopIds = useMemo(
    () => _.map(initialPreview?.shops, "shopId"),
    [initialPreview?.shops]
  );

  const results = useQueries({
    queries: [
      {
        queryKey: ["buyer-detail", user?.buyerId],
        queryFn: () => buyerService.getBuyerDetail(user?.buyerId!),
        enabled: !!user?.buyerId,
        staleTime: 1000 * 60 * 5,
      },
      ..._.map(shopIds, (id) => ({
        queryKey: ["shop-address", id],
        queryFn: () => getAllShopAddresses(id),
        staleTime: 1000 * 60 * 5,
      })),
    ],
  });

  const buyerQueryResult = results[0];
  const buyerData = buyerQueryResult.data; 
  const shopAddressResults = _.slice(results, 1);

  const isAllShopAddressSuccess = useMemo(
    () => shopAddressResults.length > 0 && _.every(shopAddressResults, "isSuccess"),
    [shopAddressResults]
  );

  // 1. Khởi tạo địa chỉ và Sync Preview ngay lập tức (Gửi payload lồng ghép)
  useEffect(() => {
    if (buyerQueryResult.isSuccess && buyerData && initialPreview?.shops) {
      const addresses = (_.get(buyerData, "addresses") || []) as any[];
      const sortedAddr = _.orderBy(addresses, ["isDefault"], ["desc"]);
      store.setBuyerData(buyerData, sortedAddr);

      if (!hasInitializedRef.current) {
        const defaultAddress = _.find(sortedAddr, { isDefault: true }) || _.first(sortedAddr);

        if (defaultAddress?.addressId) {
          // PAYLOAD ĐÚNG CẤU TRÚC LỒNG GHÉP
          const fullPayload = {
            addressId: defaultAddress.addressId,
            globalVouchers: initialRequest?.globalVouchers || [],
            shops: _.map(initialPreview.shops, (s: any) => ({
              shopId: s.shopId,
              itemIds: _.map(s.items, "itemId"),
              vouchers: [],
              shippingFee: 0
            }))
          };

          syncPreview(fullPayload);
          hasInitializedRef.current = true;
        }
      }
    }
  }, [buyerQueryResult.isSuccess, buyerData, initialPreview]);

  // 2. Load địa chỉ Shop (Fix lỗi TypeScript tại đây)
  useEffect(() => {
    if (isAllShopAddressSuccess && !shopAddressLoadedRef.current) {
      const idMap: Record<string, string> = {};
      const fullMap: Record<string, any> = {};

      // SỬA LỖI TS: Sử dụng shopIndex thay vì ép kiểu index:any
      _.forEach(initialPreview?.shops, (shop: any, shopIndex: number) => {
        const queryResult: any = shopAddressResults[shopIndex]; // Lấy query tương ứng
        const addresses = _.get(queryResult, "data.data", []);
        const defaultAddr = _.find(addresses, { isDefaultPickup: true }) || _.first(addresses);

        if (defaultAddr) {
          idMap[shop.shopId] = defaultAddr.addressId;
          fullMap[shop.shopId] = {
            province: defaultAddr.province || "Hồ Chí Minh",
            district: defaultAddr.district || "",
            ward: defaultAddr.ward || "",
          };
        }
      });

      const mainShop = _.maxBy(initialPreview?.shops, (s: any) =>
        _.get(s, "items.length", 0)
      );

      store.setShopAddressData({
        idMap,
        fullMap,
        mainProvince: _.get(fullMap, `[${mainShop?.shopId}].province`, "Hồ Chí Minh"),
      });

      shopAddressLoadedRef.current = true;
    }
  }, [isAllShopAddressSuccess, initialPreview?.shops, shopAddressResults]);

  return { 
    isAllShopAddressSuccess, 
    isLoading: _.some(results, "isLoading") 
  };
};