"use client";

import PageTransition from "@/features/PageTransition";
import { Footer } from "@/layouts";
import { AccountDropdown } from "@/layouts/header/_components";
import { isAuthenticated } from "@/utils/local.storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShopOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsUserLoggedIn(isAuthenticated());
  }, []);
  useEffect(() => {
    setIsUserLoggedIn(isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-linear-to-br from-orange-50 via-white to-indigo-50transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md background-main-gradient">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/icon/cano-v4.png"
                alt="CaLaTha Logo"
                width={140}
                height={40}
                className="w-24 sm:w-32 md:w-36 h-auto object-contain"
                style={{ height: "auto" }}
                priority
              />
            </Link>

            <div className="hidden sm:block h-8 w-px bg-gray-300 " />

            <div className="flex flex-col">
              <span className="text-sm sm:text-lg md:text-xl font-bold text-white">
                Kênh Người Bán
              </span>
              <span className="text-[10px] sm:text-xs text-gray-200 font-medium tracking-wide hidden sm:block">
                Đăng ký & Quản lý cửa hàng
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!mounted ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : isUserLoggedIn ? (
              <div className="pl-4 border-l border-gray-200">
                <AccountDropdown />
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-white hover:text-orange-200 transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto py-6 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
}
