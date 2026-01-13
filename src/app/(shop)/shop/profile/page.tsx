import ShopProfileScreen from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kênh người bán hàng",
  description: "Trang kênh bán hàng",
};

export default function ShopProfile() {
  return <ShopProfileScreen />;
}
