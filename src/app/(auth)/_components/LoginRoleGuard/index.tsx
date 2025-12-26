"use client";

import { RoleEnum } from "@/auth/_types/auth";
import { CustomButton, SectionLoading } from "@/components";
import { hasAnyRole } from "@/utils/jwt";
import { isAuthenticated } from "@/utils/local.storage";
import { ChevronLeft, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CustomResult } from "../CustomResult";

interface LoginRoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleEnum[];
  loginType: "buyer" | "shop" | "employee";
}

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
