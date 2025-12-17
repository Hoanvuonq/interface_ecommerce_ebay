"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import Link from "next/link";
import { isAuthenticated } from "@/utils/local.storage";
import { hasAnyRole, getRedirectPath } from "@/utils/jwt";
import { RoleEnum } from "@/auth/_types/auth";
import { CustomSpinner } from "@/components";
interface LoginRoleGuardProps {
    children: React.ReactNode;
    allowedRoles: RoleEnum[];
    loginType: "buyer" | "shop" | "employee";
}


interface CustomButtonProps {
    children: React.ReactNode;
    href: string;
    icon?: React.ReactNode;
}
const CustomButton: React.FC<CustomButtonProps> = ({ children, href, icon }) => (
    <Link href={href} className="inline-block">
        <button
            className="flex items-center justify-center gap-2 px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-colors"
        >
            {icon}
            {children}
        </button>
    </Link>
);

// 3. Custom Result (Thay thế Ant Design Result)
interface CustomResultProps {
    status: "403";
    title: string;
    subTitle: string;
    extra: React.ReactNode;
}
const CustomResult: React.FC<CustomResultProps> = ({ title, subTitle, extra }) => (
    <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center">
        <div className="text-8xl font-extrabold text-pink-500 mb-4">403</div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{subTitle}</p>
        <div>{extra}</div>
    </div>
);

// =================================================================

/**
 * Component guard để kiểm tra role trước khi cho phép vào trang login
 */
export default function LoginRoleGuard({
    children,
    allowedRoles,
    loginType,
}: LoginRoleGuardProps) {
    const router = useRouter();
    // const { message } = App.useApp(); // Đã loại bỏ Ant Design App import
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        const checkRole = () => {
            try {
                // ✅ 1. Check user đã đăng nhập chưa
                if (!isAuthenticated()) {
                    // Chưa đăng nhập → cho phép vào trang login
                    setIsAllowed(true);
                    setLoading(false);
                    return;
                }

                // 2. User đã đăng nhập → check role
                const hasAllowedRole = hasAnyRole(allowedRoles);

                if (hasAllowedRole) {
                    // User có role phù hợp → cho phép vào trang login
                    setIsAllowed(true);
                    setLoading(false);
                } else {
                    // User không có role phù hợp → chặn và thông báo
                    setIsBlocked(true);
                    setLoading(false);
                }
            } catch (error: any) {
                const errorMessage = error?.message || "Unknown error";
                console.error("Error checking role:", errorMessage, error);
                // Nếu có lỗi, cho phép vào trang login
                setIsAllowed(true);
                setLoading(false);
            }
        };

        checkRole();
    }, [router, allowedRoles, loginType]); // Đã loại bỏ 'message' khỏi dependencies

    // Đang loading - Sử dụng CustomSpinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <CustomSpinner />
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Đang kiểm tra quyền truy cập...
                    </p>
                </div>
            </div>
        );
    }

    // Bị chặn - user đã đăng nhập nhưng không có role phù hợp
    if (isBlocked) {
        const getErrorMessage = () => {
            switch (loginType) {
                case "buyer":
                    return "Tài khoản này không có quyền truy cập vào hệ thống người mua. Vui lòng đăng nhập tại trang phù hợp với tài khoản của bạn.";
                case "shop":
                    return "Tài khoản này không có quyền truy cập vào hệ thống shop. Vui lòng đăng nhập tại trang phù hợp với tài khoản của bạn.";
                case "employee":
                    return "Tài khoản này không có quyền truy cập vào hệ thống nhân viên. Vui lòng đăng nhập tại trang phù hợp với tài khoản của bạn.";
                default:
                    return "Tài khoản này không có quyền truy cập vào trang này.";
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
                <CustomResult
                    status="403"
                    title="Truy cập bị từ chối"
                    subTitle={getErrorMessage()}
                    extra={
                        <CustomButton href="/" icon={<Home size={20} />}>
                            Về trang chủ
                        </CustomButton>
                    }
                />
            </div>
        );
    }

    // Cho phép vào trang login
    return <>{children}</>;
}