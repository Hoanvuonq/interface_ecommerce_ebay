import { ShopInfoScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo thông tin shop",
  description: "Trang tạo thông tin cơ bản shop",
};

export default function Onboarding() {
  return <ShopInfoScreen />;
}
