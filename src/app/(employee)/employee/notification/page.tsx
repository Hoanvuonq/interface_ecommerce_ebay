import { NotificationsScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý thông báo - Shop App",
  description: "Trang quản lý thông báo trong hệ thống Shop App",
};

export default function NotificationsPage() {
  return <NotificationsScreen />;
}
