import EmployeeStatisticsPage from "../_pages/EmployeeStatisticsScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thống kê nhân viên | Shop App",
  description: "Trang thống kê nhân viên trong hệ thống Shop App",
};

export default function EmployeesStatisticsPage() {
  return <EmployeeStatisticsPage />;
}
