"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface AppPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export const AppPopover = ({
  trigger,
  children,
  className,
  align = "right",
}: AppPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div 
      className="relative inline-block" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)} // Hover vào là hiện
      onMouseLeave={() => setIsOpen(false)} // Rê chuột ra là ẩn
    >
      {/* TRIGGER */}
      <div className="cursor-pointer">
        {trigger}
      </div>

      {/* DROPDOWN BOX */}
      <div
        className={cn(
          "absolute top-full pt-3 z-50 transition-all duration-300 ease-out transform origin-top",
          // Hiệu ứng phình ra: Nếu ẩn thì scale về 0 và mờ đi, nếu hiện thì scale về 1
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible",
          align === "right" ? "right-0" : align === "left" ? "left-0" : "left-1/2 -translate-x-1/2",
          className
        )}
      >
        {/* MŨI TÊN NHỌN (THE ARROW) */}
        <div 
          className={cn(
            "absolute top-[5px] w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100 z-0",
            align === "right" ? "right-6" : align === "left" ? "left-6" : "left-1/2 -translate-x-1/2"
          )}
        />

        <div className="relative bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-10">
          {children}
        </div>
      </div>
    </div>
  );
};