"use client";

import React, { useEffect, useRef } from "react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutInitialization } from "../_hooks/useCheckoutInitialization";

// _context/checkout.context.tsx
export const CheckoutProvider = ({ children, initialPreview }: any) => {
  const store = useCheckoutStore();
  const hasLoadedData = useRef(false);

  useEffect(() => {
    if (!hasLoadedData.current) {
      // Chỉ nạp Master Data (Tỉnh/Huyện/Xã)
      let pList: Province[] = [];
      let wList: Ward[] = [];
      addressData.forEach((item) => {
        if (item.type === "table") {
          if (item.name === "provinces") pList = item.data as Province[];
          if (item.name === "wards") wList = item.data as Ward[];
        }
      });
      store.setAddressMasterData(pList, wList);
      
      // Chỉ nạp Preview cũ để hiện khung xương (Skeleton), không nạp Request cũ
      if (initialPreview) store.setPreview(initialPreview);
      
      hasLoadedData.current = true;
    }
  }, [initialPreview]);

  useCheckoutInitialization(initialPreview);

  return <>{children}</>;
};