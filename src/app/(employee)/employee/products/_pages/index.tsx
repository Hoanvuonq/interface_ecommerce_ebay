"use client";

import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  RotateCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterBar } from "../_components";
import ProductTable from "../_components/ProductTable";
import {
  getAllProductsAdmin,
  getProductsRequiringAttention,
  hardDeleteProduct,
} from "../_services/product.service";
import { ProductResponse } from "../_types/dto/product.dto";

type ApprovalStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "DELETED";

export const ProductManagementSreen = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ApprovalStatus>("ALL");
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shopId, setShopId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = { page: currentPage, size: 10 };

      let response;
      if (activeTab === "PENDING") {
        response = await getProductsRequiringAttention(queryParams);

        if (response?.success && response.data?.content) {
          const sortedContent = [...response.data.content].sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime(),
          );
          setProducts(sortedContent);
          setTotalElements(response.data.totalElements || 0);
        }
      } else {
        response = await getAllProductsAdmin({
          ...queryParams,
          sort: "createdDate,desc",
        });
        setProducts(response.data?.content || []);
        setTotalElements(response.data?.totalElements || 0);
      }
    } catch (error) {
      console.error(
        "Lỗi 500: Kiểm tra lại tham số truyền lên API attention",
        error,
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Xác nhận xóa vĩnh viễn sản phẩm này?")) return;
    try {
      await hardDeleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setKeyword("");
    setCategoryId("");
    setShopId("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(0);
  };

  // Cấu hình Tabs
  const tabs = useMemo(
    (): StatusTabItem<ApprovalStatus>[] => [
      {
        key: "ALL",
        label: "Tất cả",
        icon: Layers,
        count: activeTab === "ALL" ? totalElements : undefined,
      },
      {
        key: "PENDING",
        label: "Chờ duyệt",
        icon: Clock,
        count: activeTab === "PENDING" ? totalElements : undefined,
      },
      {
        key: "APPROVED",
        label: "Đã duyệt",
        icon: CheckCircle2,
        count: activeTab === "APPROVED" ? totalElements : undefined,
      },
      {
        key: "REJECTED",
        label: "Từ chối",
        icon: AlertCircle,
        count: activeTab === "REJECTED" ? totalElements : undefined,
      },
      {
        key: "DELETED",
        label: "Đã xóa",
        icon: Trash2,
        count: activeTab === "DELETED" ? totalElements : undefined,
      },
    ],
    [activeTab, totalElements],
  );

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-700 p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-orange-100 text-orange-600 rounded-3xl shadow-lg shadow-orange-100">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tighter italic leading-none">
              Product Control <span className="text-orange-500">Hub</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-2 ml-1">
              Registry & Verification Protocol
            </p>
          </div>
        </div>

        <button
          onClick={fetchProducts}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90 shrink-0"
        >
          <RotateCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <FilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        shopId={shopId}
        setShopId={setShopId}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="space-y-6">
        <StatusTabs
          tabs={tabs}
          current={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setCurrentPage(0);
          }}
        />

        <ProductTable
          products={products}
          loading={loading}
          onDelete={handleDelete}
          page={currentPage}
          size={10}
          totalElements={totalElements}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="flex items-center justify-center gap-4 py-8 opacity-30">
        <div className="h-px w-16 bg-linear-to-r from-transparent to-gray-400" />
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">
          Secure Admin Protocol v2.0
        </span>
        <div className="h-px w-16 bg-linear-to-l from-transparent to-gray-400" />
      </div>
    </div>
  );
};
