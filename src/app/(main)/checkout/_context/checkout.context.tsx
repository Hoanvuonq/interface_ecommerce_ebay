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
    store.setPreview(initialPreview);
    store.setRequest(initialRequest);
  }, [initialPreview, initialRequest]);

  useCheckoutInitialization(initialPreview, initialRequest);

  return <>{children}</>;
};