"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Check } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { CategorySummaryResponse } from "@/types/categories/category.summary";

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  
  categoryTree: CategorySummaryResponse[];
  loading: boolean;
  
  selectedLevel1: CategorySummaryResponse | null;
  selectedLevel2: CategorySummaryResponse | null;
  selectedLevel3: CategorySummaryResponse | null;
  selectedLevel4: CategorySummaryResponse | null;
  
  onSelectLevel1: (cat: CategorySummaryResponse) => void;
  onSelectLevel2: (cat: CategorySummaryResponse) => void;
  onSelectLevel3: (cat: CategorySummaryResponse) => void;
  onSelectLevel4: (cat: CategorySummaryResponse) => void;
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryTree,
  loading,
  selectedLevel1,
  selectedLevel2,
  selectedLevel3,
  selectedLevel4,
  onSelectLevel1,
  onSelectLevel2,
  onSelectLevel3,
  onSelectLevel4,
}) => {
  const [searchText, setSearchText] = useState("");

  // Helper filter categories
  const filterCats = (cats: CategorySummaryResponse[]) => {
    if (!searchText.trim()) return cats;
    return cats.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));
  };

  // Helper render path text
  const renderSelectedPath = () => {
    const parts = [
      selectedLevel1?.name,
      selectedLevel2?.name,
      selectedLevel3?.name,
      selectedLevel4?.name
    ].filter(Boolean);
    
    if (parts.length === 0) return <span className="text-gray-400 italic">Chưa chọn</span>;
    return <span className="text-gray-800 font-medium">{parts.join(" > ")}</span>;
  };

  // Render Footer Buttons
  const footerContent = (
    <div className="flex items-center justify-between w-full py-2">
      <div className="text-sm">
        <span className="font-bold text-gray-700 mr-2">Đã chọn:</span>
        {renderSelectedPath()}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
        >
          Hủy bỏ
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <Check size={16} strokeWidth={3} />
          Xác nhận
        </button>
      </div>
    </div>
  );

  // Helper render column item
  const renderCategoryItem = (
    cat: CategorySummaryResponse, 
    isSelected: boolean, 
    onClick: () => void
  ) => {
    const hasChildren = cat.children && cat.children.length > 0;
    return (
      <div
        key={cat.id}
        onClick={onClick}
        className={`
          group flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg text-sm cursor-pointer transition-all
          ${isSelected 
            ? "bg-blue-50 text-blue-600 font-semibold" 
            : "text-gray-700 hover:bg-gray-50"
          }
        `}
      >
        <span>{cat.name}</span>
        {hasChildren && (
          <ChevronRight 
            size={14} 
            className={`text-gray-400 transition-colors ${isSelected ? "text-blue-500" : "group-hover:text-gray-600"}`} 
          />
        )}
      </div>
    );
  };

  // Helper render empty state
  const renderEmptyState = (msg: string) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
      <p className="text-xs">{msg}</p>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa ngành hàng"
      footer={footerContent}
      width="max-w-5xl" // Modal rộng
    >
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm ngành hàng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>

        {/* 4 Columns Layout */}
        <div className="grid grid-cols-4 border border-gray-200 rounded-xl overflow-hidden h-[400px] bg-white">
          
          {/* Column 1 */}
          <div className="border-r border-gray-100 flex flex-col h-full">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
              Ngành hàng chính
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center p-4"><div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                filterCats(categoryTree).map(cat => 
                  renderCategoryItem(cat, selectedLevel1?.id === cat.id, () => onSelectLevel1(cat))
                )
              )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="border-r border-gray-100 flex flex-col h-full">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide truncate">
              {selectedLevel1 ? selectedLevel1.name : "Chọn cấp 1"}
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              {selectedLevel1 ? (
                filterCats(selectedLevel1.children || []).length > 0 ? (
                    filterCats(selectedLevel1.children || []).map(cat => 
                    renderCategoryItem(cat, selectedLevel2?.id === cat.id, () => onSelectLevel2(cat))
                  )
                ) : renderEmptyState("Không có danh mục con")
              ) : renderEmptyState("Chọn ngành hàng ở cột trước")}
            </div>
          </div>

          {/* Column 3 */}
          <div className="border-r border-gray-100 flex flex-col h-full">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide truncate">
              {selectedLevel2 ? selectedLevel2.name : "Chọn cấp 2"}
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              {selectedLevel2 ? (
                 filterCats(selectedLevel2.children || []).length > 0 ? (
                    filterCats(selectedLevel2.children || []).map(cat => 
                    renderCategoryItem(cat, selectedLevel3?.id === cat.id, () => onSelectLevel3(cat))
                  )
                 ) : renderEmptyState("Không có danh mục con")
              ) : renderEmptyState("Chọn danh mục ở cột trước")}
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide truncate">
              {selectedLevel3 ? selectedLevel3.name : "Chọn cấp 3"}
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              {selectedLevel3 ? (
                 filterCats(selectedLevel3.children || []).length > 0 ? (
                    filterCats(selectedLevel3.children || []).map(cat => 
                    renderCategoryItem(cat, selectedLevel4?.id === cat.id, () => onSelectLevel4(cat))
                  )
                 ) : renderEmptyState("Không có danh mục con")
              ) : renderEmptyState("Chọn danh mục ở cột trước")}
            </div>
          </div>

        </div>
      </div>
    </PortalModal>
  );
};