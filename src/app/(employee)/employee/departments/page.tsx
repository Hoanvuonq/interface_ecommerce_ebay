import DepartmentTablePageScreen from "./_pages/DepartmentTablePageScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phòng ban",
  description: "Trang quản lý phòng ban trong hệ thống Shop App",
};

export default function DepartmentsPage() {
  return <DepartmentTablePageScreen />;
}