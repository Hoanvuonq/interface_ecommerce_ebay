"use client";

import { StatCardComponents } from "@/components";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CheckCircle, Folder, PauseCircle, Plus } from "lucide-react";
import { useState } from "react";
import { CategoryContentTable } from "../_components";
import { useCategory } from "../_hooks/useCategory";
export const CategoryManagementScreen = () => {
  const {
    stats,
  } = useCategory();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 p-2">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Quản lý <span className="text-orange-500">Danh mục</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-2 ml-1">
            Product Category Management System
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={3} /> Tạo danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng số lượng"
          value={stats.total}
          icon={<Folder />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Đang hiển thị"
          value={stats.active}
          icon={<CheckCircle />}
          color="text-emerald-500"
          trend={2}
        />
        <StatCardComponents
          label="Đã ẩn/Lưu trữ"
          value={stats.inactive}
          icon={<PauseCircle />}
          color="text-rose-500"
        />
      </div>

      <CategoryContentTable />
    </div>
  );
};
