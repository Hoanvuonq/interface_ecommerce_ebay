"use client";
import { cn } from "@/utils/cn";
import { Edit, Image as ImageIcon, Plus, Zap } from "lucide-react";
import React, { useMemo, useRef, useCallback } from "react";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
const parseNumber = (value: string) => {
  return parseFloat(value.replace(/,/g, "")) || 0;
};

interface Variant {
  sku: string;
  corePrice: number;
  price: number;
  stockQuantity: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
  optionValueNames: string[];
  imageUrl?: string;
  imageProcessing?: boolean;
  [key: string]: any;
}

interface ProductVariantsTableProps {
  variants: Variant[];
  optionNames: string[];
  onUpdateVariants: (newVariants: Variant[]) => void;
  onUploadImage: (file: File, index: number) => Promise<void>;
}

export const ProductVariantsTable: React.FC<ProductVariantsTableProps> = ({
  variants,
  optionNames,
  onUpdateVariants,
  onUploadImage,
}) => {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleInputChange = useCallback(
    (index: number, field: keyof Variant, value: any) => {
      const newVariants = [...variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      onUpdateVariants(newVariants);
    },
    [variants, onUpdateVariants]
  );

  const handleBulkUpdate = useCallback(
    (field: keyof Variant, value: any) => {
      if (!value && value !== 0) return;
      const newVariants = variants.map((v) => ({ ...v, [field]: value }));
      onUpdateVariants(newVariants);
    },
    [variants, onUpdateVariants]
  );

  const inputClass =
    "w-full px-2 py-1.5 text-[11px] font-bold border border-slate-100 rounded-lg focus:outline-none focus:border-orange-400 focus:bg-white transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300";

  const groupMetadata = useMemo(() => {
    const firstOptionMap = new Map<string, number>();
    return variants.map((v, idx) => {
      const firstVal = v.optionValueNames?.[0] || "Default";
      if (!firstOptionMap.has(firstVal)) {
        const count = variants.filter(
          (item) => (item.optionValueNames?.[0] || "Default") === firstVal
        ).length;
        firstOptionMap.set(firstVal, count);
        return { isFirst: true, count, label: firstVal };
      }
      return { isFirst: false, count: 0, label: firstVal };
    });
  }, [variants]);

  const columns: Column<Variant>[] = useMemo(() => {
    const cols: Column<Variant>[] = [];

    cols.push({
      header: optionNames[0] || "Phân loại",
      className: "w-44 !p-0", // p-0 để xử lý border nội bộ
      render: (item, idx) => {
        const meta = groupMetadata[idx];
        if (!meta.isFirst)
          return <div className="h-full border-l border-slate-50" />;

        return (
          <div className="p-4 flex flex-col gap-3 sticky top-0 bg-white/50 backdrop-blur-sm h-full border-r border-slate-50">
            <span className="text-xs font-black text-slate-800 uppercase leading-tight">
              {meta.label}
            </span>
            <div
              onClick={() => fileInputRefs.current[idx]?.click()}
              className="w-16 h-16 relative rounded-2xl cursor-pointer border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all flex flex-col items-center justify-center overflow-hidden group/img bg-slate-50"
            >
              {item.imageUrl ? (
                <>
                  <img
                    src={item.imageUrl}
                    alt="V"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                    <Edit size={14} className="text-white" />
                  </div>
                </>
              ) : (
                <ImageIcon size={18} className="text-slate-300" />
              )}
              {item.imageProcessing && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={(el) => {
                if (el) fileInputRefs.current[idx] = el;
              }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadImage(file, idx);
                e.target.value = "";
              }}
            />
          </div>
        );
      },
    });

    // 2. Các phân loại phụ
    optionNames.slice(1).forEach((name, i) => {
      cols.push({
        header: name,
        className: "w-32",
        render: (item) => (
          <span className="text-[11px] font-bold text-slate-500">
            {item.optionValueNames?.[i + 1] || "-"}
          </span>
        ),
      });
    });

    // 3. Cột Mã SKU
    cols.push({
      header: "Mã SKU",
      className: "w-40",
      render: (item, idx) => (
        <input
          value={item.sku}
          onChange={() => {}}
          onBlur={(e) => handleInputChange(idx, "sku", e.target.value)}
          className={inputClass}
          placeholder="SKU..."
        />
      ),
    });

    // 4. Cột Giá & Kho
    const fields: { key: keyof Variant; label: string; color?: string }[] = [
      { key: "corePrice", label: "Giá Gốc" },
      { key: "price", label: "Giá Bán", color: "text-slate-900" },
      { key: "stockQuantity", label: "Kho" },
    ];

    fields.forEach((f) => {
      cols.push({
        header: f.label,
        align: "right",
        className: "w-32",
        render: (item, idx) => (
          <input
            type="number"
            value={item[f.key]}
            onChange={(e) =>
              handleInputChange(idx, f.key, parseNumber(e.target.value))
            }
            className={cn(inputClass, "text-right font-black", f.color)}
          />
        ),
      });
    });

    // 5. Cột Logistics
    cols.push({
      header: "Logistics (D-R-C-G)",
      align: "center",
      className: "w-52",
      render: (item, idx) => (
        <div className="flex gap-1 p-1 bg-slate-100/30 rounded-lg border border-slate-50">
          {["lengthCm", "widthCm", "heightCm", "weightGrams"].map((f, i) => (
            <input
              key={f}
              type="number"
              value={item[f] || ""}
              onChange={(e) =>
                handleInputChange(idx, f as any, parseNumber(e.target.value))
              }
              className="w-full h-7 text-center text-[9px] font-bold bg-white border border-slate-100 rounded focus:outline-none focus:border-orange-300"
              placeholder={["D", "R", "C", "G"][i]}
            />
          ))}
        </div>
      ),
    });

    return cols;
  }, [optionNames, variants, groupMetadata]);

  return (
    <div className="w-full">
      <DataTable
        data={variants}
        columns={columns}
        loading={false}
        totalElements={variants.length}
        page={0}
        size={variants.length}
        onPageChange={() => {}}
        rowKey={(item) => `variant-${item.sku || Math.random()}`}
        emptyMessage="Vui lòng thêm phân loại để tạo danh sách biến thể"
        headerContent={
          <div className="flex items-center gap-4 bg-orange-50/40 p-4 rounded-t-[1.8rem] border border-orange-100 w-full ">
            <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-200">
              <Zap size={18} fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-black text-orange-600 uppercase tracking-widest leading-none">
                Thiết lập nhanh cho tất cả
              </h4>
              <p className="text-[10px] text-orange-400 font-medium italic mt-1">
                Dữ liệu sẽ được áp dụng cho toàn bộ biến thể hiện có
              </p>
            </div>
            <div className="flex gap-2 max-w-2xl overflow-x-auto no-scrollbar py-1">
              <input
                placeholder="SKU..."
                className="w-28 h-9 px-3 text-[10px] font-bold rounded-xl border-orange-200 focus:border-orange-500 outline-none"
                onBlur={(e) => handleBulkUpdate("sku", e.target.value)}
              />
              <input
                type="number"
                placeholder="Giá gốc"
                className="w-24 h-9 px-3 text-[10px] font-bold rounded-xl border-orange-200 focus:border-orange-500 outline-none"
                onBlur={(e) =>
                  handleBulkUpdate("corePrice", parseNumber(e.target.value))
                }
              />
              <input
                type="number"
                placeholder="Giá bán"
                className="w-24 h-9 px-3 text-[10px] font-bold rounded-xl border-orange-200 focus:border-orange-500 outline-none"
                onBlur={(e) =>
                  handleBulkUpdate("price", parseNumber(e.target.value))
                }
              />
              <input
                type="number"
                placeholder="Kho"
                className="w-20 h-9 px-3 text-[10px] font-bold rounded-xl border-orange-200 focus:border-orange-500 outline-none"
                onBlur={(e) =>
                  handleBulkUpdate("stockQuantity", parseNumber(e.target.value))
                }
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
