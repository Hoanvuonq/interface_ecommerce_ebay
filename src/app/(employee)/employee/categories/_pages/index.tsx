"use client";

import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { DataTable, FormInput, StatCardComponents } from "@/components";
import {
  CheckCircle,
  Folder,
  LayoutGrid,
  PauseCircle,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CreatCategoriesModal } from "../_components"; // Component Modal mới của bạn
import { useCategory } from "../_hooks/useCategory";
import type { CategoryResponse } from "../_types/dto/category.dto";
import { getCategoryColumns } from "./colum";

export const CategoryManagementScreen = () => {
  const { isLoading, categoryTree, stats, deleteCategory } = useCategory();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
    "ALL",
  );

  // State quản lý Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedKeys);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedKeys(next);
  };

  // Logic làm phẳng dữ liệu tree để hiển thị Table
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

        if (matchesSearch && matchesTab) {
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

  // Cấu hình cột Table
  const columns = useMemo(
    () =>
      getCategoryColumns({
        expandedKeys,
        toggleExpand,
        onEdit: (cat) => {
          setEditingCategory(cat); // Gán category đang chọn để edit
          setIsFormModalOpen(true);
        },
        onDelete: (cat) => {
          if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`))
            deleteCategory({ id: cat.id, etag: cat.version.toString() });
        },
      }),
    [expandedKeys, deleteCategory],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <StatusTabs
          tabs={[
            { key: "ALL", label: "Tất cả danh mục", icon: LayoutGrid },
            { key: "ACTIVE", label: "Đang hoạt động", icon: CheckCircle },
            { key: "INACTIVE", label: "Đang tạm ngưng", icon: PauseCircle },
          ]}
          current={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          layoutId="category-status-tabs"
        />
      </div>

      <div className="relative group max-w-lg">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
          size={18}
        />
        <FormInput
          placeholder="Tìm kiếm danh mục theo tên..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-12 h-12 rounded-2xl border-transparent focus:bg-white transition-all shadow-custom font-bold"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
            Quản lý <span className="text-orange-500">Danh mục</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2 ml-1">
            Product Category Management System
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null); // Reset về null để Modal hiểu là "Thêm mới"
            setIsFormModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={3} /> Tạo danh mục
        </button>
      </div>

      {/* STAT CARDS */}
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

      {/* MAIN DATA TABLE */}
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

      {/* MODAL THÊM/SỬA DANH MỤC */}
      <CreatCategoriesModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        // Truyền thêm prop category để hỗ trợ Edit nếu cần
        category={editingCategory}
      />
    </div>
  );
};
