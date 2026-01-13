import { Metadata } from "next";
import ShopRevenueScreen from "./_pages";

export const metadata: Metadata = {
    title: "Quản lý Doanh thu - Shop",
    description: "Trang quản lý doanh thu trong hệ thống Shop",
};

export default function ShopRevenueRoute() {
    return <ShopRevenueScreen />;
}

