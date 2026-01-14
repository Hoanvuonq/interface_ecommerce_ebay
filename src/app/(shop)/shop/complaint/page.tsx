import { ComplaintScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý khiếu nại",
  description: "Trang quản lý khiếu nại của shop",
};
export default function ComplaintPage() {
  return <ComplaintScreen />;
}