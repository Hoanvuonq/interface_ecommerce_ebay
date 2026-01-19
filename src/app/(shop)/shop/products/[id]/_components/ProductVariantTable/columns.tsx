"use client";

import { Column } from "@/components/DataTable/type";
import { Package, Tag } from "lucide-react";

export const getVariantColumns = (optionNames: string[]): Column<any>[] => [
  {
    header: "Ảnh",
    align: "left",
    className: "w-24",
    render: (item) => (
      <div className="w-14 h-14 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} className="w-full h-full object-cover" alt="variant" />
        ) : (
          <div className="text-blue-400">
            <Package size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>
    ),
  },
  {
    header: "SKU",
    accessor: "sku",
    className: "min-w-[150px]",
    render: (item) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-800 text-[14px] uppercase tracking-tight">
          {item.sku}
        </span>
        <span className="text-[11px] text-gray-500 font-medium">
          Giá gốc: {item.corePrice?.toLocaleString("vi-VN")} <span className="underline">đ</span>
        </span>
      </div>
    ),
  },
  {
    header: "Giá bán",
    align: "left",
    className: "min-w-[140px]",
    render: (item) => (
      <span className="font-bold text-gray-900 text-[16px] tabular-nums">
        {item.price.toLocaleString("vi-VN")} <span className="text-[14px] underline">đ</span>
      </span>
    ),
  },
  {
    header: "Tồn kho",
    align: "center",
    render: (item) => (
      <span className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 tracking-tighter">
        {item.stockQuantity} SP
      </span>
    ),
  },
  {
    header: "Thuộc tính",
    className: "min-w-[200px]",
    render: (item) => (
      <div className="flex flex-wrap gap-2">
        {optionNames.length > 0 ? (
          optionNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50/50 border border-gray-100 rounded-xl text-[11px] font-semibold text-orange-700 uppercase tracking-tight"
            >
              <Tag size={10} />
              {name}: <span className="text-gray-900">{item.optionValues[name] || "—"}</span>
            </span>
          ))
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-semibold text-gray-500 italic">
            <Tag size={10} />
            Không có tùy chọn
          </span>
        )}
      </div>
    ),
  },
];