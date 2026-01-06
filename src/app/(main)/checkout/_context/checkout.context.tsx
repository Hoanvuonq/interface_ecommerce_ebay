"use client";

import React, { useEffect } from "react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutInitialization } from "../_hooks/useCheckoutInitialization";

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
    // Đảm bảo set Request và Preview vào store ngay lập tức
    store.setPreview(initialPreview);
    store.setRequest(initialRequest);
  }, [initialPreview, initialRequest, store]);

  // FIX: Chỉ truyền 1 object duy nhất chứa cả 2 nếu hook yêu cầu vậy, 
  // hoặc chỉ truyền initialPreview nếu logic bên trong hook tự lấy request từ store.
  useCheckoutInitialization(initialPreview); 

  return <>{children}</>;
};