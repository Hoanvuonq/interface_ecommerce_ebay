"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { cn } from "@/utils/cn";

export const TopHeader = () => {
  return (
    <div
      className={cn(
        "relative overflow-hidden text-white border-b border-white/5",
        "bg-linear-to-r from-[#dd0707] via-[#f74200] to-[#cc890c] bg-size-[200%_auto]",
        "animate-gradient-move"
      )}
      style={{
        animation: "gradient-move 6s ease infinite",
      }}
    >
      <style jsx>{`
        @keyframes gradient-move {s
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-10 sm:h-9 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 ">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="inline-flex h-2 w-2 rounded-full bg-white/90 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span className="font-semibold text-xs whitespace-nowrap tracking-wide">
              Freeship 199k • Flash Sale 12h
            </span>
          </div>

          <span className="hidden sm:inline text-white/20 text-sm">|</span>

          <Link
            href="/shop/check"
            className="hidden sm:inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-all font-medium text-xs whitespace-nowrap group"
            aria-label="Truy cập Kênh người bán"
          >
            <ShoppingBag
              size={14}
              className="shrink-0 group-hover:scale-110 transition-transform opacity-90 group-hover:opacity-100"
            />
            <span className="text-xs">Kênh người bán</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
            <LanguageSwitcher />
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};
