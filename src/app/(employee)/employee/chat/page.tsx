import { ChatManagementScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản",
  description: "Trang quản lý tài khoản trong hệ thống Shop App",
};

export default function ChatPage() {
  return <ChatManagementScreen />;
}
