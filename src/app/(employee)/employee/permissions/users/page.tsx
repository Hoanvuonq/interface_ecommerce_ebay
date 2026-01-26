import {UserPermissionScreen} from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý phân quyền theo User",
  description: "Trang quản lý vai trò theo người dùng trong hệ thống Shop App",
};

export default function UserPermissionPage() {
  return <UserPermissionScreen />;
}
