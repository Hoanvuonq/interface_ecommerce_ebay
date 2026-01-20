"use client";

import {
  StatusTabs,
  StatusTabItem,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { useEffect, useState, useCallback } from "react";
import { FilterBar } from "../_components";
import ProductTable from "../_components/ProductTable";
import {
  getAllProductsAdmin,
  hardDeleteProduct,
} from "../_services/product.service";
import { ProductResponse } from "../_types/dto/product.dto";
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShieldCheck,
} from "lucide-react";

type ApprovalStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "DELETED";

export const  ProductManagementSreen =() =>{
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ApprovalStatus>("ALL");
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shopId, setShopId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        size: 10,
      };

      if (activeTab !== "ALL") {
        params.approvalStatus = activeTab;
      }

      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (shopId) params.shopId = shopId;
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);

      const response = await getAllProductsAdmin(params);

      setProducts(response.data?.content || []);
      setTotalElements(response.data?.totalElements || 0);
      setTotalPages(response.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, keyword, categoryId, shopId, minPrice, maxPrice]);

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

  const tabs: StatusTabItem<ApprovalStatus>[] = [
    { key: "ALL", label: "Tất cả", icon: Layers, count: totalElements },
    { key: "PENDING", label: "Chờ duyệt", icon: Clock, count: 15 },
    { key: "APPROVED", label: "Đã duyệt", icon: CheckCircle2, count: 95 },
    { key: "REJECTED", label: "Từ chối", icon: AlertCircle, count: 8 },
    { key: "DELETED", label: "Đã xóa", icon: Trash2, count: 2 },
  ];

  return (
    <div className="w-full mx-auto space-y-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tighter italic">
              Product Control <span className="text-orange-500">Hub</span>
            </h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">
            Hệ thống quản lý, kiểm duyệt và phân phối sản phẩm toàn sàn.
          </p>
        </div>
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

      <div className="flex items-center justify-center gap-4 py-4 opacity-50">
        <div className="h-px w-12 bg-gray-300" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
          Secure Admin Protocol v2.0
        </span>
        <div className="h-px w-12 bg-gray-300" />
      </div>
    </div>
  );
}
