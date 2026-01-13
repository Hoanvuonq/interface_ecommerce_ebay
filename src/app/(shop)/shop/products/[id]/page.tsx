import type { Metadata } from "next";
import {ProductDetailScreen} from "./_pages";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm",
  description: "Trang quản lý chi tiết sản phẩm shop trong hệ thống",
};

export default function ShopProductsDetail() {
  return <ProductDetailScreen />;
}
