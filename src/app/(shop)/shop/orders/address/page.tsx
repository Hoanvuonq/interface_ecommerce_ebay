
import ShopAddressScreen from "../_pages/ShopAddressScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kênh người bán hàng",
  description: "Trang kênh bán hàng",
};

export default function ShopAddress() {
  return <ShopAddressScreen />;
}