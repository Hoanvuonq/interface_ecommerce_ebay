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
      setInitialData({
        preview: JSON.parse(savedPreview),
        request: savedRequest ? JSON.parse(savedRequest) : null,
      });
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
