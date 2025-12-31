"use client";

import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
export const FooterSection = ({ title, children, isOpen, onClick }: any) => (
  <div className="lg:block">
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full py-4 lg:py-0 lg:mb-6",
        "text-left border-b border-white/5 lg:border-none group"
      )}
    >
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
        {title}
      </h3>
      <ChevronDown
        size={18}
        className={cn(
          "text-white/40 lg:hidden transition-transform duration-300",
          isOpen && "rotate-180 text-amber-400"
        )}
      />
    </button>
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 lg:max-h-none",
        isOpen
          ? "max-h-60 opacity-100 py-2"
          : "max-h-0 opacity-0 lg:opacity-100"
      )}
    >
      {children}
    </div>
  </div>
);
