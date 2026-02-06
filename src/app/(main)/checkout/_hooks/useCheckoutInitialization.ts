"use client";

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
      const defaultAddr = _.find(addresses, { isDefault: true }) || addresses[0];

      if (!defaultAddr) {
        store.setBuyerData(buyerData, []);
        hasInitialized.current = true;
        return;
      }

      store.setBuyerData(buyerData, _.orderBy(addresses, ["isDefault"], ["desc"]));

      let shopsToInit = [];
      const currentRequest = store.request; 

      if (isBuyNow && paramVariantId && paramShopId) {
        shopsToInit = [{
          shopId: paramShopId,
          items: [{ itemId: paramVariantId, quantity: paramQuantity }],
          itemIds: [paramVariantId],
        }];
      } 
      else {
        shopsToInit = initialPreview?.shops || [];
      }

      if (!shopsToInit || shopsToInit.length === 0) {
        hasInitialized.current = true;
        return;
      }

      const shopsPayload = shopsToInit.map((s: any) => {
        const items = s.items.map((i: any) => ({
          itemId: i.itemId || i.id,
          quantity: Number(i.quantity || 1),
        }));

        const existingShop = currentRequest?.shops?.find((ex: any) => ex.shopId === s.shopId);
        const isSameItems = _.isEqual(
          _.sortBy(items, 'itemId'),
          _.sortBy(existingShop?.items || [], 'itemId')
        );

        // Luôn truyền serviceCode nếu có (ưu tiên existingShop.serviceCode, nếu không có thì lấy từ s.serviceCode)
        const serviceCode = existingShop?.serviceCode ?? s.serviceCode;

        const shopPayload: any = {
          shopId: s.shopId,
          items: items,
          itemIds: s.itemIds || items.map((i: any) => i.itemId),
        };
        if (serviceCode !== undefined && serviceCode !== null) {
          shopPayload.serviceCode = Number(serviceCode);
        }
        // Chỉ truyền vouchers nếu đã từng chọn (array có length > 0)
        const vouchers = isSameItems ? (existingShop?.vouchers || []) : [];
        if (Array.isArray(vouchers) && vouchers.length > 0) {
          shopPayload.vouchers = vouchers;
        }
        // Chỉ truyền globalVouchers nếu đã từng chọn (array có length > 0)
        const globalVouchers = isSameItems ? (existingShop?.globalVouchers || []) : [];
        if (Array.isArray(globalVouchers) && globalVouchers.length > 0) {
          shopPayload.globalVouchers = globalVouchers;
        }
        return shopPayload;
      });

      const initPayload = {
        addressId: currentRequest?.addressId || defaultAddr.addressId,
        shippingAddress: {
          addressId: currentRequest?.addressId || defaultAddr.addressId,
          addressChanged: false,
        },
        shops: shopsPayload,
      };

      try {
        hasInitialized.current = true;
        await syncPreview(initPayload);
      } catch (e) {
        console.error("❌ Init Error:", e);
        hasInitialized.current = false;
      }
    };

    runInit();
  }, [isSuccess, buyerData, isBuyNow, paramVariantId, paramQuantity, paramShopId]);
};