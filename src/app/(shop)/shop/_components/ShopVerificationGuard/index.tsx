"use client";

import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { Loader2, ShieldAlert, Store, AlertCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { getCurrentUserShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { RoleEnum } from "@/auth/_types/auth";
import { getStoredUserDetail, hasRole } from "@/utils/jwt";
import { isAuthenticated } from "@/utils/local.storage";

interface ShopVerificationGuardProps {
  children: React.ReactNode;
}

export default function ShopVerificationGuard({
  children,
}: ShopVerificationGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAllowedRoute = useMemo(() => {
    const allowedPatterns = ["/shop/check", "/shop/login", "/shop/onboarding"];
    return (
      pathname && allowedPatterns.some((route) => pathname.startsWith(route))
    );
  }, [pathname]);

  const {
    data: shopRes,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["current-user-shop"],
    queryFn: getCurrentUserShopDetail,
    enabled: mounted && !isAllowedRoute && isAuthenticated(),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  // 1. Giao diện Loading khởi tạo (Dùng màu cam nhạt tinh tế)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50/30">
        <Loader2 className="w-10 h-10 text-(--color-mainColor) animate-spin" />
      </div>
    );
  }

  if (isAllowedRoute) return <>{children}</>;

  if (!isAuthenticated()) {
    router.replace("/shop/login");
    return null;
  }

  const userDetail = getStoredUserDetail();
  if (!_.get(userDetail, "shopId")) {
    router.replace("/shop/onboarding");
    return null;
  }

  // 2. Giao diện xác thực quyền truy cập (Modern & Clean)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50/30 gap-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 border-4 border-(--color-mainColor)/20 border-t-(--color-mainColor) rounded-full animate-spin" />
          <Store className="w-8 h-8 text-(--color-mainColor)" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-bold text-gray-800 italic uppercase tracking-tighter">
            Đang xác thực quyền truy cập
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-(--color-mainColor) animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError && _.get(error, "response.status") === 404) {
    router.replace("/shop/onboarding");
    return null;
  }

  // 3. Giao diện lỗi hệ thống (Soft Red & Orange Mix)
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-orange-50/20">
        <div className="max-w-md w-full bg-white rounded-4xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-orange-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-400" />

          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6 rotate-3">
            <ShieldAlert size={40} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 italic uppercase tracking-tighter">
            Lỗi xác thực
          </h2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed font-medium">
            Hệ thống không thể kiểm tra thông tin shop của bạn lúc này. Vui lòng
            kiểm tra lại kết nối hoặc thử lại sau ít phút.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-(--color-mainColor) text-white rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-orange-200 uppercase text-xs tracking-[0.2em]"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  const shopData = _.get(shopRes, "data");
  const verificationInfo = _.get(shopData, "verificationInfo");
  const shopStatus = _.get(shopData, "status");
  const hasShopRole = hasRole(RoleEnum.SHOP);

  const canAccess =
    shopStatus === "ACTIVE" ||
    _.get(verificationInfo, "isVerified") === true ||
    hasShopRole;

  if (canAccess) {
    return <>{children}</>;
  }

  router.replace("/shop/check");
  return null;
}
