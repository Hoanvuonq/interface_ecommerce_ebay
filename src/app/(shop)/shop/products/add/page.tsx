import type { Metadata } from "next";
import { ProductProvider } from "../../_context";
import ShopProductAddStepsFormScreen from "../../_pages/ShopProductAddStepsFormScreen";

export const metadata: Metadata = {
  title: "Thêm sản phẩm",
  description: "Trang thêm sản phẩm mới vào danh sách sản phẩm shop",
};

export default function ShopProducts() {
  return (
    <ProductProvider>
      <ShopProductAddStepsFormScreen />
    </ProductProvider>
  );
}