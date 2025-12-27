import type { Metadata } from "next";
import ForgotPasswordScreen from "../_pages/forgot-password";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Trang quên mật khẩu của hệ thống Shop App",
};

export default function useForgotPassword() {
  return <ForgotPasswordScreen />;
}