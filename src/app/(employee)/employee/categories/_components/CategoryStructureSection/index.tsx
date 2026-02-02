/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SectionHeader, SelectComponent } from "@/components"; 
import { CategoryResponse } from "@/app/(employee)/employee/categories/_types/dto/category.dto";
import { cn } from "@/utils/cn";
import { CheckCircle2, File } from "lucide-react";
import React from "react";

interface CategoryStructureSectionProps {
  parentId?: string;
  active: boolean;
  onParentChange: (id: string | undefined) => void;
  onActiveChange: (checked: boolean) => void;
  parentCategories: CategoryResponse[];
  loading?: boolean;
  loadingParents?: boolean;
  errorParents?: string | null;
}

export const CategoryStructureSection: React.FC<
  CategoryStructureSectionProps
> = ({
  parentId,
  active,
  onParentChange,
  onActiveChange,
  parentCategories,
  loading,
  loadingParents,
  errorParents,
}) => {
  const parentOptions = React.useMemo(() => {
    return parentCategories.map((cat) => ({
      label: cat.parent ? `${cat.name} (Thuộc: ${cat.parent.name})` : cat.name,
      value: cat.id,
    }));
  }, [parentCategories]);

  return (
    <div className="bg-gray-50/50 rounded-[2.5rem] p-7 border border-gray-100 space-y-6 shadow-sm">
      <SectionHeader icon={File} title="Cấu trúc & Trạng thái" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase ml-2 tracking-widest flex items-center gap-2">
            Danh mục cha
            <span className="text-[10px] lowercase font-medium opacity-60">
              (Tùy chọn)
            </span>
          </div>
          <SelectComponent
            placeholder={
              loadingParents ? "Đang tải dữ liệu..." : "-- Chọn danh mục gốc --"
            }
            options={parentOptions}
            value={parentId}
            onChange={(val: any) => onParentChange(val || undefined)}
            disabled={loading || loadingParents}
            className="shadow-none"
          />
          {errorParents && (
            <p className="text-[10px] text-red-500 ml-2 italic font-medium mt-1">
              ⚠️ Không thể tải danh mục: {errorParents}
            </p>
          )}
          <p className="text-[10px] text-slate-400 ml-2 font-medium italic opacity-70">
            * Bỏ trống nếu đây là danh mục cao nhất (Root)
          </p>
        </div>

        {/* TRẠNG THÁI HOẠT ĐỘNG */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-2 tracking-widest">
            Trạng thái hiển thị
          </label>
          <div
            onClick={() => !loading && onActiveChange(!active)}
            className={cn(
              "h-12 px-6 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300",
              active
                ? "bg-white border-green-200 shadow-lg shadow-green-500/5"
                : "bg-gray-100/50 border-gray-200 opacity-70",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  active
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-400",
                )}
              >
                <CheckCircle2 size={16} strokeWidth={3} />
              </div>
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-tight",
                  active ? "text-slate-800" : "text-gray-500",
                )}
              >
                {active ? "Đang hoạt động" : "Tạm ngưng"}
              </span>
            </div>

            {/* Toggle Switch nhỏ gọn */}
            <div
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors p-1",
                active ? "bg-green-500" : "bg-gray-300",
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm",
                  active ? "translate-x-5" : "translate-x-0",
                )}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 ml-2 font-medium italic opacity-70">
            * Danh mục bị ngưng sẽ không hiện trên Website
          </p>
        </div>
      </div>
    </div>
  );
};
