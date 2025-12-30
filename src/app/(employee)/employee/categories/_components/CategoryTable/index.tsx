"use client";

import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  FileText,
  Folder,
  Plus,
  RotateCw,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  PauseCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useCategory } from "../../_hooks/useCategory";
import type { CategoryResponse } from "../../_types/dto/category.dto";
import CategoryForm from "../CategoryForm";
import { StatCardComponents } from "@/components";

export default function CategoryTable() {
  const { isLoading, categoryTree, stats, deleteCategory } = useCategory();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
    "ALL"
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Logic filter nhẹ nhàng trên UI
  const filteredData = useMemo(() => {
    const filterNode = (nodes: CategoryResponse[]): CategoryResponse[] => {
      return nodes
        .map((node) => ({ ...node }))
        .filter((node) => {
          const matchesSearch = node.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
          const matchesTab =
            activeTab === "ALL" ||
            (activeTab === "ACTIVE" ? node.active : !node.active);
          if (node.children) node.children = filterNode(node.children);
          return (
            (matchesSearch && matchesTab) ||
            (node.children && node.children.length > 0)
          );
        });
    };
    return filterNode(categoryTree);
  }, [categoryTree, searchText, activeTab]);

  const renderRows = (nodes: CategoryResponse[], level = 0) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <tr className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50 last:border-0 text-slate-600">
          <td className="px-6 py-4">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${level * 28}px` }}
            >
              {node.children?.length ? (
                <button
                  onClick={() => {
                    const next = new Set(expandedKeys);
                    next.has(node.id)
                      ? next.delete(node.id)
                      : next.add(node.id);
                    setExpandedKeys(next);
                  }}
                  className="mr-2 p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                  {expandedKeys.has(node.id) ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <span className="w-7" />
              )}
              <div
                className={cn(
                  "p-1.5 rounded-lg mr-3 shadow-sm",
                  node.children?.length
                    ? "bg-orange-50 text-orange-500"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {node.children?.length ? (
                  <Folder size={15} />
                ) : (
                  <FileText size={15} />
                )}
              </div>
              <span className="font-semibold text-slate-800">{node.name}</span>
            </div>
          </td>
          <td className="px-6 py-4 text-xs font-mono">{node.slug}</td>
          <td className="px-6 py-4 text-center">
            <span
              className={cn(
                "px-3 py-1 text-[10px] font-black rounded-full uppercase shadow-xs",
                node.active
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              {node.active ? "Hoạt động" : "Vô hiệu"}
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingCategory(node);
                  setIsFormModalOpen(true);
                }}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() =>
                  deleteCategory({ id: node.id, etag: node.version.toString() })
                }
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </td>
        </tr>
        {node.children &&
          expandedKeys.has(node.id) &&
          renderRows(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
          Danh mục <span className="text-orange-500">Sản phẩm</span>
        </h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng danh mục"
          value={stats.total}
          color="text-slate-900"
          size="md" 
          icon={<Folder />}
        />
        <StatCardComponents
          label="Hoạt động"
          value={stats.active}
          color="text-emerald-500"
          size="md"
          icon={<CheckCircle />}
        />
        <StatCardComponents
          label="Tạm ngưng"
          value={stats.inactive}
          color="text-slate-300"
          size="md"
          icon={<PauseCircle />}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                  activeTab === t
                    ? "bg-white text-orange-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t === "ALL"
                  ? "Tất cả"
                  : t === "ACTIVE"
                  ? "Hoạt động"
                  : "Vô hiệu"}
              </button>
            ))}
          </div>
          <div className="relative group max-w-sm w-full ml-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm tên danh mục..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 outline-none transition-all text-sm font-medium"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-50">
            <tr>
              <th className="px-8 py-5">Cấu trúc tên</th>
              <th className="px-6 py-5">Slug</th>
              <th className="px-6 py-5 text-center">Trạng thái</th>
              <th className="px-8 py-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-32 text-center">
                  <RotateCw
                    className="animate-spin text-orange-500 mx-auto"
                    size={32}
                  />
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              renderRows(filteredData)
            ) : (
              <tr>
                <td colSpan={4} className="py-24 text-center">
                  <AlertCircle
                    size={40}
                    className="mx-auto text-slate-200 mb-2"
                  />
                  <p className="text-slate-400 font-bold italic">
                    Không tìm thấy kết quả
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PortalModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        width="max-w-2xl"
      >
        <CategoryForm
          category={editingCategory}
          onSuccess={() => setIsFormModalOpen(false)}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </PortalModal>
    </div>
  );
}
