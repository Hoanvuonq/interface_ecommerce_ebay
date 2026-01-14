"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Package,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { userProductService } from "@/services/products/product.service";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface ProductListForReviewsProps {
  onSelectProduct: (productId: string) => void;
}

export default function ProductListForReviews({
  onSelectProduct,
}: ProductListForReviewsProps) {
  const [products, setProducts] = useState<UserProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    current: 0, // DataTable thường dùng 0-based index cho page
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await userProductService.getByStatus(
        "APPROVED",
        pagination.current,
        pagination.pageSize
      );

      setProducts(response?.data?.content || []);
      setPagination((prev) => ({
        ...prev,
        total: response?.data?.totalElements ?? 0,
      }));
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<UserProductDTO>[] = [
    {
      header: "Sản phẩm",
      render: (record) => {
        const thumbnail =
          record.media?.find((m) => m.isPrimary)?.url || record.media?.[0]?.url;
        return (
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 shadow-sm">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={record.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Package size={20} />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-800 truncate leading-tight">
                {record.name}
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                {record.category?.name || "Chưa phân loại"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Giá niêm yết",
      className: "w-40",
      render: (record) => (
        <span className="font-black text-slate-700 tracking-tight">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.basePrice)}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      className: "w-32",
      render: (record) => (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
          <CheckCircle2 size={12} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Đã duyệt
          </span>
        </div>
      ),
    },
    {
      header: "Thao tác",
      align: "right",
      className: "w-40",
      render: (record) => (
        <button
          onClick={() => onSelectProduct(record.id)}
          className="group flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
        >
          <Eye size={14} strokeWidth={2.5} />
          Xem Review
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      ),
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [products, searchKeyword]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header tinh gọn */}
      <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-500 shadow-sm border border-orange-100">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
              Quản lý Đánh giá
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-2 italic">
              Chọn sản phẩm để phản hồi và chăm sóc khách hàng
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-3 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all active:scale-95 group"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={20} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      <DataTable
        data={filteredProducts}
        columns={columns}
        loading={loading}
        rowKey="id"
        totalElements={pagination.total}
        page={pagination.current}
        size={pagination.pageSize}
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, current: newPage }))
        }
        emptyMessage="Không tìm thấy sản phẩm nào trong cửa hàng."
        headerContent={
          <div className="relative group w-full sm:w-87.5">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên sản phẩm nhanh..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        }
      />
    </div>
  );
}
