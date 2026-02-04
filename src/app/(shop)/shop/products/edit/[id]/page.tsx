// src/app/(shop)/shop/products/edit/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { ProductProvider } from "../../../_contexts";
import ShopProductAddStepsFormScreen from "../../add/_pages/ShopProductAddStepsFormScreen";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <ProductProvider>
      {/* Truyền productId vào đây để kích hoạt Edit Mode */}
      <ShopProductAddStepsFormScreen productId={id} />
    </ProductProvider>
  );
}
