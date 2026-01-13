import { Metadata } from "next";
import ShopBankAccountScreen from "./_pages";

export const metadata: Metadata = {
    title: "Quản lý Tài khoản Ngân hàng - Shop",
    description: "Trang quản lý tài khoản ngân hàng của shop",
};

export default function ShopBankAccountRoute() {
    return <ShopBankAccountScreen />;
}
