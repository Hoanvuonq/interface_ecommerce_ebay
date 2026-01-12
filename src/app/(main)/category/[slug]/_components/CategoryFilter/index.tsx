"use client";

import { cn } from "@/utils/cn";
import { ChevronRight, List, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { CategoryFilterProps } from "./type";

export default function CategoryFilter({
  allCategories,
  currentSlug,
}: CategoryFilterProps) {
  
  // 1. Tìm ra "Danh mục Cha" của slug hiện tại
  // Logic: Tìm category mà chính nó là slug hiện tại HOẶC nó chứa con là slug hiện tại
  const activeRoot = allCategories.find(
    (cat) =>
      cat.slug === currentSlug || // Trúng cha
      cat.children?.some((child) => child.slug === currentSlug) // Trúng con
  );

  // 2. Xác định danh sách cần render
  // Nếu tìm thấy nhánh active -> Chỉ render nhánh đó (Cha + Con)
  // Nếu không (đang ở trang chủ hoặc link sai) -> Render toàn bộ danh sách cha
  const dataToRender = activeRoot ? [activeRoot] : allCategories;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
      {/* HEADER */}
      <div className="bg-gray-50/50 px-4 py-3.5 flex items-center gap-2.5 border-b border-gray-100">
        <List size={18} className="text-gray-700" />
        <h3 className="font-bold text-[15px] text-gray-900 tracking-tight">
          {activeRoot ? "ĐANG XEM" : "DANH MỤC"}
        </h3>
      </div>

      <div className="p-2 max-h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar">
        {/* Nút Quay lại tất cả (Chỉ hiện khi đang xem 1 nhánh cụ thể) */}
        {activeRoot && (
          <div className="mb-2 pb-2 border-b border-gray-100">
            <Link
              href="/"
              scroll={false}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <ChevronRight size={14} className="rotate-180" />
              Tất cả danh mục
            </Link>
          </div>
        )}

        {/* Render List */}
        <div className="space-y-1">
          {dataToRender.map((parent) => {
            const isParentActive = parent.slug === currentSlug;
            // Nếu đang view nhánh cụ thể thì luôn mở con, ngược lại thì đóng
            const shouldExpand = !!activeRoot; 

            return (
              <div key={parent.id} className="space-y-0.5">
                {/* --- PARENT ITEM --- */}
                <Link
                  href={`/category/${encodeURIComponent(parent.slug)}`}
                  scroll={false}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 font-bold text-[13.5px]",
                    isParentActive
                      ? "bg-orange-50 text-[#ee4d2d] shadow-sm"
                      : "text-gray-800 hover:bg-gray-50 hover:text-[#ee4d2d]"
                  )}
                >
                  <span className="flex-1 truncate">{parent.name}</span>
                  {isParentActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ee4d2d]" />
                  )}
                </Link>

                {/* --- CHILDREN LIST (Chỉ hiện khi đúng nhánh active) --- */}
                {shouldExpand && parent.children && parent.children.length > 0 && (
                  <div className="ml-2 pl-2 border-l border-gray-100 space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-300">
                    {parent.children.map((child) => {
                      const isChildActive = child.slug === currentSlug;
                      
                      return (
                        <Link
                          key={child.id}
                          href={`/category/${encodeURIComponent(child.slug)}`}
                          scroll={false}
                          className={cn(
                            "flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 text-[13px]",
                            isChildActive
                              ? "bg-orange-50/50 text-[#ee4d2d] font-semibold"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          {/* Icon chỉ dẫn nhỏ cho đẹp */}
                          <CornerDownRight size={12} className={cn("shrink-0", isChildActive ? "text-[#ee4d2d]" : "text-gray-300")} />
                          
                          <span className="truncate">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}