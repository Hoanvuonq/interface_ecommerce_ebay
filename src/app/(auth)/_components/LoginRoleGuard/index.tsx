"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, ShieldAlert, Lock, ChevronLeft, MoveLeft } from "lucide-react";
import Link from "next/link";
import { isAuthenticated } from "@/utils/local.storage";
import { hasAnyRole } from "@/utils/jwt";
import { RoleEnum } from "@/auth/_types/auth";
import { CustomButton, SectionLoading } from "@/components";
import { Button } from "@/components/button/button";
interface LoginRoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleEnum[];
  loginType: "buyer" | "shop" | "employee";
}

// 1. Custom Button - Tông màu Cam hiện đại
interface CustomButtonProps {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

interface CustomResultProps {
  title: string;
  subTitle: string;
  extra: React.ReactNode;
}

const CustomResult: React.FC<CustomResultProps> = ({
  title,
  subTitle,
  extra,
}) => (
  <div className="relative bg-white dark:bg-slate-800 p-10 sm:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-2xl w-full text-center overflow-hidden">
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50" />
    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-50" />

    <div className="relative flex justify-center mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-40 animate-pulse" />
        <div className="relative bg-gradient-to-br from-orange-400 to-amber-500 p-6 rounded-3xl shadow-xl shadow-orange-200">
          <ShieldAlert size={48} className="text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg">
          <Lock size={16} className="text-orange-500" />
        </div>
      </div>
    </div>

    <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">
      {title}
    </h1>
    <p className="text-gray-500 dark:text-slate-400 mb-10 leading-relaxed px-4">
      {subTitle}
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {extra}
    </div>
  </div>
);

// =================================================================

export default function LoginRoleGuard({
  children,
  allowedRoles,
  loginType,
}: LoginRoleGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkRole = () => {
      try {
        if (!isAuthenticated()) {
          setIsAllowed(true);
          setLoading(false);
          return;
        }

        const hasAllowedRole = hasAnyRole(allowedRoles);

        if (hasAllowedRole) {
          setIsAllowed(true);
          setLoading(false);
        } else {
          setIsBlocked(true);
          setLoading(false);
        }
      } catch (error: any) {
        console.error(
          "Error checking role:",
          error?.message || "Unknown error"
        );
        setIsAllowed(true);
        setLoading(false);
      }
    };

    checkRole();
  }, [allowedRoles]);

  if (loading) {
    return <SectionLoading message="Đang xác thực quyền truy cập..." />;
  }

  if (isBlocked) {
    const getErrorMessage = () => {
      const messages = {
        buyer:
          "Tài khoản của bạn không thuộc hệ thống Người mua. Vui lòng sử dụng tài khoản phù hợp.",
        shop: "Bạn đang cố gắng truy cập hệ thống Shop bằng tài khoản không có quyền. Vui lòng kiểm tra lại.",
        employee:
          "Khu vực này chỉ dành cho Nhân viên hệ thống. Vui lòng đăng nhập bằng tài khoản nội bộ.",
      };
      return (
        messages[loginType] || "Bạn không có quyền truy cập vào trang này."
      );
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbf8] dark:bg-slate-900 p-6">
        <CustomResult
          title="Truy cập bị hạn chế"
          subTitle={getErrorMessage()}
          extra={
            <>
              <Link href="/">
                <CustomButton
                  variant="dark"
                  className="h-12! px-8! hover:text-orange-600! rounded-2xl! shadow-xl shadow-orange-200 uppercase tracking-widest font-black"
                  icon={<MoveLeft size={20} />}
                >
                  Quay về trang chủ
                </CustomButton>
              </Link>

              <button
                onClick={() => router.back()}
                className="flex items-center cursor-pointer justify-center gap-2 px-8 py-3 font-bold rounded-2xl bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all w-full sm:w-auto"
              >
                <ChevronLeft size={20} /> Quay lại
              </button>
              
            </>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
