"use client";

import Image from "next/image";
import { AccountDropdown } from "@/layouts/header/_components";
import PageTransition from "@/features/PageTransition";
import { Footer } from "@/layouts";
import { isAuthenticated } from "@/utils/local.storage";

export default function ShopOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-orange-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="w-full border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 via-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/globe.svg"
                alt="Globe Icon"
                width={24}
                height={24}
                className="sm:w-8 sm:h-8"
              />
            </div>
            <span className="text-base sm:text-lg lg:text-xl font-bold bg-linear-to-r from-orange-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Đăng ký trở thành Người bán hàng
            </span>
            <span className="text-sm font-bold bg-linear-to-r from-orange-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent sm:hidden">
              Đăng ký Shop
            </span>
          </div>
          
          {isAuthenticated() && (
            <div className="hidden sm:block">
              <AccountDropdown />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}