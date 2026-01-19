"use client";

import { cn } from "@/utils/cn";
import { ImageIcon, Zap } from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";
import { FormInput } from "@/components";
import { Column } from "@/components/DataTable/type";
import Image from "next/image";
import { Variant } from "./type";
import { SkuHeader } from "../SkuHeader";

const parseNumber = (value: string) => {
  return parseFloat(value.replace(/,/g, "")) || 0;
};

const COL_WIDTHS = {
  GROUP_1: "w-[120px]",
  GROUP_2: "w-[100px]",
  SKU: "w-[200px]",
  PRICE: "w-[140px]",
  STOCK: "w-[100px]",
  LOGISTICS: "w-[320px]",
};

const tableInputClass =
  "h-9 rounded-xl px-3 text-[12px] font-bold bg-white border-gray-300 focus:border-orange-500 shadow-none transition-all";

export const useProductVariantsColumns = (
  variants: Variant[],
  optionNames: string[],
  groupMetadata: { isFirst: boolean; label: string; rowSpan?: number }[],
  fileInputRefs: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>,
  handleInputChange: (index: number, field: keyof Variant, value: any) => void,
  handleBulkUpdate: (field: keyof Variant, value: any) => void,
  onUploadImage: (file: File, index: number) => Promise<void>,
  selectedBulkFields: string[],
  onToggleBulkField: (field: string) => void,
): Column<Variant>[] => {
  const [bulkValues, setBulkValues] = useState<{ [key: string]: string }>({});
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(new Set());

  // Xử lý rowSpan cho nhóm 1
  const processedMetadata = useMemo(() => {
    const result = groupMetadata.map((m) => ({ ...m }));
    for (let i = 0; i < result.length; i++) {
      if (result[i].isFirst) {
        let count = 1;
        for (let j = i + 1; j < result.length; j++) {
          if (!result[j].isFirst) count++;
          else break;
        }
        result[i].rowSpan = count;
      } else {
        result[i].rowSpan = 0;
      }
    }
    return result;
  }, [groupMetadata]);

  // Hàm áp dụng tất cả các trường đã check
  const applyAllCheckedFields = useCallback(() => {
    if (selectedBulkFields.length === 0) return;

    const bulkUpdates: { [key: string]: any } = {};
    selectedBulkFields.forEach((field) => {
      const rawValue = bulkValues[field];
      const isNumber = ["price", "stockQuantity", "lengthCm", "widthCm", "heightCm", "weightGrams"].includes(field);
      
      if (rawValue === undefined || rawValue === "") {
        bulkUpdates[field] = isNumber ? 0 : "";
      } else {
        bulkUpdates[field] = isNumber ? parseNumber(rawValue) : rawValue;
      }
    });

    handleBulkUpdate("BULK_UPDATE" as any, bulkUpdates);
  }, [selectedBulkFields, bulkValues, handleBulkUpdate]);

  return useMemo(() => {
    const cols: Column<Variant>[] = [];

    // CỘT 1: NHÓM PHÂN LOẠI 1 + IMAGE
    cols.push({
      header: (
        <div className="flex flex-col items-center justify-center min-w-17.5 gap-1">
          <span className="text-gray-500 text-[10px] uppercase font-bold text-center tracking-tighter">
            {optionNames[0] || "Phân loại 1"}
          </span>
          <button
            type="button"
            onClick={applyAllCheckedFields}
            disabled={selectedBulkFields.length === 0}
            className="flex items-center gap-1 py-1 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-1 shadow-md transition-all active:scale-95 disabled:opacity-30"
          >
            <Zap size={10} fill="currentColor" />
            <span className="text-[9px] font-bold uppercase">Áp dụng tất cả</span>
          </button>
        </div>
      ),
      className: cn(COL_WIDTHS.GROUP_1, "border-r border-gray-50"),
      cellClassName: "bg-white",
      render: (item, idx) => {
        const meta = processedMetadata[idx];
        if (meta.rowSpan === 0) return { content: null, rowSpan: 0 };
        const isUploading = uploadingIndexes.has(idx);

        return {
          rowSpan: meta.rowSpan,
          content: (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <span className="text-[10px] font-bold text-gray-700 uppercase text-center line-clamp-2 italic leading-tight">
                {meta.label}
              </span>
              <div
                onClick={() => !isUploading && fileInputRefs.current[idx]?.click()}
                className={cn(
                  "w-16 h-16 relative rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center",
                  isUploading ? "bg-orange-50 cursor-not-allowed" : "border-gray-100 hover:border-orange-400 cursor-pointer bg-gray-50"
                )}
              >
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt="v" fill className={cn("object-cover", isUploading && "opacity-30")} />
                ) : !isUploading && <ImageIcon className="text-gray-500" size={20} />}
                {isUploading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={(el) => { if (el) fileInputRefs.current[idx] = el; }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadingIndexes(prev => new Set(prev).add(idx));
                    try { await onUploadImage(file, idx); } 
                    finally { setUploadingIndexes(prev => { const n = new Set(prev); n.delete(idx); return n; }); }
                  }
                }}
              />
            </div>
          ),
        };
      },
    });

    // CỘT 2: NHÓM PHÂN LOẠI 2 (NẾU CÓ)
    if (optionNames.length >= 2) {
      cols.push({
        header: <span className="text-gray-500 text-[10px] uppercase font-bold block text-center">{optionNames[1]}</span>,
        className: COL_WIDTHS.GROUP_2,
        cellClassName: "px-1 text-center border-r border-gray-50",
        render: (item) => <span className="text-[10px] font-bold uppercase text-gray-500">{item.optionValueNames?.[1] || "-"}</span>,
      });
    }

    // CỘT 3: SKU (DÙNG SUB-COMPONENT)
    cols.push({
      header: (
        <SkuHeader
          title="Mã SKU"
          field="sku"
          bulkValues={bulkValues}
          setBulkValues={setBulkValues}
          selectedBulkFields={selectedBulkFields}
          onToggleBulkField={onToggleBulkField}
        />
      ),
      className: COL_WIDTHS.SKU,
      render: (item, idx) => (
        <FormInput
          value={item.sku || ""}
          onChange={(e) => handleInputChange(idx, "sku", e.target.value.toUpperCase())}
          className={tableInputClass}
          placeholder="Mã SKU..."
        />
      ),
    });

    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1 gap-1">
          <span className="text-gray-800 text-[12px] font-bold uppercase mb-1">Giá Bán</span>
          <FormInput
            placeholder="0"
            isCheckbox={true}
            checkboxChecked={selectedBulkFields.includes("price")}
            onCheckboxChange={() => onToggleBulkField("price")}
            value={bulkValues["price"] ? Number(bulkValues["price"]).toLocaleString("vi-VN") : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "").replace(/^0+/, "") || "0";
              setBulkValues(prev => ({ ...prev, price: raw }));
            }}
            className={cn(tableInputClass, "w-full pr-10 text-center font-bold text-orange-600", selectedBulkFields.includes("price") && "border-orange-500 bg-orange-50/20")}
          />
        </div>
      ),
      className: COL_WIDTHS.PRICE,
      render: (item, idx) => (
        <FormInput
          value={item.price ? Number(item.price).toLocaleString("vi-VN") : ""}
          onChange={(e) => handleInputChange(idx, "price", parseNumber(e.target.value))}
          className={cn(tableInputClass, "text-center font-bold text-orange-600 bg-orange-50/10!")}
        />
      ),
    });

    // CỘT 5: KHO HÀNG
    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1 gap-1">
          <span className="text-gray-800 text-[12px] font-bold uppercase mb-1">Kho</span>
          <FormInput
            type="number"
            placeholder="0"
            isCheckbox={true}
            checkboxChecked={selectedBulkFields.includes("stockQuantity")}
            onCheckboxChange={() => onToggleBulkField("stockQuantity")}
            value={bulkValues["stockQuantity"] || ""}
            onChange={(e) => setBulkValues(prev => ({ ...prev, stockQuantity: e.target.value }))}
            className={cn(tableInputClass, "w-full pr-10 text-center", selectedBulkFields.includes("stockQuantity") && "border-orange-500 bg-orange-50/20")}
          />
        </div>
      ),
      className: COL_WIDTHS.STOCK,
      render: (item, idx) => (
        <FormInput
          type="number"
          value={item.stockQuantity ?? ""}
          onChange={(e) => handleInputChange(idx, "stockQuantity", parseNumber(e.target.value))}
          className={cn(tableInputClass, "text-center font-bold")}
        />
      ),
    });

    // CỘT 6: VẬN CHUYỂN (D, R, C, G)
    const logFields = ["lengthCm", "widthCm", "heightCm", "weightGrams"];
    const logLabels = ["D", "R", "C", "G"];
    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1 gap-1">
          <span className="text-gray-800 text-[12px] font-bold uppercase mb-1">Kích thước & Cân nặng</span>
          <div className="flex gap-1 w-full">
            {logLabels.map((l, i) => {
              const f = logFields[i];
              return (
                <FormInput
                  key={l}
                  placeholder={l}
                  isCheckbox={true}
                  checkboxChecked={selectedBulkFields.includes(f)}
                  onCheckboxChange={() => onToggleBulkField(f)}
                  value={bulkValues[f] || ""}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, [f]: e.target.value }))}
                  className={cn(tableInputClass, "flex-1 px-1 pr-6 text-center text-[10px]", selectedBulkFields.includes(f) && "border-orange-500 bg-orange-50/20")}
                />
              );
            })}
          </div>
        </div>
      ),
      className: COL_WIDTHS.LOGISTICS,
      render: (item, idx) => (
        <div className="flex gap-1">
          {logFields.map((f) => (
            <FormInput
              key={f}
              value={item[f as keyof Variant] ?? ""}
              onChange={(e) => handleInputChange(idx, f as any, parseNumber(e.target.value))}
              className={cn(tableInputClass, "flex-1 px-1 text-center")}
            />
          ))}
        </div>
      ),
    });

    return cols;
  }, [optionNames, variants, processedMetadata, selectedBulkFields, bulkValues, applyAllCheckedFields]);
};