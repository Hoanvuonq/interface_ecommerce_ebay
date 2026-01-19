"use client";

import React, { useState } from "react";
import { Search, ChevronRight, Check, X, Layers, Hash } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { CategorySummaryResponse } from "@/types/categories/category.summary";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";

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

  const filterCats = (cats: CategorySummaryResponse[]) => {
    if (!searchText.trim()) return cats;
    return cats.filter((c) =>
      c.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const renderSelectedPath = () => {
    const parts = [
      selectedLevel1?.name,
      selectedLevel2?.name,
      selectedLevel3?.name,
      selectedLevel4?.name,
    ].filter(Boolean);

    if (parts.length === 0)
      return (
        <span className="text-gray-500 italic text-xs font-normal">
          Vui lòng chọn ngành hàng
        </span>
      );

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {parts.map((name, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={12} className="text-orange-300" />}
            <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-[12px] font-bold border border-orange-100 shadow-sm transition-all animate-in fade-in zoom-in-95">
              {name}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const footerContent = (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 pt-4 border-t border-gray-100 mt-2">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange-50 rounded-xl hidden sm:block border border-orange-100">
          <Layers size={16} className="text-orange-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.15em] mb-1">
            Lộ trình đã chọn
          </span>
          {renderSelectedPath()}
        </div>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button
          variant="edit"
          onClick={onClose}
          className="px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:bg-gray-100 transition-all border-none"
        >
          Hủy bỏ
        </Button>
        <ButtonField
          htmlType="submit"
          type="login" // Giữ nguyên type của bạn nhưng Style sẽ lấy từ lớp cam
          disabled={!selectedLevel1}
          onClick={onConfirm}
          className="h-12! w-44 shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] bg-orange-500 hover:bg-orange-600 transition-all active:scale-95 border-none rounded-2xl"
        >
          <span className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-white">
            <Check size={18} strokeWidth={4} />
            XÁC NHẬN
          </span>
        </ButtonField>
      </div>
    </div>
  );

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
        className={cn(
          "group flex items-center justify-between px-4 py-3.5 mb-2 rounded-2xl text-[13.5px] cursor-pointer transition-all duration-300 border",
          isSelected
            ? "bg-orange-50 border-orange-200 text-orange-800 font-bold shadow-sm"
            : "bg-white border-transparent text-gray-700 hover:border-orange-100 hover:bg-orange-50/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              isSelected
                ? "bg-orange-500 scale-125 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                : "bg-gray-200 group-hover:bg-orange-200"
            )}
          />
          <span className="truncate max-w-35 ">{cat.name}</span>
        </div>
        {hasChildren && (
          <ChevronRight
            size={14}
            className={cn(
              "transition-transform duration-300 group-hover:trangray-x-1",
              isSelected ? "text-orange-500" : "text-gray-500"
            )}
          />
        )}
      </div>
    );
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm shadow-orange-50">
            <Hash className="text-orange-500 w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-800  text-xl">
            Cấu trúc ngành hàng
          </span>
        </div>
      }
      footer={footerContent}
      width="max-w-6xl"
    >
      <div className="flex flex-col gap-6 p-1">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -trangray-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm nhanh ngành hàng (ví dụ: Áo thun, Đồ điện tử...)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] text-[15px] focus:outline-none focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-gray-500 font-medium shadow-inner"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-4 top-1/2 -trangray-y-1/2 p-1.5 hover:bg-orange-50 rounded-full transition-colors"
            >
              <X size={14} className="text-orange-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-5 h-120 p-2 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
          {[
            { title: "Cấp 1", data: categoryTree, selected: selectedLevel1, onSelect: onSelectLevel1, loading: loading },
            { title: "Cấp 2", data: selectedLevel1?.children, selected: selectedLevel2, onSelect: onSelectLevel2 },
            { title: "Cấp 3", data: selectedLevel2?.children, selected: selectedLevel3, onSelect: onSelectLevel3 },
            { title: "Cấp 4", data: selectedLevel3?.children, selected: selectedLevel4, onSelect: onSelectLevel4 },
          ].map((col, idx) => (
            <div
              key={idx}
              className="flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-4xl border border-white shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-orange-50 bg-white">
                <span className="text-sm font-bold uppercase text-gray-500 ">
                  {col.title}
                </span>
                {col.selected && (
                  <div className="p-1 bg-orange-500 rounded-full shadow-sm shadow-orange-200">
                    <Check size={10} className="text-white" strokeWidth={5} />
                  </div>
                )}
              </div>

              <div className="p-3 overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
                {col.loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-8 h-8 border-[3px] border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-orange-300 uppercase">
                      Đang tải...
                    </span>
                  </div>
                ) : col.data ? (
                  filterCats(col.data).length > 0 ? (
                    filterCats(col.data).map((cat) =>
                      renderCategoryItem(cat, col.selected?.id === cat.id, () =>
                        col.onSelect!(cat)
                      )
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                      <Layers size={32} className="text-gray-200 mb-2" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Trống
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <p className="text-[10px] font-bold text-gray-500 uppercase leading-loose tracking-widest">
                      Chọn cấp {idx} <br/> để xem tiếp
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalModal>
  );
};