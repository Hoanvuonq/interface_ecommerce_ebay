"use client";
import React, { useEffect, useState } from "react";
import { CheckoutScreen } from "./_pages";
import { CheckoutProvider } from "./_context/checkout.context";

const Checkout: React.FC = () => {
  const [initialData, setInitialData] = useState<{ preview: any; request: any } | null>(null);

  useEffect(() => {
    // ✅ Khôi phục dữ liệu từ storage khi F5 trang
    const savedPreview = sessionStorage.getItem("checkoutPreview");
    const savedRequest = sessionStorage.getItem("checkoutRequest");
    
    if (savedPreview) {
      setInitialData({
        preview: JSON.parse(savedPreview),
        request: savedRequest ? JSON.parse(savedRequest) : null
      });
    } else {
      // Nếu không có dữ liệu, set object rỗng để thoát loading mặc định
      setInitialData({ preview: null, request: null });
    }
  }, []);

  // Chờ cho đến khi đọc xong storage mới render Provider
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