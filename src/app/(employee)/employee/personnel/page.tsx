import EmployeesTableSreen from "./_pages/EmployeesTableSreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản nhân viên",
  description: "Trang quản lý tài khoản nhân viên trong hệ thống Shop App",
};

export default function UsersPage() {
  return <EmployeesTableSreen />;
}