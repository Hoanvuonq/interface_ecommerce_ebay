import type { Metadata } from "next";
import { SettingsShopScreen } from "./_page/SettingsScreen";

export const metadata: Metadata = {
  title: "Chỉnh sửa cài đặt shop",
  description: "Trang quản lý và cài đặt shop trong hệ thống",
};

export default function ShopSettings() {
  return <SettingsShopScreen />;
}
