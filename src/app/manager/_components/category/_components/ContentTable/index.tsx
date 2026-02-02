"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useContentTable } from "@/app/manager/_hooks/useCategoryController";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CategoryService } from "@/app/(main)/category/_service/category.service";
import { DataTable } from "@/components";
import { getCategoryColumns } from "./columns";
import { DetailModal } from "../DetailModal";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

const ContentTable = ({ onEdit, onDelete }: any) => {
  const { handleGetCategories, loading } = useContentTable();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Toast States
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<CategoryResponse | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const loadCategories = async (page: number) => {
    const res = await handleGetCategories({
      page,
      size: pagination.size,
      sort: ["createdDate,desc"],
    });

    if (res?.data) {
      setCategories(res.data.content);
      setPagination((prev) => ({
        ...prev,
        page,
        totalElements: res.data.totalElements,
      }));
    }
  };

  useEffect(() => {
    loadCategories(0);
  }, []);

  const columns = getCategoryColumns(
    (cat) => {
      setSelectedCategory(cat);
      setShowDetailModal(true);
    },
    (cat) => onEdit?.(cat),
    (cat) => setDeleteConfirm(cat),
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast.type && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={cn(
              "fixed top-10 right-10 z-100 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-white",
              toast.type === "success"
                ? "border-emerald-100 text-emerald-600"
                : "border-rose-100 text-rose-600",
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        rowKey="id"
        page={pagination.page}
        size={pagination.size}
        totalElements={pagination.totalElements}
        onPageChange={loadCategories}
        headerContent={
          <>
            <div>
              <h2 className="text-xl font-bold text-gray-800 uppercase italic leading-none">
                Category <span className="text-orange-500">Explorer</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">
                Dữ liệu hệ thống: {pagination.totalElements} Assets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  placeholder="Truy vấn danh mục..."
                  className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-orange-500/20 outline-none w-64"
                />
              </div>
              <button className="p-2.5 bg-white border border-gray-100 rounded-2xl hover:border-orange-500 transition-all shadow-sm">
                <Download size={18} className="text-gray-600" />
              </button>
            </div>
          </>
        }
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-4xl p-8 max-w-sm w-full shadow-2xl border-2 border-rose-50 animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold uppercase italic">
                Terminate Asset?
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">
                Xác nhận xóa {deleteConfirm.name}?
              </p>
              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="py-3 rounded-xl bg-gray-50 text-[10px] font-bold uppercase tracking-widest"
                >
                  Abort
                </button>
                <button
                  onClick={() => {
                    onDelete?.(deleteConfirm.id, String(deleteConfirm.version));
                    setDeleteConfirm(null);
                  }}
                  className="py-3 rounded-xl bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-200"
                >
                  Purge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedCategory && (
        <DetailModal
          category={selectedCategory}
          onClose={() => setShowDetailModal(false)}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default ContentTable;
