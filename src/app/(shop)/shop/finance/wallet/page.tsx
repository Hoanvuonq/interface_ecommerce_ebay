import { Metadata } from "next";
import ShopWalletScreen from "./_pages";

export const metadata: Metadata = {
    title: "Quản lý Wallet - Shop",
    description: "Trang quản lý wallet trong hệ thống Shop",
};

export default function ShopWalletRoute() {
    return <ShopWalletScreen />;
}

