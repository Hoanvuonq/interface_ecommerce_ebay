import RoleManagementScreen from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phản Lý Vai Trờ",
  description: "Trang quản lý vai trò trong hệ thống Shop App",
};

export default function RoleManagementPage() {
  return <RoleManagementScreen />;
}
