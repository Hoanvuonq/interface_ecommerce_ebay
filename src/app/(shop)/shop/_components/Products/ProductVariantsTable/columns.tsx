import { cn } from "@/utils/cn";
import { ImageIcon, Zap } from "lucide-react";
import React, { useMemo } from "react";
import { FormInput } from "@/components";
import { Column } from "@/components/DataTable/type";
import Image from "next/image";
import { Variant } from "./type";

const parseNumber = (value: string) => {
  return parseFloat(value.replace(/,/g, "")) || 0;
};

const COL_WIDTHS = {
  GROUP_1: "w-[80px]",
  GROUP_2: "w-[100px]",
  SKU: "w-[160px]",
  PRICE: "w-[140px]",
  STOCK: "w-[100px]",
  LOGISTICS: "w-[280px]",
};

const tableInputClass =
  "h-9 rounded-xl px-3 text-[11px] font-bold bg-white border-gray-300 focus:border-orange-500 shadow-none transition-all";

export const useProductVariantsColumns = (
  variants: Variant[],
  optionNames: string[],
  groupMetadata: { isFirst: boolean; label: string; rowSpan?: number }[],
  fileInputRefs: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>,
  handleInputChange: (index: number, field: keyof Variant, value: any) => void,
  handleBulkUpdate: (field: keyof Variant, value: any) => void,
  onUploadImage: (file: File, index: number) => Promise<void>
): Column<Variant>[] => {

  // Logic FIX: Tính toán chính xác RowSpan và đánh dấu các ô bị gộp
  const processedMetadata = useMemo(() => {
    const result = groupMetadata.map(m => ({ ...m }));
    for (let i = 0; i < result.length; i++) {
      if (result[i].isFirst) {
        let count = 1;
        // Đếm các dòng tiếp theo thuộc nhóm này
        for (let j = i + 1; j < result.length; j++) {
          if (!result[j].isFirst) count++;
          else break;
        }
        result[i].rowSpan = count;
      } else {
        // Đánh dấu là 0 để DataTable nhận diện và không render thẻ <td>
        result[i].rowSpan = 0; 
      }
    }
    return result;
  }, [groupMetadata]);

  return useMemo(() => {
    const cols: Column<Variant>[] = [];

    // 1. CỘT PHÂN LOẠI 1 (Gộp dòng)
    cols.push({
      header: (
        <div className="flex flex-col items-center justify-center min-w-[70px]">
          <span className="text-gray-400 text-[10px] uppercase font-bold truncate w-full text-center">
            {optionNames[0] || "Nhóm 1"}
          </span>
          <div className="flex items-center gap-1 py-0.5 px-2 bg-orange-100 rounded-full text-orange-600 mt-1 shadow-sm">
            <Zap size={10} fill="currentColor" />
            <span className="text-[9px] font-bold uppercase whitespace-nowrap">Tất cả</span>
          </div>
        </div>
      ),
      className: cn(COL_WIDTHS.GROUP_1, "border-r border-gray-50"),
      cellClassName: "bg-white",
      render: (item, idx) => {
        const meta = processedMetadata[idx];

        // Trả về rowSpan: 0 để báo hiệu cho DataTable ẩn ô này đi
        if (meta.rowSpan === 0) return { content: null, rowSpan: 0 };

        return {
          rowSpan: meta.rowSpan,
          content: (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <span className="text-[10px] font-bold text-gray-700 uppercase text-center line-clamp-2 w-full px-1">
                {meta.label}
              </span>
              <div
                onClick={() => fileInputRefs.current[idx]?.click()}
                className="w-14 h-14 relative rounded-xl border-2 border-orange-100 hover:border-orange-400 overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center shrink-0 transition-all shadow-sm"
              >
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt="v" fill sizes="56px" className="object-cover" />
                ) : (
                  <ImageIcon className="text-gray-300" size={18} />
                )}
              </div>
              <input
                type="file" className="hidden" accept="image/*"
                ref={(el) => { if (el) fileInputRefs.current[idx] = el; }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadImage(file, idx);
                }}
              />
            </div>
          ),
        };
      },
    });

    // ... (Các cột khác như Phân loại 2, SKU, Giá... giữ nguyên render thường)
    // Ví dụ Cột Phân loại 2:
    if (optionNames.length >= 2) {
      cols.push({
        header: (
          <span className="text-gray-400 text-[10px] uppercase font-bold block text-center">
            {optionNames[1]}
          </span>
        ),
        className: COL_WIDTHS.GROUP_2,
        cellClassName: "px-1 text-center border-r border-gray-50",
        render: (item) => (
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 uppercase whitespace-nowrap">
              {item.optionValueNames?.[1] || "-"}
            </span>
          </div>
        ),
      });
    }
    // 3. CỘT SKU
    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-gray-800 text-[11px] font-bold mb-1">
            Mã SKU
          </span>
          <FormInput
            placeholder="Mã chung..."
            className={cn(tableInputClass, "w-full")}
            onBlur={(e) => handleBulkUpdate("sku", e.target.value)}
          />
        </div>
      ),
      className: COL_WIDTHS.SKU,
      cellClassName: "px-2",
      render: (item, idx) => (
        <FormInput
          value={item.sku || ""}
          onChange={(e) => handleInputChange(idx, "sku", e.target.value)}
          className={tableInputClass}
          placeholder="Nhập SKU..."
        />
      ),
    });

    // 4. CỘT GIÁ BÁN
    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-gray-800 text-[11px] font-bold mb-1">
            Giá Bán
          </span>
          <FormInput
            type="number"
            placeholder="0"
            className={cn(tableInputClass, "text-center w-full")}
            onBlur={(e) =>
              handleBulkUpdate("price", parseNumber(e.target.value))
            }
          />
        </div>
      ),
      className: COL_WIDTHS.PRICE,
      cellClassName: "px-2",
      render: (item, idx) => (
        <FormInput
          type="number"
          value={item.price ?? 0}
          onChange={(e) =>
            handleInputChange(idx, "price", parseNumber(e.target.value))
          }
          className={cn(
            tableInputClass,
            "text-center font-bold text-orange-600 bg-orange-50/30!"
          )}
        />
      ),
    });

    // 5. CỘT KHO
    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-gray-800 text-[11px] font-bold mb-1">Kho</span>
          <FormInput
            type="number"
            placeholder="0"
            className={cn(tableInputClass, "text-center w-full")}
            onBlur={(e) =>
              handleBulkUpdate("stockQuantity", parseNumber(e.target.value))
            }
          />
        </div>
      ),
      className: COL_WIDTHS.STOCK,
      cellClassName: "px-2",
      render: (item, idx) => (
        <FormInput
          type="number"
          value={item.stockQuantity ?? 0}
          onChange={(e) =>
            handleInputChange(idx, "stockQuantity", parseNumber(e.target.value))
          }
          className={cn(tableInputClass, "text-center font-bold")}
        />
      ),
    });

    // 6. CỘT LOGISTICS (D-R-C-G)
    cols.push({
      header: (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-gray-800 text-[10px] font-bold mb-1 uppercase">
            Kích thước (D-R-C-G)
          </span>
          <div className="flex gap-1 w-full">
            {["D", "R", "C", "G"].map((l, i) => (
              <FormInput
                key={l}
                type="number"
                placeholder={l}
                className={cn(tableInputClass, "text-center px-1")}
                onBlur={(e) => {
                  const fields: (keyof Variant)[] = [
                    "lengthCm",
                    "widthCm",
                    "heightCm",
                    "weightGrams",
                  ];
                  handleBulkUpdate(fields[i], parseNumber(e.target.value));
                }}
              />
            ))}
          </div>
        </div>
      ),
      className: COL_WIDTHS.LOGISTICS,
      cellClassName: "px-2",
      render: (item, idx) => (
        <div className="flex gap-1 justify-center">
          {["lengthCm", "widthCm", "heightCm", "weightGrams"].map((f) => (
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
    groupMetadata,
    fileInputRefs,
    handleInputChange,
    handleBulkUpdate,
    onUploadImage,
  ]);
};
export { COL_WIDTHS, parseNumber };
