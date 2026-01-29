"use client";
import { useEffect, useRef } from "react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { useCheckoutInitialization } from "../_hooks/useCheckoutInitialization";
import { useCheckoutStore } from "../_store/useCheckoutStore";

export const CheckoutProvider = ({ children, initialPreview }: any) => {
  const store = useCheckoutStore();
  const hasLoadedData = useRef(false);

  useEffect(() => {
    const currentProvincesLength = store?.provincesData?.length ?? 0;

    if (!hasLoadedData.current && currentProvincesLength === 0) {
      let pList: Province[] = [];
      let wList: Ward[] = [];

      addressData.forEach((item) => {
        if (item.type === "table") {
          if (item.name === "provinces") pList = item.data as Province[];
          if (item.name === "wards") wList = item.data as Ward[];
        }
      });

      if (store.setAddressMasterData) {
        store.setAddressMasterData(pList, wList);
      }

      if (initialPreview) store.setPreview(initialPreview);
      hasLoadedData.current = true;
    }
  }, [initialPreview, store?.provincesData?.length]); 

  useCheckoutInitialization(initialPreview);

  return <>{children}</>;
};
