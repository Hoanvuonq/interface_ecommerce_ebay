"use client";

import { DataTable, FormInput, StatCardComponents } from "@/components";
import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { PortalModal } from "@/features/PortalModal";
import {
  CheckCircle,
  Folder,
  PauseCircle,
  Plus,
  RotateCw,
  Search,
  LayoutGrid,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import CategoryForm from "../_components/CategoryForm";
import { useCategory } from "../_hooks/useCategory";
import type { CategoryResponse } from "../_types/dto/category.dto";
import { getCategoryColumns } from "./colum";

export const CategoryManagementScreen = () => {
  const { isLoading, categoryTree, stats, deleteCategory } = useCategory();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
    "ALL",
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedKeys);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedKeys(next);
  };

  // Logic làm phẳng dữ liệu cây để DataTable có thể render
  const flattenData = useMemo(() => {
    const result: any[] = [];
    const traverse = (nodes: CategoryResponse[], level = 0) => {
      nodes.forEach((node) => {
        const matchesSearch = node.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesTab =
          activeTab === "ALL" ||
          (activeTab === "ACTIVE" ? node.active : !node.active);

        // Chỉ thêm vào danh sách nếu khớp filter hoặc có con khớp filter
        if (matchesSearch && matchesTab) {
          // Gắn thêm thông tin level để Column render thụt lề
          result.push({ ...node, level });
        }

        if (node.children && (expandedKeys.has(node.id) || searchText)) {
          traverse(node.children, level + 1);
        }
      });
    };
    traverse(categoryTree);
    return result;
  }, [categoryTree, expandedKeys, searchText, activeTab]);

  const columns = useMemo(
    () =>
      getCategoryColumns({
        expandedKeys,
        toggleExpand,
        onEdit: (cat) => {
          setEditingCategory(cat);
          setIsFormModalOpen(true);
        },
        onDelete: (cat) => {
          if (confirm("Xác nhận xóa?"))
            deleteCategory({ id: cat.id, etag: cat.version.toString() });
        },
      }),
    [expandedKeys],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <StatusTabs
          tabs={[
            { key: "ALL", label: "Tất cả", icon: LayoutGrid },
            { key: "ACTIVE", label: "Hoạt động", icon: CheckCircle },
            { key: "INACTIVE", label: "Vô hiệu", icon: PauseCircle },
          ]}
          current={activeTab}
          onChange={(key) => setActiveTab(key as any)}
        />
      </div>

      <div className="relative group max-w-lg">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
          size={18}
        />
        <FormInput
          placeholder="Tìm tên danh mục..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-12 h-12 rounded-2xl border-transparent focus:bg-white transition-all shadow-custom font-bold"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-4 animate-in fade-in duration-700 p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Danh mục <span className="text-orange-500">Sản phẩm</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-2">
            Inventory Category Registry
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-3xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={3} /> Thêm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng danh mục"
          value={stats.total}
          icon={<Folder />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Hoạt động"
          value={stats.active}
          icon={<CheckCircle />}
          color="text-emerald-500"
          trend={2}
        />
        <StatCardComponents
          label="Tạm ngưng"
          value={stats.inactive}
          icon={<PauseCircle />}
          color="text-rose-500"
        />
      </div>

      <DataTable
        data={flattenData}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        page={0}
        size={flattenData.length}
        totalElements={flattenData.length}
        onPageChange={() => {}}
        headerContent={tableHeader}
      />

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
};
