"use client";
import React from "react";
import { ProductDetailProvider } from "@/app/(main)/products/_context/products";
import { ProductDetailPage } from "@/app/(main)/products/[id]/_pages";
import { Footer, Header } from "@/layouts";

const ProductsPreviewId: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="grow w-full flex flex-col">
        <div className="relative grow w-full">
          <ProductDetailProvider mode="admin">
            <ProductDetailPage isPreview={true} />
          </ProductDetailProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPreviewId;
