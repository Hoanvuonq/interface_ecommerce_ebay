"use client";
import { useEffect, useRef } from "react";
import { useCheckoutInitialization } from "../_hooks/useCheckoutInitialization";
import { useAddress } from "../_hooks/useGetAddressByAPI";
import { useCheckoutStore } from "../_store/useCheckoutStore";

export const CheckoutProvider = ({ children, initialPreview }: any) => {
  const store = useCheckoutStore();
  const hasLoadedData = useRef(false);

  const { provinces } = useAddress({
    enabled: true,
    isVietnam: true,
  });

  useEffect(() => {
    if (provinces.length > 0 && !hasLoadedData.current) {
      if (store.setAddressMasterData) {
        store.setAddressMasterData(provinces, []);
      }

      if (initialPreview) store.setPreview(initialPreview);
      hasLoadedData.current = true;
    }
  }, [provinces, initialPreview, store]);

  useCheckoutInitialization(initialPreview);

  return <>{children}</>;
};
