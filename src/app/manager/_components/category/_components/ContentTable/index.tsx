"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Download,
  Search,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Folder,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useContentTable } from "@/app/manager/_hooks/useCategory";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CategoryService } from "@/services/categories/category.service";
import { DetailModal } from "../DetailModal";
import { toPublicUrl } from "@/utils/storage/url";
import { cn } from "@/utils/cn";

interface ContentTableProps {
  onEdit?: (category: CategoryResponse) => void;
  onDelete?: (categoryId: string, etag: string) => void;
  onView?: (category: CategoryResponse) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  onEdit,
  onDelete,
  onView,
}) => {
  const { handleGetCategories, loading, error } = useContentTable();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    category: CategoryResponse | null;
  }>({ category: null });
  const [exportLoading, setExportLoading] = useState(false);
  const isInitialMount = useRef(true);

  // Custom Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: null }), 3000);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadCategories(1, itemsPerPage);
    }
  }, []);

  const loadCategories = async (
    page: number = currentPage,
    size: number = itemsPerPage
  ) => {
    setIsLoading(true);
    const data = await handleGetCategories({
      page: page - 1,
      size: size,
      sort: ["createdDate,desc"],
    });

    if (data?.data?.content) {
      setCategories(data.data.content);
      setTotalPages(data.data.totalPages || 0);
      setTotalElements(data.data.totalElements || 0);
    } else {
      setCategories([]);
      setTotalPages(0);
      setTotalElements(0);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadCategories(page, itemsPerPage);
  };

  const handleExportExcel = async () => {
    setExportLoading(true);
    try {
      const blob = await CategoryService.exportCategories();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `categories-${new Date().getTime()}.xlsx`;
      link.click();
      showToast("Xuất Excel thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi xuất dữ liệu", "error");
    } finally {
      setExportLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-4xl border border-gray-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-600 font-semibold uppercase tracking-widest text-[10px]">
          Đang đồng bộ dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {toast.type && (
        <div
          className={cn(
            "fixed top-24 right-10 z-200 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 border bg-white",
            toast.type === "success"
              ? "border-emerald-100 text-emerald-600"
              : "border-rose-100 text-rose-600"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span className="text-xs font-semibold uppercase tracking-widest">
            {toast.message}
          </span>
        </div>
      )}

      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-tighter italic leading-none">
            Category <span className="text-orange-500">Explorer</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-2">
            Tổng cộng: {totalElements} Asset
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Truy vấn danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
            />
          </div>
          <button
            onClick={handleExportExcel}
            disabled={exportLoading}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 hover:border-gray-500 text-gray-700 hover:text-orange-600 rounded-2xl font-semibold text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {exportLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-600 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Visual
                </th>
                <th className="px-6 py-6 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Metadata
                </th>
                <th className="px-6 py-6 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Slug Hash
                </th>
                <th className="px-6 py-6 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  State
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="group hover:bg-orange-50/20 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center group-hover:border-gray-200 transition-all shadow-sm">
                      {category.imageBasePath ? (
                        <img
                          src={toPublicUrl(
                            `${category.imageBasePath}_orig${category.imageExtension}`
                          )}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <ImageIcon className="text-gray-500 w-6 h-6" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-800 tracking-tight group-hover:text-orange-600 transition-colors uppercase">
                        {category.name}
                      </div>
                      {category.parent && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-semibold uppercase tracking-tighter border border-blue-100">
                          <Folder size={10} /> {category.parent.name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <code className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
                      /{category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest border",
                        category.active
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      )}
                    >
                      {category.active ? "● Active" : "○ Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowDetailModal(true);
                        }}
                        className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-xs active:scale-90"
                      >
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => onEdit?.(category)}
                        className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-white rounded-xl transition-all shadow-xs active:scale-90"
                      >
                        <Edit3 size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ category })}
                        className="p-2.5 text-gray-600 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-xs active:scale-90"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.2em]">
            Shard {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white border border-gray-100 hover:border-gray-500 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)]
                .map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-[11px] font-semibold transition-all",
                      currentPage === i + 1
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                        : "bg-white text-gray-500 hover:bg-orange-50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-white border border-gray-100 hover:border-gray-500 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Side Drawer */}
      {showDetailModal && selectedCategory && (
        <DetailModal
          category={selectedCategory}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCategory(null);
          }}
          onEdit={onEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.category && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDeleteConfirm({ category: null })}
          />
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-sm w-full p-10 animate-in zoom-in-95 duration-300 border-2 border-rose-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center animate-pulse">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 uppercase tracking-tighter italic">
                Terminate Asset?
              </h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                Hành động xóa{" "}
                <span className="text-rose-500 underline decoration-2 underline-offset-4">
                  {deleteConfirm.category.name}
                </span>{" "}
                là không thể hoàn tác.
              </p>
              <div className="flex flex-col gap-3 w-full pt-4">
                <button
                  onClick={() => {
                    onDelete?.(
                      deleteConfirm.category!.id,
                      String(deleteConfirm.category!.version)
                    );
                    setDeleteConfirm({ category: null });
                    showToast("Purged successfully", "success");
                  }}
                  className="w-full py-4 bg-linear-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-semibold uppercase tracking-widest text-[11px] shadow-xl shadow-rose-200 active:scale-95 transition-all"
                >
                  Confirm Termination
                </button>
                <button
                  onClick={() => setDeleteConfirm({ category: null })}
                  className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-semibold uppercase tracking-widest text-[11px] hover:bg-gray-100 transition-all"
                >
                  Abort Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTable;
