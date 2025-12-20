import type { Metadata } from "next";
import { RegisterScreen } from "../../_pages/register";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Trang đăng ký vào hệ thống Shop App",
};

export default function Register (){
    return (
        <RegisterScreen type="shop"/>
    );
}