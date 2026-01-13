"use client";
import React, { useMemo, useRef } from "react";
import {
  Edit,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  Copy,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";

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

  const { sortedVariants, groups } = useMemo(() => {
    const hasOptions = optionNames.length > 0;
    if (!hasOptions) return { sortedVariants: variants, groups: [] };

    const sorted = [...variants].sort((a, b) => {
      const av = (a.optionValueNames?.[0] || "").toString().toLowerCase();
      const bv = (b.optionValueNames?.[0] || "").toString().toLowerCase();
      return av.localeCompare(bv);
    });

    const groupsArr: {
      label: string;
      items: { variant: Variant; originalIndex: number }[];
    }[] = [];
    sorted.forEach((v) => {
      const originalIndex = variants.findIndex((item) => item === v);
      const label = (v.optionValueNames?.[0] || "Khác").toString().trim();
      const found = groupsArr.find((g) => g.label === label);
      if (found) found.items.push({ variant: v, originalIndex });
      else groupsArr.push({ label, items: [{ variant: v, originalIndex }] });
    });

    return { sortedVariants: sorted, groups: groupsArr };
  }, [variants, optionNames]);

  const handleInputChange = (
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onUpdateVariants(newVariants);
  };

  const handleBulkUpdate = (field: keyof Variant, value: any) => {
    if (!value && value !== 0) return;
    const newVariants = variants.map((v) => ({ ...v, [field]: value }));
    onUpdateVariants(newVariants);
  };

  if (variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-orange-50/20">
        <div className="p-4 bg-white rounded-3xl shadow-sm mb-4">
          <Plus className="w-10 h-10 text-orange-200" />
        </div>
        <p className="text-gray-500 font-bold">Chưa có biến thể nào</p>
        <p className="text-gray-400 text-sm">
          Vui lòng thêm phân loại để hệ thống tạo danh sách.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 text-xs font-semibold border border-gray-100 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all bg-white";

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest w-12">
              #
            </th>
            {optionNames.map((name, idx) => (
              <th
                key={idx}
                className="px-4 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-widest min-w-[120px]"
              >
                {name}
              </th>
            ))}
            <th className="px-4 py-4 text-[11px] font-bold text-orange-600 uppercase tracking-widest min-w-[150px]">
              SKU
            </th>
            <th className="px-4 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-widest min-w-[130px] text-right">
              Giá gốc
            </th>
            <th className="px-4 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-widest min-w-[130px] text-right">
              Giá bán
            </th>
            <th className="px-4 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-widest min-w-[110px] text-right">
              Kho hàng
            </th>
            <th className="px-2 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center w-[280px]">
              Kích thước (D x R x C) & Nặng
            </th>
          </tr>
        </thead>

        <tbody>
          {/* --- Bulk Actions Row --- */}
          <tr className="bg-orange-50/50 border-b border-orange-100/50 group">
            <td className="px-2 py-4 text-center">
              <Zap className="w-4 h-4 mx-auto text-orange-400 fill-orange-400" />
            </td>
            <td colSpan={optionNames.length} className="px-4 py-4">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                Áp dụng nhanh cho tất cả
              </span>
            </td>
            <td className="p-2">
              <input
                placeholder="SKU chung..."
                className={cn(
                  inputClass,
                  "placeholder:text-orange-200 border-orange-100"
                )}
                onBlur={(e) => handleBulkUpdate("sku", e.target.value)}
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                placeholder="0"
                className={cn(
                  inputClass,
                  "text-right placeholder:text-orange-200 border-orange-100"
                )}
                onBlur={(e) =>
                  handleBulkUpdate("corePrice", parseNumber(e.target.value))
                }
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                placeholder="0"
                className={cn(
                  inputClass,
                  "text-right placeholder:text-orange-200 border-orange-100"
                )}
                onBlur={(e) =>
                  handleBulkUpdate("price", parseNumber(e.target.value))
                }
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                placeholder="0"
                className={cn(
                  inputClass,
                  "text-right placeholder:text-orange-200 border-orange-100"
                )}
                onBlur={(e) =>
                  handleBulkUpdate("stockQuantity", parseNumber(e.target.value))
                }
              />
            </td>
            <td className="p-2">
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="D"
                  className={cn(
                    inputClass,
                    "text-center px-1 border-orange-100"
                  )}
                  onBlur={(e) =>
                    handleBulkUpdate("lengthCm", parseNumber(e.target.value))
                  }
                />
                <input
                  type="number"
                  placeholder="R"
                  className={cn(
                    inputClass,
                    "text-center px-1 border-orange-100"
                  )}
                  onBlur={(e) =>
                    handleBulkUpdate("widthCm", parseNumber(e.target.value))
                  }
                />
                <input
                  type="number"
                  placeholder="C"
                  className={cn(
                    inputClass,
                    "text-center px-1 border-orange-100"
                  )}
                  onBlur={(e) =>
                    handleBulkUpdate("heightCm", parseNumber(e.target.value))
                  }
                />
                <input
                  type="number"
                  placeholder="G"
                  className={cn(
                    inputClass,
                    "text-center px-1 border-orange-100"
                  )}
                  onBlur={(e) =>
                    handleBulkUpdate("weightGrams", parseNumber(e.target.value))
                  }
                />
              </div>
            </td>
          </tr>

          {/* --- Data Rows --- */}
          {optionNames.length > 0
            ? groups.flatMap((group, gIdx) =>
                group.items.map((item, idxInGroup) => {
                  const variant = item.variant;
                  const idx = item.originalIndex;
                  const isFirstInGroup = idxInGroup === 0;

                  return (
                    <tr
                      key={`${group.label}-${idx}`}
                      className="hover:bg-orange-50/20 border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <td className="px-2 py-4 text-center text-[10px] font-bold text-gray-300">
                        {idx + 1}
                      </td>

                      {isFirstInGroup && (
                        <td
                          rowSpan={group.items.length}
                          className="px-4 py-4 bg-white align-top border-r border-gray-50"
                        >
                          <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold text-gray-700">
                              {group.label}
                            </span>
                            <div
                              onClick={() =>
                                fileInputRefs.current[idx]?.click()
                              }
                              className="w-20 h-20 relative border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center justify-center group/img overflow-hidden shadow-sm"
                            >
                              {variant.imageUrl ? (
                                <>
                                  <img
                                    src={variant.imageUrl}
                                    alt="V"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-orange-600/60 hidden group-hover/img:flex items-center justify-center transition-all">
                                    <Edit className="w-5 h-5 text-white" />
                                  </div>
                                </>
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="w-6 h-6 text-gray-200 mx-auto" />
                                  <span className="text-[9px] font-bold text-gray-300 uppercase mt-1 block">
                                    Thêm ảnh
                                  </span>
                                </div>
                              )}
                              {variant.imageProcessing && (
                                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              ref={(el) => {
                                fileInputRefs.current[idx] = el;
                              }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUploadImage(file, idx);
                                e.target.value = "";
                              }}
                            />
                          </div>
                        </td>
                      )}

                      {optionNames.slice(1).map((_, optIdx) => (
                        <td
                          key={optIdx}
                          className="px-4 py-4 text-sm font-semibold text-gray-500"
                        >
                          {variant.optionValueNames?.[optIdx + 1] || "-"}
                        </td>
                      ))}

                      <td className="p-2">
                        <input
                          value={variant.sku}
                          onChange={(e) =>
                            handleInputChange(idx, "sku", e.target.value)
                          }
                          className={inputClass}
                          placeholder="SKU"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={variant.corePrice}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              "corePrice",
                              parseNumber(e.target.value)
                            )
                          }
                          className={cn(inputClass, "text-right")}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              "price",
                              parseNumber(e.target.value)
                            )
                          }
                          className={cn(inputClass, "text-right")}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              "stockQuantity",
                              parseNumber(e.target.value)
                            )
                          }
                          className={cn(inputClass, "text-right")}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={variant.lengthCm || ""}
                            onChange={(e) =>
                              handleInputChange(
                                idx,
                                "lengthCm",
                                parseNumber(e.target.value)
                              )
                            }
                            className={cn(inputClass, "text-center px-1")}
                            placeholder="D"
                          />
                          <input
                            type="number"
                            value={variant.widthCm || ""}
                            onChange={(e) =>
                              handleInputChange(
                                idx,
                                "widthCm",
                                parseNumber(e.target.value)
                              )
                            }
                            className={cn(inputClass, "text-center px-1")}
                            placeholder="R"
                          />
                          <input
                            type="number"
                            value={variant.heightCm || ""}
                            onChange={(e) =>
                              handleInputChange(
                                idx,
                                "heightCm",
                                parseNumber(e.target.value)
                              )
                            }
                            className={cn(inputClass, "text-center px-1")}
                            placeholder="C"
                          />
                          <input
                            type="number"
                            value={variant.weightGrams || ""}
                            onChange={(e) =>
                              handleInputChange(
                                idx,
                                "weightGrams",
                                parseNumber(e.target.value)
                              )
                            }
                            className={cn(inputClass, "text-center px-1")}
                            placeholder="G"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )
            : variants.map((variant, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-orange-50/20 border-b border-gray-50 last:border-0 transition-colors"
                >
                  <td className="px-2 py-4 text-center text-[10px] font-bold text-gray-300">
                    {idx + 1}
                  </td>
                  <td className="p-2">
                    <input
                      value={variant.sku}
                      onChange={(e) =>
                        handleInputChange(idx, "sku", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={variant.corePrice}
                      onChange={(e) =>
                        handleInputChange(
                          idx,
                          "corePrice",
                          parseNumber(e.target.value)
                        )
                      }
                      className={cn(inputClass, "text-right")}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleInputChange(
                          idx,
                          "price",
                          parseNumber(e.target.value)
                        )
                      }
                      className={cn(inputClass, "text-right")}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        handleInputChange(
                          idx,
                          "stockQuantity",
                          parseNumber(e.target.value)
                        )
                      }
                      className={cn(inputClass, "text-right")}
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={variant.lengthCm || ""}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            "lengthCm",
                            parseNumber(e.target.value)
                          )
                        }
                        className={cn(inputClass, "text-center px-1")}
                      />
                      <input
                        type="number"
                        value={variant.widthCm || ""}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            "widthCm",
                            parseNumber(e.target.value)
                          )
                        }
                        className={cn(inputClass, "text-center px-1")}
                      />
                      <input
                        type="number"
                        value={variant.heightCm || ""}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            "heightCm",
                            parseNumber(e.target.value)
                          )
                        }
                        className={cn(inputClass, "text-center px-1")}
                      />
                      <input
                        type="number"
                        value={variant.weightGrams || ""}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            "weightGrams",
                            parseNumber(e.target.value)
                          )
                        }
                        className={cn(inputClass, "text-center px-1")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
