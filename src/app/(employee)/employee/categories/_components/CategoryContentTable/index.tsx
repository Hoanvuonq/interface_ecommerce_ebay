"use client";

import { StatusTabs } from "@/app/(shop)/shop/_components";
import { CategoryDetailModal } from "../CategoryDetailModal";
import { useContentTable } from "@/app/manager/_hooks/useCategoryController";
import { DataTable, FormInput } from "@/components";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  LayoutGrid,
  PauseCircle,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

// Hàm loại bỏ dấu tiếng Việt (chuẩn, không làm rỗng chuỗi)
function removeVietnameseTones(str: string) {
  if (!str) return "";
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Remove combining diacritics
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/[^a-zA-Z0-9\s]/g, "");
  str = str.replace(/\s+/g, " ").trim();
  return str;
}
import { getCategoryColumns } from "./columns";
import { CreatCategoriesModal } from "../CreatCategoriesModal";
import { useToast } from "@/hooks/useToast";
import { DeleteCategoryModal } from "../DeleteCategoryModal";
import { useDeleteCategory } from "@/app/manager/_hooks/useCategoryController";

interface ContentTableProps {
  onEdit?: (category: CategoryResponse) => void;
  onDelete?: (categoryId: string, etag: string) => void;
  onView?: (category: CategoryResponse) => void;
}

export const CategoryContentTable = ({
  onEdit,
  onDelete,
  onView,
}: ContentTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
    "ALL",
  );
  const { handleDeleteCategory } = useDeleteCategory();
  const { success, error } = useToast();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const allCategoriesRef = useRef<CategoryResponse[] | null>(null);
  const isFetchingAllRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { handleGetCategories, loading } = useContentTable();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });

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

  // Hàm lấy toàn bộ danh mục bằng cách gọi từng page
  const fetchAllCategories = async () => {
    if (isFetchingAllRef.current) return;
    isFetchingAllRef.current = true;
    let page = 0;
    const size = 100;
    let all: CategoryResponse[] = [];
    let total = 0;
    while (true) {
      const res = await handleGetCategories({ page, size, sort: ["createdDate,desc"] });
      if (res?.data) {
        all = all.concat(res.data.content);
        total = res.data.totalElements;
        if (all.length >= total || res.data.content.length === 0) break;
        page++;
      } else {
        break;
      }
    }
    allCategoriesRef.current = all;
    setCategories(all);
    setPagination((prev) => ({ ...prev, page: 0, totalElements: all.length }));
    isFetchingAllRef.current = false;
  };

  const loadCategories = async (page: number) => {
    if (searchText.trim()) {
      // Nếu đã có cache thì dùng lại
      if (allCategoriesRef.current) {
        setCategories(allCategoriesRef.current);
        setPagination((prev) => ({ ...prev, page: 0, totalElements: allCategoriesRef.current!.length }));
        return;
      }
      // Gọi lấy toàn bộ danh mục
      await fetchAllCategories();
    } else {
      // Không search, dùng phân trang như cũ
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
      // Reset cache khi không search
      allCategoriesRef.current = null;
    }
  };

  const handleDeleteConfirm = async (id: string, version: string) => {
    setIsDeleting(true);
    try {
      const res = await handleDeleteCategory(id, version);

      if (res) {
        setDeleteConfirm(null);
        loadCategories(pagination.page);
        success("Đã xóa danh mục thành công");
      } else {
        error("Không thể xóa danh mục này");
      }
    } catch (err) {
      error("Có lỗi xảy ra khi kết nối server");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!categories) return [];

    const searchLower = removeVietnameseTones(searchText.trim().toLowerCase());

    return categories.filter((cat) => {
      const name = removeVietnameseTones((cat.name || "").toLowerCase());
      const slug = removeVietnameseTones((cat.slug || "").toLowerCase());
      const desc = removeVietnameseTones((cat.description || "").toLowerCase());

      const matchesSearch =
        name.includes(searchLower) ||
        slug.includes(searchLower) ||
        desc.includes(searchLower);

      const matchesTab =
        activeTab === "ALL" ||
        (activeTab === "ACTIVE" ? cat.active === true : cat.active === false);

      return matchesSearch && matchesTab;
    });
  }, [categories, searchText, activeTab]);

  useEffect(() => {
    loadCategories(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const columns = getCategoryColumns({
    onView: (cat) => {
      setSelectedCategory(cat);
      setShowDetailModal(true);
    },
    onEdit: (cat) => {
      setSelectedCategory(cat);
      setIsEditModalOpen(true);
    },
    onDelete: (cat) => setDeleteConfirm(cat),
  });

  const tableHeader = (
    <div className="w-full flex justify-between items-center space-y-6">
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

      <div className="relative group max-w-xl">
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
        data={filteredData}
        columns={columns}
        loading={loading}
        rowKey="id"
        page={pagination.page}
        size={pagination.size}
        totalElements={
          searchText ? filteredData.length : pagination.totalElements
        }
        onPageChange={loadCategories}
        headerContent={tableHeader}
      />

      {showDetailModal && selectedCategory && (
        <CategoryDetailModal
          category={selectedCategory}
          onClose={() => setShowDetailModal(false)}
          onEdit={onEdit}
        />
      )}
      <DeleteCategoryModal
        isOpen={!!deleteConfirm}
        category={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
      <CreatCategoriesModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => {
          setIsEditModalOpen(false);
          loadCategories(pagination.page);
          setToast({
            message: "Cập nhật danh mục thành công!",
            type: "success",
          });
          setTimeout(() => setToast({ message: "", type: null }), 3000);
        }}
      />
    </div>
  );
};
