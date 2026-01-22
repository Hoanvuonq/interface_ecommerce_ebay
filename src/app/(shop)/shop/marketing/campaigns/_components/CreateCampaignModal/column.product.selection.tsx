"use client";

import { Column } from "@/components/DataTable/type";
import { Checkbox, FormInput } from "@/components";
import { useMemo } from "react";

interface ProductColumnProps {
  selectedVariants: any;
  setSelectedVariants: (val: any) => void;
}

export const getProductSelectionColumns = ({
  selectedVariants,
  setSelectedVariants,
}: ProductColumnProps): Column<any>[] => [
  {
    header: "Chọn",
    align: "center",
    className: "w-[50px]",
    render: (variant: any) => (
      <Checkbox
        checked={!!selectedVariants[variant.id]?.selected}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setSelectedVariants((prev: any) => ({
            ...prev,
            [variant.id]: {
              ...prev[variant.id],
              selected: isChecked,
              salePrice: prev[variant.id]?.salePrice || Math.round(variant.price * 0.9),
              stockLimit: prev[variant.id]?.stockLimit || 10,
              discountPercent: prev[variant.id]?.discountPercent || 10,
            },
          }));
        }}
      />
    ),
  },
  {
    header: "Thông tin Biến thể",
    className: "min-w-[200px]",
    render: (variant: any) => (
      <div className="flex flex-col">
        <p className="text-[13px] font-bold text-slate-700 uppercase leading-tight italic">
          {variant.productName}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
            SKU: {variant.sku}
          </span>
          {variant.variantAttributes && (
             <span className="text-[10px] text-gray-400 italic">
               ({variant.variantAttributes})
             </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Giá niêm yết",
    align: "right",
    render: (variant: any) => (
      <span className="text-xs font-bold text-gray-400 line-through">
        {variant.price.toLocaleString()}đ
      </span>
    ),
  },
  {
    header: "% Giảm",
    align: "center",
    className: "w-[80px]",
    render: (variant: any) => {
      const isSelected = !!selectedVariants[variant.id]?.selected;
      return (
        <FormInput
          type="number"
          disabled={!isSelected}
          className="h-8 text-center font-bold text-red-500 bg-gray-50 border-gray-100 focus:bg-white"
          value={selectedVariants[variant.id]?.discountPercent ?? ""}
          onChange={(e) => {
            const pct = e.target.value === "" ? "" : parseInt(e.target.value);
            const newPrice = pct !== "" ? Math.round(variant.price * (1 - (pct as number) / 100)) : "";
            setSelectedVariants((prev: any) => ({
              ...prev,
              [variant.id]: { ...prev[variant.id], discountPercent: pct, salePrice: newPrice },
            }));
          }}
        />
      );
    },
  },
  {
    header: "Giá KM (VNĐ)",
    align: "center",
    className: "w-[130px]",
    render: (variant: any) => {
      const isSelected = !!selectedVariants[variant.id]?.selected;
      const rawValue = selectedVariants[variant.id]?.salePrice;
      const displayValue = rawValue !== undefined ? Number(rawValue).toLocaleString("vi-VN") : "";

      return (
        <FormInput
          type="text"
          inputMode="numeric"
          disabled={!isSelected}
          className="h-8 text-center font-bold text-orange-600 border-orange-100 focus:ring-orange-500/20"
          value={displayValue}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^\d]/g, "");
            const val = numericValue === "" ? "" : parseInt(numericValue);
            const newPct = val !== "" ? Math.round(((variant.price - (val as number)) / variant.price) * 100) : "";
            setSelectedVariants((prev: any) => ({
              ...prev,
              [variant.id]: { ...prev[variant.id], salePrice: val, discountPercent: newPct },
            }));
          }}
          placeholder="0"
        />
      );
    },
  },
  {
    header: "Kho",
    align: "center",
    className: "w-[100px]",
    render: (variant: any) => (
      <FormInput
        type="number"
        disabled={!selectedVariants[variant.id]?.selected}
        className="h-8 text-center font-bold text-slate-600"
        value={selectedVariants[variant.id]?.stockLimit ?? ""}
        onChange={(e) => {
          const val = e.target.value === "" ? "" : parseInt(e.target.value);
          setSelectedVariants((prev: any) => ({
            ...prev,
            [variant.id]: { ...prev[variant.id], stockLimit: val },
          }));
        }}
      />
    ),
  },
];;