"use client";

import { Eye, Trash2, Store, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductResponse } from "../../_types/dto/product.dto";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { Checkbox, DataTable ,AddToCartButton} from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";

interface ProductTableProps {
  products: ProductResponse[];
  loading: boolean;
  onDelete: (productId: string) => void;
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
}

export default function ProductTable({
  products,
  loading,
  onDelete,
  page,
  size,
  totalElements,
  onPageChange,
}: ProductTableProps) {
  const columns: Column<ProductResponse>[] = [
    {
      header: <Checkbox className="rounded-sm" />,
      className: "w-12 px-4",
      render: () => <Checkbox className="rounded-sm" />,
    },
    {
      header: "Sản phẩm",
      className: "min-w-[300px]",
      render: (product) => {
        const thumbUrl = product.media?.[0]
          ? resolveMediaUrl(product.media[0], "_thumb")
          : null;

        return (
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
              {thumbUrl ? (
                <Image
                  src={thumbUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-500 font-bold text-xl uppercase italic">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <Link
                href={`/employee/products/${product.id}`}
                className="font-black text-gray-900 hover:text-orange-500 text-sm block truncate uppercase tracking-tighter transition-colors"
              >
                {product.name}
              </Link>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Store size={10} className="text-orange-400" />
                  {product.shop?.name || "Hệ thống"}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Box size={10} />
                  {product.category?.name || "Chưa phân loại"}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Trạng thái",
      align: "center",
      render: (product) => {
        const status = product.approvalStatus;
        const styles = {
          PENDING: "bg-amber-50 text-amber-600 border-amber-100",
          APPROVED: "bg-green-50 text-green-600 border-green-100",
          REJECTED: "bg-red-50 text-red-600 border-red-100",
        };
        const labels = {
          PENDING: "Chờ duyệt",
          APPROVED: "Đã duyệt",
          REJECTED: "Từ chối",
        };

        return (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
              styles[status as keyof typeof styles] ||
                "bg-gray-50 text-gray-500 border-gray-100",
            )}
          >
            {labels[status as keyof typeof labels] || status}
          </span>
        );
      },
    },
    {
      header: "Giá niêm yết",
      align: "right",
      render: (product) => (
        <div className="flex flex-col items-end">
          <span className="text-sm font-black text-slate-900 tracking-tighter">
            {product.basePrice?.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Base Price
          </span>
        </div>
      ),
    },
    {
      header: "Thao tác",
      align: "center",
      render: (product) => (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/employee/products/${product.id}`}
            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
            title="Xem chi tiết"
          >
            <Eye size={16} strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
            title="Xóa sản phẩm"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      loading={loading}
      page={page}
      size={size}
      totalElements={totalElements}
      onPageChange={onPageChange}
      rowKey="id"
      emptyMessage="Hệ thống chưa ghi nhận sản phẩm nào phù hợp."
    />
  );
}
