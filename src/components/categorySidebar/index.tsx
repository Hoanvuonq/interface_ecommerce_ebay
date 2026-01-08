"use client";

import { CategoryService } from "@/services/categories/category.service";
import type { CategoryResponse } from "@/types/categories/category.detail";
import { LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomCollapseItem } from "../collapseItem"; // Component cũ dùng Link
import { SectionLoading } from "../loading";

interface CategorySidebarProps {
  isShop?: boolean;
  // Các props mới để phục vụ filter
  data?: CategoryResponse[];
  activeId?: string;
  onSelect?: (id?: string) => void;
}

export default function CategorySidebar({ 
  isShop = false, 
  data = [], 
  activeId, 
  onSelect 
}: CategorySidebarProps) {
  // State chỉ dùng cho Normal Mode (không phải shop)
  const [internalCategories, setInternalCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Chỉ fetch API nếu KHÔNG PHẢI là Shop (vì Shop đã truyền data vào rồi)
  useEffect(() => {
    if (isShop) return; 

    (async () => {
      try {
        setLoading(true);
        const res = await CategoryService.getAllParents();
        const cats = Array.isArray(res)
          ? res
          : (res as { data?: CategoryResponse[] })?.data || [];
        setInternalCategories(cats);
      } catch (e) {
        console.error("Error fetching categories:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isShop]);

  if (loading && !isShop) {
    return <SectionLoading message="Đang tải danh mục..." />;
  }

  // == RENDER HEADER ==
  const renderHeader = () => (
    <div className="p-5 border-b border-orange-50 flex items-center gap-3 bg-linear-to-r from-orange-50 to-amber-50">
      <div className="bg-[#ff8800] p-2 rounded-xl text-white shadow-lg shadow-orange-200">
        <LayoutGrid className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest leading-none">
          {isShop ? "Bộ lọc Shop" : "Danh Mục"}
        </h3>
        <p className="text-[10px] text-(--color-mainColor) font-bold mt-1 uppercase tracking-widest">
          {isShop ? "Tìm kiếm nhanh" : "Khám phá sản phẩm"}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 bg-white overflow-hidden"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      {renderHeader()}

      <div className="p-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(100vh - 200px)" }}>
        
        {isShop ? (
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onSelect && onSelect(undefined)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group 
                  ${!activeId ? "bg-orange-50 text-(--color-mainColor) shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span>Tất cả sản phẩm</span>
                {!activeId && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
              </button>
            </li>

            {/* List danh mục từ props */}
            {data.length === 0 ? (
               <div className="py-4 text-center text-xs text-gray-600">Không có danh mục</div>
            ) : (
              data.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelect && onSelect(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group 
                      ${activeId === cat.id ? "bg-orange-50 text-(--color-mainColor) shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {activeId === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : (

          <div className="space-y-0.5">
            {internalCategories.length === 0 ? (
              <div className="py-10 text-center text-gray-600 text-xs">Trống</div>
            ) : (
              internalCategories.map((c) => (
                <CustomCollapseItem key={c.id} category={c} />
              ))
            )}
          </div>
        )}
      </div>
      
      {!isShop && (
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <p className="text-[10px] text-gray-600 font-medium text-center uppercase tracking-widest">
            Hỗ trợ 24/7
          </p>
        </div>
      )}
    </div>
  );
}