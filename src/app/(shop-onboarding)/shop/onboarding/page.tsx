import { ShopInfoScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký shop - Thông tin cơ bản",
  description: "Trang tạo thông tin cơ bản shop",
};

export default function Onboarding() {
  return <ShopInfoScreen />;
}
