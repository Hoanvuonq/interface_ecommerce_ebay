import DepartmentStatisticsScreen from "../_pages/DepartmentStatisticsScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thống kê Phòng ban",
  description: "Trang quản lý phòng ban trong hệ thống Shop App",
};

export default function DepartmentsStatisticsPage() {
  return <DepartmentStatisticsScreen />;
}