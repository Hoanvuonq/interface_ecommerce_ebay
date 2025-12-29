"use client";

import React, { useEffect, useCallback, useRef } from "react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { buyerService } from "@/services/buyer/buyer.service";
import { getAllShopAddresses } from "@/services/shop/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";

export const CheckoutProvider = ({
  children,
  initialPreview,
  initialRequest,
}: {
  children: React.ReactNode;
  initialPreview: any;
  initialRequest: any;
}) => {
  const store = useCheckoutStore();
  const hasLoadedBuyerRef = useRef(false);
  const previousShopsRef = useRef<string | null>(null);

  useEffect(() => {
    let pList: Province[] = [];
    let wList: Ward[] = [];
    addressData.forEach((item) => {
      if (item.type === "table") {
        if (item.name === "provinces") pList = item.data as Province[];
        if (item.name === "wards") wList = item.data as Ward[];
      }
    });
    
    store.setAddressMasterData(pList, wList);
    store.setPreview(initialPreview);
    store.setRequest(initialRequest);
  }, []);

  const loadBuyerInfo = useCallback(async () => {
    if (hasLoadedBuyerRef.current) return;
    hasLoadedBuyerRef.current = true;

    try {
      const user = getStoredUserDetail();
      if (!user?.buyerId) return;

      const buyerDetail = await buyerService.getBuyerDetail(user.buyerId);
      if (buyerDetail) {
        const sortedAddr = [...(buyerDetail.addresses || [])].sort(
          (a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime()
        );
        store.setBuyerData(buyerDetail, sortedAddr);
      }
    } catch (err) {
      console.error("❌ Buyer Info Load Error", err);
      hasLoadedBuyerRef.current = false;
    }
  }, [store]);

  const loadShopAddresses = useCallback(async () => {
    const shops = initialPreview?.shops;
    if (!shops || shops.length === 0) return;

    store.setLoadingAddress(true);
    try {
      const idMap: Record<string, string> = {};
      const fullMap: Record<string, any> = {};
      const addrMap: Record<string, string> = {};

      await Promise.all(
        shops.map(async (shop: any) => {
          const res = await getAllShopAddresses(shop.shopId);
          const addresses = res.data || [];
          const defaultAddr = addresses.find((a: any) => a.isDefaultPickup) || addresses[0];

          if (defaultAddr) {
            idMap[shop.shopId] = defaultAddr.addressId;
            const pName = defaultAddr.province || defaultAddr.address?.provinceName || "Hồ Chí Minh";
            addrMap[shop.shopId] = pName;
            fullMap[shop.shopId] = {
              province: pName,
              district: defaultAddr.district || "",
              ward: defaultAddr.ward || "",
            };
          }
        })
      );

      let mainShopId = shops[0].shopId;
      let maxItems = 0;
      shops.forEach((s: any) => {
        if ((s.items?.length || 0) > maxItems) {
          maxItems = s.items.length;
          mainShopId = s.shopId;
        }
      });

      store.setShopAddressData({
        idMap,
        fullMap,
        mainProvince: fullMap[mainShopId]?.province || "Hồ Chí Minh",
      });
    } catch (err) {
      console.error("❌ Shop Address Load Error", err);
    } finally {
      store.setLoadingAddress(false);
    }
  }, [initialPreview?.shops, store]);

  useEffect(() => {
    loadBuyerInfo();
  }, [loadBuyerInfo]);

  useEffect(() => {
    if (initialPreview?.shops) {
      const shopsKey = JSON.stringify(initialPreview.shops.map((s: any) => s.shopId));
      if (previousShopsRef.current !== shopsKey) {
        previousShopsRef.current = shopsKey;
        loadShopAddresses();
      }
    }
  }, [initialPreview?.shops, loadShopAddresses]);

  return <>{children}</>;
};