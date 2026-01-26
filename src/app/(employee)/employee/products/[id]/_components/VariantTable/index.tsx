"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ProductVariantResponse } from "../../../_types/dto/product.dto";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { Box, Tag, Ruler, Weight, Package } from "lucide-react";

interface VariantTableProps {
  variants: ProductVariantResponse[];
}

export const VariantTable = ({ variants }: VariantTableProps) => {
  const columns: Column<ProductVariantResponse>[] = useMemo(
    () => [
      {
        header: "Thông tin biến thể",
        className: "min-w-62.5",
        render: (variant) => {
          const imageUrl = variant.imageUrl
            ? resolveMediaUrl(variant.imageUrl, "_thumb")
            : null;
          const safeSrc = imageUrl && imageUrl.trim() !== "" ? imageUrl : null;

          return (
            <div className="flex items-center gap-4 py-1">
              <div className="relative w-12 h-12 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
                {safeSrc ? (
                  <Image
                    src={safeSrc}
                    alt={variant.sku || "variant"}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized // Thêm unoptimized nếu bạn gặp lỗi Hostname cấu hình
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-400">
                    <Box size={20} strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-[13px] uppercase tracking-tighter leading-tight italic">
                  {variant.optionValues?.map((v) => v.name).join(" • ") ||
                    "Mặc định"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Tag size={10} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    {variant.sku}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: "Giá bán",
        align: "right",
        className: "w-32",
        render: (variant) => (
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-orange-600 tracking-tighter italic">
              {variant.price?.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Market Price
            </span>
          </div>
        ),
      },
      {
        header: "Tồn kho",
        align: "center",
        className: "w-28",
        render: (variant) => (
          <div className="inline-flex flex-col items-center px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-gray-700 tabular-nums leading-none mb-1">
              {variant.inventory?.stock || 0}
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
              Units
            </span>
          </div>
        ),
      },
      {
        header: "Logistics (D×R×C)",
        align: "center",
        // Bước 2: Mapping dữ liệu thật từ API thay vì để giá trị cứng
        render: (variant) => (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Ruler size={12} className="text-orange-400" />
            <span className="text-[11px] font-bold tabular-nums">
              {variant.lengthCm || 0} × {variant.widthCm || 0} ×{" "}
              {variant.heightCm || 0}
            </span>
            <span className="text-[9px] font-bold uppercase text-gray-300">
              CM
            </span>
          </div>
        ),
      },
      {
        header: "Cân nặng",
        align: "center",
        // Bước 2: Mapping dữ liệu thật
        render: (variant) => (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Weight size={12} className="text-orange-400" />
            <span className="text-[11px] font-bold tabular-nums">
              {variant.weightGrams || 0}
            </span>
            <span className="text-[9px] font-bold uppercase text-gray-300">
              GRAM
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
            <Package size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tighter italic leading-none">
              Ma trận biến thể
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5">
              Stock Keeping Unit Management
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem]shadow-custom">
        <DataTable
          data={variants}
          columns={columns}
          loading={false}
          page={0}
          size={variants.length || 10}
          totalElements={variants.length}
          onPageChange={() => {}}
          rowKey="id"
          emptyMessage="Sản phẩm này hiện chưa được thiết lập các phiên bản biến thể."
        />
      </div>
    </div>
  );
};
