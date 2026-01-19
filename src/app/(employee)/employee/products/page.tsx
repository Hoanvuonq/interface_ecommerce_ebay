import { ProductManagementSreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm - Shop App",
  description: "Trang quản lý sản phẩm trong hệ thống Shop App",
};

export default function ProductManagement() {
  return <ProductManagementSreen />;
}
