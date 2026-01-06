import { buyerService } from "@/services/buyer/buyer.service";
import { getAllShopAddresses } from "@/services/shop/shop.service";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
import { getStoredUserDetail } from "@/utils/jwt";
import { useQueries } from "@tanstack/react-query";
import _ from "lodash";
import { voucherService } from "@/components/voucher/_service/voucher.service";
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

  useEffect(() => {
    const autoInitAndApplyVouchers = async () => {
      if (!buyerQueryResult.isSuccess || !buyerData || !initialPreview?.shops?.length) return;
      
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true; 

      const addresses = (_.get(buyerData, "addresses") || []) as any[];
      const sortedAddr = _.orderBy(addresses, ["isDefault"], ["desc"]);
      store.setBuyerData(buyerData, sortedAddr);

      const defaultAddress = _.find(sortedAddr, { isDefault: true }) || _.first(sortedAddr);
      
      if (defaultAddress?.addressId) {
        try {
          const shopVoucherPromises = initialPreview.shops.map(async (s: any) => {
            const recommend = await voucherService.getShopVouchersWithContext({
              shopId: s.shopId,
              itemIds: s.items.map((i: any) => i.itemId),
              addressId: defaultAddress.addressId,
              totalAmount: s.summary?.subtotal || 0 // Thêm context tiền để gợi ý chuẩn hơn
            });
            if (!recommend?.length) return null;
            return _.maxBy(recommend, 'discountAmount')?.code || null;
          });

          const platformVoucherPromise = voucherService.getPlatformVouchersWithContext({
            shopIds: initialPreview.shops.map((s: any) => s.shopId),
            productIds: initialPreview.shops.flatMap((s: any) => s.items.map((i: any) => i.itemId)),
            addressId: defaultAddress.addressId,
          });

          const [shopVoucherCodes, platformRecommend] = await Promise.all([
            Promise.all(shopVoucherPromises),
            platformVoucherPromise
          ]);

          // 4. Lọc voucher platform tốt nhất
          const globalVouchers: string[] = [];
          const bestOrder = _.maxBy(platformRecommend.productOrderVouchers, 'discountAmount');
          const bestShip = _.maxBy(platformRecommend.shippingVouchers, 'discountAmount');
          
          if (bestOrder?.code) globalVouchers.push(bestOrder.code);
          if (bestShip?.code) globalVouchers.push(bestShip.code);

          // 5. Build Payload
          const fullPayload = {
            addressId: defaultAddress.addressId,
            globalVouchers,
            shops: initialPreview.shops.map((s: any, idx: number) => ({
              shopId: s.shopId,
              itemIds: s.items.map((i: any) => i.itemId),
              vouchers: shopVoucherCodes[idx] ? [shopVoucherCodes[idx]] : [],
              shippingFee: 0
            }))
          };

          // 6. Đồng bộ về store/server
          await syncPreview(fullPayload);
        } catch (error) {
          console.error("Lỗi khởi tạo checkout:", error);
          // Nếu lỗi thì ít nhất vẫn khởi tạo với địa chỉ
          syncPreview({
            addressId: defaultAddress.addressId,
            shops: initialPreview.shops.map((s: any) => ({
              shopId: s.shopId,
              itemIds: s.items.map((i: any) => i.itemId),
              vouchers: [],
              shippingFee: 0
            }))
          });
        }
      }
    };

    autoInitAndApplyVouchers();
  }, [buyerQueryResult.isSuccess, buyerData, initialPreview?.shops]); // Theo dõi shops để chắc chắn có dữ liệu mới chạy

  // Logic load địa chỉ Shop giữ nguyên (đã fix lỗi TS của bạn)
  useEffect(() => {
    if (isAllShopAddressSuccess && !shopAddressLoadedRef.current) {
      const idMap: Record<string, string> = {};
      const fullMap: Record<string, any> = {};

      _.forEach(initialPreview?.shops, (shop: any, shopIndex: number) => {
        const queryResult: any = shopAddressResults[shopIndex];
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

      const mainShop = _.maxBy(initialPreview?.shops, (s: any) => _.get(s, "items.length", 0));

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