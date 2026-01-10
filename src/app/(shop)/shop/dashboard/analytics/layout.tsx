import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - Dashboard",
  description:
    "Xem thống kê và phân tích cửa hàng của bạn - Doanh thu, đơn hàng, khách truy cập",
  keywords: ["analytics", "dashboard", "thống kê", "doanh thu", "đơn hàng"],
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
