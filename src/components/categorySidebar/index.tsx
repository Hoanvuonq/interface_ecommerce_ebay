"use client";

import { CategoryService } from "@/services/categories/category.service";
import type { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn"; // Giả sử bạn có hàm cn, nếu chưa có hãy dùng clsx hoặc template string
import { ChevronDown, ChevronRight, LayoutGrid, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionLoading } from "../loading";

interface CategorySidebarProps {
  isShop?: boolean;
  data?: CategoryResponse[];
  activeId?: string;
  onSelect?: (id?: string) => void;
}

export default function CategorySidebar({
  isShop = false,
  data = [],
  activeId,
  onSelect,
}: CategorySidebarProps) {
  const [internalCategories, setInternalCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State để quản lý việc mở/đóng các danh mục cha
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Fetch data nếu không phải mode Shop
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

  // Effect: Tự động mở danh mục cha nếu activeId nằm trong danh mục con của nó
  useEffect(() => {
    if (!activeId) return;
    
    const categoriesToCheck = isShop ? data : internalCategories;
    
    // Tìm cha của activeId hiện tại
    const parentOfActive = categoriesToCheck.find(parent => 
      parent.id === activeId || parent.children?.some(child => child.id === activeId)
    );

    if (parentOfActive) {
      setExpandedIds(prev => Array.from(new Set([...prev, parentOfActive.id])));
    }
  }, [activeId, isShop, data, internalCategories]);

  // Toggle mở rộng danh mục
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn việc click icon làm kích hoạt onSelect
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelect = (id?: string) => {
    if (onSelect) onSelect(id);
  };

  if (loading && !isShop) {
    return <SectionLoading message="Đang tải danh mục..." />;
  }

  const renderHeader = () => (
    <div className="p-5 border-b border-orange-50 flex items-center gap-3 bg-linear-to-r from-orange-50 to-amber-50">
      <div className="bg-[#ff8800] p-2 rounded-xl text-white shadow-lg shadow-orange-200">
        <LayoutGrid className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest leading-none">
          {isShop ? "Bộ lọc Shop" : "Danh Mục"}
        </h3>
        <p className="text-[10px] text-[#ff8800] font-bold mt-1 uppercase tracking-widest">
          {isShop ? "Tìm kiếm nhanh" : "Khám phá sản phẩm"}
        </p>
      </div>
    </div>
  );

  const listToRender = isShop ? data : internalCategories;

  return (
    <div
      className="rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 bg-white overflow-hidden sticky top-24"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      {renderHeader()}

      <div
        className="p-3 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <div className="space-y-1">
          {/* Nút Tất cả sản phẩm */}
          <button
            onClick={() => handleSelect(undefined)}
            className={cn(
              "w-full text-left px-3 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group mb-2",
              !activeId
                ? "bg-orange-50 text-[#ff8800] shadow-sm ring-1 ring-orange-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span>Tất cả danh mục</span>
            {!activeId && <div className="w-2 h-2 rounded-full bg-[#ff8800]" />}
          </button>

          {/* Danh sách danh mục */}
          {listToRender.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400 font-medium">
              Không có danh mục nào
            </div>
          ) : (
            listToRender.map((parent) => {
              const isParentActive = parent.id === activeId;
              const hasActiveChild = parent.children?.some((c) => c.id === activeId);
              const isExpanded = expandedIds.includes(parent.id) || isParentActive || hasActiveChild;
              const hasChildren = parent.children && parent.children.length > 0;

              return (
                <div key={parent.id} className="group/item">
                  {/* --- PARENT ITEM (Danh mục cha) --- */}
                  <div
                    className={cn(
                      "relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none",
                      isParentActive
                        ? "bg-orange-50 text-[#ff8800]" // Style khi cha active
                        : hasActiveChild
                        ? "bg-gray-50 text-gray-800" // Style khi con active (cha sáng nhẹ)
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" // Style mặc định
                    )}
                    onClick={() => {
                        // Logic: Nếu click vào cha -> select cha & mở luôn con
                        handleSelect(parent.id);
                        if(hasChildren) {
                            setExpandedIds(prev => [...prev, parent.id]);
                        }
                    }}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                       {/* Icon active indicator cho Cha */}
                      {isParentActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#ff8800] rounded-r-full" />
                      )}
                      
                      <span className={cn(
                        "text-[13.5px] truncate flex-1", 
                        (isParentActive || hasActiveChild) ? "font-bold" : "font-medium"
                      )}>
                        {parent.name}
                      </span>
                    </div>

                    {/* Nút Expand/Collapse riêng biệt */}
                    {hasChildren && (
                      <div
                        role="button"
                        onClick={(e) => toggleExpand(parent.id, e)}
                        className={cn(
                          "p-1 rounded-full hover:bg-gray-200/50 transition-colors",
                          (isParentActive || hasActiveChild) ? "text-[#ff8800]" : "text-gray-400"
                        )}
                      >
                         {isExpanded ? (
                           <ChevronDown size={16} />
                         ) : (
                           <ChevronRight size={16} />
                         )}
                      </div>
                    )}
                  </div>

                  {/* --- CHILDREN LIST (Danh mục con) --- */}
                  {hasChildren && isExpanded && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-100 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                      {parent.children?.map((child) => {
                        const isChildActive = child.id === activeId;
                        
                        return (
                          <button
                            key={child.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(child.id);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all",
                              isChildActive
                                ? "bg-orange-50/80 text-[#ff8800] font-bold"
                                : "text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50"
                            )}
                          >
                             {/* Icon active indicator cho Con (dấu chấm tròn) */}
                            <Circle 
                                size={6} 
                                className={cn(
                                    "fill-current transition-all", 
                                    isChildActive ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"
                                )} 
                            />
                            <span className="truncate">{child.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {!isShop && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Hỗ trợ 24/7
          </p>
        </div>
      )}
    </div>
  );
}