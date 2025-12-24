"use client";
import React from "react";
import { CheckoutScreen } from "./_pages";
import { CheckoutAddressProvider } from "./context/address";
const Checkout: React.FC = () => {
  return (
  <CheckoutAddressProvider checkoutPreview={null}>
    <CheckoutScreen />
  </CheckoutAddressProvider>
  );
};

export default Checkout;
