"use client";
import React from "react";
import { Suspense } from "react";
import { ProductScreen } from "./_pages";
import { SectionLoading } from "@/components/loading";

const Product: React.FC = () => {
  return (
    <Suspense fallback={<SectionLoading message="Loading ..." />}>
      <ProductScreen />
    </Suspense>
  )
};

export default Product;
