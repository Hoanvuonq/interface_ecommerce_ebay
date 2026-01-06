import { buyerService } from "@/services/buyer/buyer.service";
import { getAllShopAddresses } from "@/services/shop/shop.service";
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

  // Ref chặn để chỉ khởi tạo đúng 1 lần duy nhất khi vào trang
  const hasInitializedRef = useRef(false);
  const shopAddressLoadedRef = useRef(false);

  const user = getStoredUserDetail();

  const shopIds = useMemo(
    () => _.map(initialPreview?.shops, "shopId") || [],
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
        queryFn: () => getAllShopAddresses(id).catch(() => ({ data: [] })),
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
      })),
    ],
  });

  const buyerQueryResult = results[0];
  const buyerData = buyerQueryResult.data;
  const shopAddressResults = _.slice(results, 1);

  const isAllShopAddressSuccess = useMemo(
    () =>
      shopIds.length > 0 &&
      _.every(shopAddressResults, (r) => r.isSuccess || r.isError),
    [shopAddressResults, shopIds.length]
  );

  useEffect(() => {
    const autoInit = async () => {
      if (
        hasInitializedRef.current ||
        !buyerQueryResult.isSuccess ||
        !buyerData ||
        !initialPreview?.shops?.length
      ) {
        return;
      }

      hasInitializedRef.current = true;

      // 1. Lấy địa chỉ
      const addresses = (_.get(buyerData, "addresses") || []) as any[];
      const sortedAddr = _.orderBy(addresses, ["isDefault"], ["desc"]);
      const defaultAddress =
        _.find(sortedAddr, { isDefault: true }) || _.first(sortedAddr);

      if (defaultAddress?.addressId) {
        try {
          store.setLoading(true);

          // 2. Gọi API gợi ý Voucher song song
          const shopVoucherPromises = initialPreview.shops.map(
            async (s: any) => {
              try {
                const recommend =
                  await voucherService.getShopVouchersWithContext({
                    shopId: s.shopId,
                    itemIds: s.items.map((i: any) => i.itemId),
                    addressId: defaultAddress.addressId,
                    totalAmount: Number(s.summary?.subtotal || 0),
                  });
                return _.maxBy(recommend, "discountAmount")?.code || null;
              } catch {
                return null;
              }
            }
          );

          const platformVoucherPromise = voucherService
            .getPlatformVouchersWithContext({
              shopIds: initialPreview.shops.map((s: any) => s.shopId),
              productIds: initialPreview.shops.flatMap((s: any) =>
                s.items.map((i: any) => i.itemId)
              ),
              addressId: defaultAddress.addressId,
              totalAmount: Number(
                _.sumBy(
                  initialPreview.shops,
                  (s: any) => s.summary?.subtotal || 0
                )
              ),
            })
            .catch(() => null);

          const [shopVoucherCodes, platformRecommend] = await Promise.all([
            Promise.all(shopVoucherPromises),
            platformVoucherPromise,
          ]);

          const bestPlatformOrderVoucher = _.maxBy(
            (platformRecommend?.productOrderVouchers || []).filter(
              (v: any) => v.canSelect
            ),
            (v: any) => Number(v.discountAmount || 0)
          );

          const bestPlatformShipVoucher = _.maxBy(
            (platformRecommend?.shippingVouchers || []).filter(
              (v: any) => v.canSelect
            ),
            (v: any) => Number(v.discountAmount || 0)
          );

          const globalVoucherCodes: string[] = [
            bestPlatformOrderVoucher?.code,
            bestPlatformShipVoucher?.code,
          ].filter(Boolean) as string[];
          const fullPayload = {
            addressId: defaultAddress.addressId,
            globalVouchers: globalVoucherCodes,
            shops: initialPreview.shops.map((s: any, idx: number) => ({
              shopId: s.shopId,
              itemIds: s.items.map((i: any) => i.itemId),
              vouchers: shopVoucherCodes[idx] ? [shopVoucherCodes[idx]] : [],
              globalVouchers: globalVoucherCodes,
              serviceCode:
                s.availableShippingOptions?.[0]?.serviceCode || 400021,
              shippingFee: 0,
            })),
          };

          await syncPreview(fullPayload);
          store.setBuyerData(buyerData, sortedAddr);
        } catch (error) {
          console.error("Init Checkout Failed:", error);
        } finally {
          store.setLoading(false);
        }
      }
    };

    autoInit();
  }, [buyerQueryResult.isSuccess, initialPreview?.shops?.length]);

  // LUỒNG PHỤ: Load thông tin địa chỉ Shop để phục vụ tính toán/hiển thị nếu cần
  useEffect(() => {
    if (
      isAllShopAddressSuccess &&
      !shopAddressLoadedRef.current &&
      initialPreview?.shops?.length > 0
    ) {
      const idMap: Record<string, string> = {};
      const fullMap: Record<string, any> = {};

      _.forEach(initialPreview.shops, (shop: any, index: number) => {
        const queryData = shopAddressResults[index]?.data;
        const addresses = _.get(queryData, "data", []) || [];
        const defaultAddr =
          _.find(addresses, { isDefaultPickup: true }) || _.first(addresses);

        if (defaultAddr) {
          idMap[shop.shopId] = defaultAddr.addressId;
          fullMap[shop.shopId] = {
            province: defaultAddr.province || "Hồ Chí Minh",
            district: defaultAddr.district || "",
            ward: defaultAddr.ward || "",
          };
        }
      });

      const mainShop = _.maxBy(initialPreview.shops, (s: any) =>
        _.get(s, "items.length", 0)
      );

      store.setShopAddressData({
        idMap,
        fullMap,
        mainProvince: _.get(
          fullMap,
          `[${mainShop?.shopId}].province`,
          "Hồ Chí Minh"
        ),
      });

      shopAddressLoadedRef.current = true;
    }
  }, [isAllShopAddressSuccess, initialPreview?.shops]);

  return {
    isAllShopAddressSuccess,
    isLoading: _.some(results, "isLoading"),
  };
};
