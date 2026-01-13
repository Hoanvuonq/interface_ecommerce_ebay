"use client";
import React from "react";
import { ProductDetailProvider } from "../_context/products";
import {ProductDetailPage} from "./_pages";
const ProductsId: React.FC = () => {
  return (
   <ProductDetailProvider mode="public">
      <ProductDetailPage />
    </ProductDetailProvider>
  );
};

export default ProductsId;
