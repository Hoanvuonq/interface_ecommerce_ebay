"use client";
import React from "react";
import { ProductScreen } from "./_pages";
import { ProductDetailProvider } from "./_context";

const Product: React.FC = () => {
  return (
    <ProductDetailProvider>
      <ProductScreen />
    </ProductDetailProvider>
  );
};

export default Product;
