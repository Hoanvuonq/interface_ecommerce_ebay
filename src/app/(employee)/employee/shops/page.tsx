import ShopApprovalSreen from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duyệt Shop",
  description: "Trang duyệt shop trong hệ thống Shop App",
};

export default function ShopApproval() {
  return <ShopApprovalSreen />;
}
