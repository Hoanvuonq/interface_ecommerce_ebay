import type { Metadata } from "next";
import ShopProductScreen from "./_pages/ShopProductScreen";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
  description: "Trang quản lý danh sách sản phẩm shop trong hệ thống",
};

export default function ShopProducts() {
  return <ShopProductScreen />;
}