// src/app/(shop)/shop/_components/Products/ShippingTable/columns.tsx
import React from "react";
import { Column } from "@/components/DataTable/type";
import { VariantData } from "../../../_stores/product.store";
import { FormInput } from "@/components"; // Dùng component bro vừa gửi

export const getShippingColumns = (
  optionNames: string[],
  onUpdateVariant: (
    index: number,
    field: keyof VariantData,
    value: any,
  ) => void,
): Column<VariantData>[] => {
  const dynamicColumns: Column<VariantData>[] = optionNames.map(
    (name, idx) => ({
      header: (
        <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {name}
        </span>
      ),
      render: (item) => (
        <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
          {item.optionValueNames?.[idx] || "-"}
        </span>
      ),
    }),
  );

  // Cột nhập liệu Vận chuyển
  const shippingColumns: Column<VariantData>[] = [
    {
      header: "Cân nặng (g)",
      className: "w-44",
      render: (item, index) => (
        <FormInput
          type="number"
          placeholder="0"
          value={item.weightGrams}
          className="h-10 text-center font-bold"
          containerClassName="space-y-0"
          onChange={(e) =>
            onUpdateVariant(
              index,
              "weightGrams",
              parseFloat(e.target.value) || 0,
            )
          }
        />
      ),
    },
    {
      header: "Kích thước D × R × C (cm)",
      className: "min-w-[320px]",
      render: (item, index) => (
        <div className="flex items-center gap-2">
          {(["lengthCm", "widthCm", "heightCm"] as const).map((dim) => (
            <div key={dim} className="relative flex-1 group">
              <FormInput
                type="number"
                placeholder="0"
                value={item[dim]}
                className="h-10 text-center font-bold px-2"
                containerClassName="space-y-0"
                onChange={(e) =>
                  onUpdateVariant(index, dim, parseFloat(e.target.value) || 0)
                }
              />
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1 text-[8px] font-black text-orange-400 group-hover:text-orange-600 transition-colors uppercase">
                {dim[0]} {/* L, W, H */}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return [...dynamicColumns, ...shippingColumns];
};
