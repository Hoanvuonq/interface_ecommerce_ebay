import { buyerService } from "@/services/buyer/buyer.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";

export const useCheckoutInitialization = (initialPreview: any) => {
  const store = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const hasInitialized = useRef(false);

  const user = getStoredUserDetail();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");
  const isBuyNow = typeParam === "buy_now";
  const paramVariantId = searchParams.get("variantId");
  const paramQuantity = parseInt(searchParams.get("quantity") || "1");
  const paramShopId = searchParams.get("shopId");

  useEffect(() => {
    hasInitialized.current = false;
  }, [searchParams]);

  const { data: buyerData, isSuccess } = useQuery({
    queryKey: ["buyer-detail", user?.buyerId],
    queryFn: () => buyerService.getBuyerDetail(user?.buyerId!),
    enabled: !!user?.buyerId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const runInit = async () => {
      if (!isSuccess || !buyerData) return;

      if (hasInitialized.current) return;

      const addresses = _.get(buyerData, "addresses") || [];
      const defaultAddr =
        _.find(addresses, { isDefault: true }) || addresses[0];

      if (!defaultAddr) {
        store.setBuyerData(buyerData, []);
        hasInitialized.current = true;
        return;
      }

      store.setBuyerData(
        buyerData,
        _.orderBy(addresses, ["isDefault"], ["desc"]),
      );
      let shopsToInit = [];

      console.log("🔍 Checkout Init Check:", {
        isBuyNow,
        paramVariantId,
        paramShopId,
      });

      // CASE A: MUA NGAY (Ưu tiên số 1)
      if (isBuyNow && paramVariantId && paramShopId) {
        console.log("🚀 DETECTED BUY NOW MODE");
        shopsToInit = [
          {
            shopId: paramShopId,
            items: [
              {
                itemId: paramVariantId,
                quantity: paramQuantity,
              },
            ],
            // Backend cần cái này để biết chỉ checkout đúng 1 item này
            itemIds: [paramVariantId],
            vouchers: [],
            globalVouchers: [],
            serviceCode: 0,
            shippingFee: 0,
          },
        ];
      }
      // CASE B: TỪ GIỎ HÀNG (Fallback)
      else {
        console.log("🛒 DETECTED CART MODE");
        shopsToInit = initialPreview?.shops || [];
      }

      // Nếu không có dữ liệu -> Dừng
      if (!shopsToInit || shopsToInit.length === 0) {
        console.warn("⚠️ No shops data found to init");
        hasInitialized.current = true; // Đánh dấu đã chạy để tránh loop
        return;
      }

      // Map payload chuẩn format
      const shopsPayload = shopsToInit.map((s: any) => {
        const items = s.items.map((i: any) => ({
          itemId: i.itemId || i.id,
          quantity: Number(i.quantity || 1),
        }));

        const itemIds = s.itemIds || items.map((i: any) => i.itemId);

        return {
          shopId: s.shopId,
          items: items,
          itemIds: itemIds,
          serviceCode: 400021,
          vouchers: s.vouchers || [],
          globalVouchers: s.globalVouchers || [],
        };
      });

      const initPayload = {
        addressId: defaultAddr.addressId,
        shippingAddress: {
          addressId: defaultAddr.addressId,
          addressChanged: false,
        },
        globalVouchers: [],
        shops: shopsPayload,
      };

      try {
        hasInitialized.current = true;

        await syncPreview(initPayload);
        console.log("✅ Checkout Init Success");
      } catch (e) {
        console.error("❌ Init Error:", e);
        hasInitialized.current = false;
      }
    };

    runInit();
  }, [
    isSuccess,
    buyerData,
    isBuyNow,
    paramVariantId,
    paramQuantity,
    paramShopId,
  ]);
};
