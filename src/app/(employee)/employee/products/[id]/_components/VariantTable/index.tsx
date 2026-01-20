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
        render: (variant) => (
          <div className="flex items-center gap-4 py-1">
            <div className="relative w-12 h-12 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
              {variant.imageUrl ? (
                <Image
                  src={resolveMediaUrl(variant.imageUrl, "_thumb")}
                  alt={variant.sku}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-400">
                  <Box size={20} strokeWidth={2.5} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-[13px] uppercase tracking-tighter leading-tight italic">
                {variant.optionValues?.map((v) => v.name).join(" • ") ||
                  "Mặc định"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Tag size={10} className="text-orange-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  {variant.sku}
                </span>
              </div>
            </div>
          </div>
        ),
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
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
            <span className="text-xs font-bold text-slate-700 tabular-nums leading-none mb-1">
              {variant.inventory?.stock || 0}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
              Units
            </span>
          </div>
        ),
      },
      {
        header: "Logistics (D×R×C)",
        align: "center",
        render: () => (
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Ruler size={12} className="text-orange-400" />
            <span className="text-[11px] font-bold tabular-nums">
              40 × 60 × 2
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-300">
              CM
            </span>
          </div>
        ),
      },
      {
        header: "Cân nặng",
        align: "center",
        render: () => (
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Weight size={12} className="text-orange-400" />
            <span className="text-[11px] font-bold tabular-nums">200</span>
            <span className="text-[9px] font-bold uppercase text-slate-300">
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
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tighter italic leading-none">
              Ma trận biến thể
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
              Stock Keeping Unit Management
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-custom-lg overflow-hidden">
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
}
