import { cn } from "@/utils/cn";
import { ImageIcon, Zap } from "lucide-react";
import React, { useMemo, useState } from "react";
import { FormInput, Checkbox } from "@/components";
import { Column } from "@/components/DataTable/type";
import Image from "next/image";
import { Variant } from "./type";

const parseNumber = (value: string) => {
  return parseFloat(value.replace(/,/g, "")) || 0;
};

const COL_WIDTHS = {
  GROUP_1: "w-[100px]",
  GROUP_2: "w-[100px]",
  SKU: "w-[160px]",
  PRICE: "w-[140px]",
  STOCK: "w-[100px]",
  LOGISTICS: "w-[320px]",
};

const tableInputClass =
  "h-9 rounded-xl px-3 text-[11px] font-bold bg-white border-gray-300 focus:border-orange-500 shadow-none transition-all";

export const useProductVariantsColumns = (
  variants: Variant[],
  optionNames: string[],
  groupMetadata: { isFirst: boolean; label: string; rowSpan?: number }[],
  fileInputRefs: React.MutableRefObject<{
    [key: number]: HTMLInputElement | null;
  }>,
  handleInputChange: (index: number, field: keyof Variant, value: any) => void,
  handleBulkUpdate: (field: keyof Variant, value: any) => void,
  onUploadImage: (file: File, index: number) => Promise<void>,

  selectedBulkFields: string[],
  onToggleBulkField: (field: string) => void,
): Column<Variant>[] => {
  const [bulkValues, setBulkValues] = useState<{ [key: string]: string }>({});
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(
    new Set(),
  );
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

  const applyAllCheckedFields = () => {
    console.log("Selected bulk fields:", selectedBulkFields);
    console.log("Bulk values:", bulkValues);

    if (selectedBulkFields.length === 0) return;

    const bulkUpdates: { [key: string]: any } = {};

    selectedBulkFields.forEach((field) => {
      const rawValue = bulkValues[field];
      const isNumber = [
        "price",
        "stockQuantity",
        "lengthCm",
        "widthCm",
        "heightCm",
        "weightGrams",
      ].includes(field);

      let valueToApply;
      if (rawValue === undefined || rawValue === "") {
        valueToApply = isNumber ? 0 : "";
      } else {
        valueToApply = isNumber ? parseNumber(rawValue) : rawValue;
      }

      bulkUpdates[field] = valueToApply;
      console.log(`Prepared bulk update: ${field} = ${valueToApply}`);
    });

    console.log("Bulk updates object:", bulkUpdates);

    handleBulkUpdate("BULK_UPDATE" as any, bulkUpdates);

    console.log("All fields applied successfully via bulk update!");
  };

  return useMemo(() => {
    const cols: Column<Variant>[] = [];

    cols.push({
      header: (
        <div className="flex flex-col items-center justify-center min-w-17.5 gap-1">
          <span className="text-gray-400 text-[10px] uppercase font-bold truncate w-full text-center tracking-tighter">
            {optionNames[0] || "Nhóm 1"}
          </span>
          <button
            type="button"
            onClick={applyAllCheckedFields}
            disabled={selectedBulkFields.length === 0}
            className="flex items-center gap-1 py-1 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-1 shadow-md transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
          >
            <Zap size={10} fill="currentColor" />
            <span className="text-[9px] font-bold uppercase whitespace-nowrap">
              Áp dụng tất cả
            </span>
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
            <div className="flex flex-col items-center justify-center gap-2 py-2 group">
              <span className="text-[10px] font-bold text-gray-700 uppercase text-center line-clamp-2 w-full px-1 italic leading-tight">
                {meta.label}
              </span>

              <div
                onClick={() =>
                  !isUploading && fileInputRefs.current[idx]?.click()
                }
                className={cn(
                  "w-20 h-20 relative rounded-xl border-2 border-dashed overflow-hidden transition-all shadow-sm flex items-center justify-center shrink-0",
                  isUploading
                    ? "border-orange-300 bg-orange-50/50 cursor-not-allowed"
                    : "border-gray-100 hover:border-orange-400 cursor-pointer bg-gray-50",
                )}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt="v"
                    fill
                    sizes="80px"
                    className={cn(
                      "object-cover transition-opacity",
                      isUploading ? "opacity-30" : "opacity-100",
                    )}
                  />
                ) : (
                  !isUploading && (
                    <ImageIcon className="text-gray-300" size={24} />
                  )
                )}

                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px]">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[8px] font-bold text-orange-600 mt-1 uppercase tracking-tighter">
                      Đang tải
                    </span>
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
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadingIndexes((prev) => new Set(prev).add(idx));
                    try {
                      await onUploadImage(file, idx);
                    } finally {
                      setUploadingIndexes((prev) => {
                        const next = new Set(prev);
                        next.delete(idx);
                        return next;
                      });
                    }
                  }
                }}
              />
            </div>
          ),
        };
      },
    });

    if (optionNames.length >= 2) {
      cols.push({
        header: (
          <span className="text-gray-400 text-[10px] uppercase font-bold block text-center tracking-tighter">
            {optionNames[1]}
          </span>
        ),
        className: COL_WIDTHS.GROUP_2,
        cellClassName: "px-1 text-center border-r border-gray-50",
        render: (item) => {
          const val = item.optionValueNames?.[1] || "-";
          return (
            <div className="flex justify-center italic text-gray-400">
              <span className="text-[10px] font-bold uppercase whitespace-nowrap">
                {val}
              </span>
            </div>
          );
        },
      });
    }

    // HELPER RENDER BULK HEADER CÓ CHECKBOX BÊN TRONG
    const renderStandardBulkHeader = (
      title: string,
      field: string,
      placeholder: string,
      type = "text",
    ) => {
      const isPriceField = field === "price";
      
      return (
        <div className="flex flex-col items-center w-full px-1 gap-1">
          <span className="text-gray-800 text-[12px] font-bold uppercase tracking-wider mb-1 leading-none">
            {title}
          </span>
          <FormInput
            type={isPriceField ? "text" : type}
            inputMode={isPriceField ? "numeric" : undefined}
            maxLengthNumber={isPriceField ? 13 : undefined}
            placeholder={placeholder}
            isCheckbox={true}
            checkboxChecked={selectedBulkFields.includes(field)}
            onCheckboxChange={() => onToggleBulkField(field)}
            value={
              isPriceField && bulkValues[field] 
                ? Number(bulkValues[field]).toLocaleString("vi-VN")
                : bulkValues[field] || ""
            }
            onChange={(e) => {
              if (isPriceField) {
                const raw = e.target.value.replace(/\D/g, "");
                const cleanRaw = raw.replace(/^0+/, "") || "0";
                setBulkValues((prev) => ({ ...prev, [field]: cleanRaw }));
              } else {
                setBulkValues((prev) => ({ ...prev, [field]: e.target.value }));
              }
            }}
            className={cn(
              tableInputClass,
              "w-full pr-11",
              isPriceField && "text-center font-bold text-gray-800 bg-orange-50/30",
              selectedBulkFields.includes(field) &&
                "border-orange-500 bg-orange-50/20",
            )}
          />
        </div>
      );
    };

    // 3, 4, 5: SKU, GIÁ, KHO
    cols.push({
      header: renderStandardBulkHeader("Mã SKU", "sku", "Mã chung..."),
      className: COL_WIDTHS.SKU,
      render: (item, idx) => (
        <FormInput
          value={item.sku || ""}
          onChange={(e) => handleInputChange(idx, "sku", e.target.value)}
          className={tableInputClass}
          placeholder="SKU..."
        />
      ),
    });

    cols.push({
      header: renderStandardBulkHeader("Giá Bán", "price", "0"),
      className: COL_WIDTHS.PRICE,
      render: (item, idx) => (
        <FormInput
          inputMode="numeric"
          maxLengthNumber={13}
          value={item.price ? Number(item.price).toLocaleString("vi-VN") : ""}
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            const cleanRaw = raw.replace(/^0+/, "");
            handleInputChange(idx, "price", parseNumber(cleanRaw));
          }}
          className={cn(
            tableInputClass,
            "text-center font-bold text-gray-800 bg-orange-50/30!",
          )}
        />
      ),
    });

    cols.push({
      header: renderStandardBulkHeader("Kho", "stockQuantity", "0", "number"),
      className: COL_WIDTHS.STOCK,
      render: (item, idx) => (
        <FormInput
          type="number"
          maxLengthNumber={10}
          value={item.stockQuantity ?? ""}
          onChange={(e) => {
            handleInputChange(
              idx,
              "stockQuantity",
              parseNumber(e.target.value),
            );
          }}
          className={cn(tableInputClass, "text-center font-bold")}
        />
      ),
    });

    const logFields = ["lengthCm", "widthCm", "heightCm", "weightGrams"];
    const logLabels = ["D", "R", "C", "G"];

    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1 gap-1">
          <span className="text-gray-800 text-[12px] font-bold uppercase tracking-wider mb-1 leading-none">
            Dài | Rộng | Cao | Gam
          </span>
          <div className="flex gap-1 w-full relative">
            {logLabels.map((l, i) => {
              const field = logFields[i];
              const isChecked = selectedBulkFields.includes(field);
              return (
                <div key={l} className="flex-1">
                  <FormInput
                    type="number"
                    placeholder={l}
                    isCheckbox={true}
                    checkboxChecked={isChecked}
                    onCheckboxChange={() => onToggleBulkField(field)}
                    value={bulkValues[field] || ""}
                    onChange={(e) =>
                      setBulkValues((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className={cn(
                      tableInputClass,
                      "text-center px-1 pr-6 text-[12px]!",
                      isChecked && "border-orange-500 bg-orange-50/20",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ),
      className: COL_WIDTHS.LOGISTICS,
      cellClassName: "px-2",
      render: (item, idx) => (
        <div className="flex gap-1 justify-center">
          {logFields.map((f) => (
            <FormInput
              key={f}
              type="number"
              value={item[f as keyof Variant] ?? ""}
              onChange={(e) =>
                handleInputChange(idx, f as any, parseNumber(e.target.value))
              }
              className={cn(tableInputClass, "text-center px-1 font-bold")}
            />
          ))}
        </div>
      ),
    });

    return cols;
  }, [
    optionNames,
    variants,
    processedMetadata,
    selectedBulkFields,
    bulkValues,
  ]);
};
