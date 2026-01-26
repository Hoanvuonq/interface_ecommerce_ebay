import PermissionManagementScreen from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phân Quyền",
  description: "Trang quản lý phân quyền trong hệ thống Shop App",
};

export default function PermissionManagementPage() {
  return <PermissionManagementScreen />;
}