import type { Metadata } from "next";
import EmployeeLoginScreen from "../../_pages/employee";

export const metadata: Metadata = {
  title: "Đăng nhập nhân viên",
  description: "Trang đăng nhập dành cho nhân viên hệ thống EbayExpress",
};

export default function EmployeeLogin() {
  return <EmployeeLoginScreen />;
}


