import ShopDashboardScreen from "../_pages/ShopDashBoardScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ shop",
  description: "Trang chủ shop của hệ thống Shop App",
};

export default function ShopDashboard() {
  return <ShopDashboardScreen />;
} 