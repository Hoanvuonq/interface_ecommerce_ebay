"use client";
import React, { useEffect, useState } from "react";
import { CheckoutScreen } from "./_pages";
import { CheckoutProvider } from "./_context/checkout.context";

const Checkout: React.FC = () => {
  const [initialData, setInitialData] = useState<{
    preview: any;
    request: any;
  } | null>(null);

  useEffect(() => {
    const savedPreview = sessionStorage.getItem("checkoutPreview");
    const savedRequest = sessionStorage.getItem("checkoutRequest");

    if (savedPreview) {
      const p = JSON.parse(savedPreview);
      const r = savedRequest ? JSON.parse(savedRequest) : null;
      if (r && r.globalVouchers && r.globalVouchers.length === 0) {
        r.globalVouchers = undefined;
        r.shops.forEach((s: any) => {
          if (s.vouchers && s.vouchers.length === 0) s.vouchers = undefined;
          if (s.globalVouchers && s.globalVouchers.length === 0)
            s.globalVouchers = undefined;
        });
      }
      console.debug(
        "Checkout.page: loaded initial preview/request from sessionStorage",
        { preview: p, request: r },
      );
      setInitialData({ preview: p, request: r });
    } else {
      setInitialData({ preview: null, request: null });
    }
  }, []);

  if (!initialData) return null;

  return (
    <CheckoutProvider
      initialPreview={initialData.preview}
      initialRequest={initialData.request}
    >
      <CheckoutScreen />
    </CheckoutProvider>
  );
};

export default Checkout;
