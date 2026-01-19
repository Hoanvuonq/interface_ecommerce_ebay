"use client";

import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

export const FooterSection = ({ title, children, isOpen, onClick }: any) => (
  <div className="lg:block">
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full py-4 lg:py-0 lg:mb-6",
        "text-left border-b border-gray-200 lg:border-none group"
      )}
    >
      <h3 className="text-md font-bold uppercase">
        {title}
      </h3>
      <ChevronDown
        size={18}
        className={cn(
          "text-gray-500 lg:hidden transition-transform duration-300",
          isOpen && "rotate-180 text-(--color-mainColor)"
        )}
      />
    </button>
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 lg:max-h-none",
        isOpen ? "max-h-64 opacity-100 py-2" : "max-h-0 opacity-0 lg:opacity-100"
      )}
    >
      {children}
    </div>
  </div>
);