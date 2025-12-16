"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";

export const TopHeader = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 sm:h-9 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 ">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/90 animate-pulse" />
            <span className="font-semibold text-xs sm:text-sm tracking-wide whitespace-nowrap ">
              Freeship 199k • Flash Sale 12h
            </span>
          </div>

          <span className="hidden sm:inline text-white/80 text-sm">|</span>
          
          <Link
            href="/shop/check"
            className="hidden sm:inline-flex items-center gap-1 text-white hover:text-white/90 transition-colors font-medium text-xs whitespace-nowrap"
            aria-label="Truy cập Kênh người bán"
          >
            <ShoppingBag size={14} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm">Kênh người bán</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        
      </div>
    </div>
  );
};