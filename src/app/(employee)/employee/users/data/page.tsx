import UsersStatisticsScreen from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản",
  description: "Trang thống kê tài khoản trong hệ thống Shop App",
};

export default function UsersPage() {
  return <UsersStatisticsScreen />;
}
