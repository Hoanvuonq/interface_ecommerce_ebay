import React, { useMemo, useRef } from "react";
import { Edit, Image as ImageIcon, Plus, Trash2, UploadCloud, Copy } from "lucide-react";

// Helper format tiền tệ
const formatCurrency = (value: number | undefined) => {
  if (!value && value !== 0) return "";
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Helper parse số từ input
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

  // Logic Grouping: Nếu có option, sắp xếp và group theo Option 1
  const { sortedVariants, groups } = useMemo(() => {
    const hasOptions = optionNames.length > 0;
    if (!hasOptions) return { sortedVariants: variants, groups: [] };

    const sorted = [...variants].sort((a, b) => {
      const av = (a.optionValueNames?.[0] || "").toString().toLowerCase();
      const bv = (b.optionValueNames?.[0] || "").toString().toLowerCase();
      return av.localeCompare(bv);
    });

    const groupsArr: { label: string; items: { variant: Variant; originalIndex: number }[] }[] = [];
    
    sorted.forEach((v, idx) => {
        // Tìm lại index gốc trong mảng variants ban đầu để update cho đúng
        const originalIndex = variants.findIndex(item => item === v); 
        const label = (v.optionValueNames?.[0] || "Khác").toString().trim();
        
        const found = groupsArr.find((g) => g.label === label);
        if (found) {
            found.items.push({ variant: v, originalIndex });
        } else {
            groupsArr.push({ label, items: [{ variant: v, originalIndex }] });
        }
    });

    return { sortedVariants: sorted, groups: groupsArr };
  }, [variants, optionNames]);

  // Xử lý update giá trị của 1 dòng
  const handleInputChange = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onUpdateVariants(newVariants);
  };

  // Xử lý Bulk Update (Áp dụng cho tất cả)
  const handleBulkUpdate = (field: keyof Variant, value: any) => {
    if (!value && value !== 0) return;
    const newVariants = variants.map((v) => ({ ...v, [field]: value }));
    onUpdateVariants(newVariants);
  };

  // Xử lý upload ảnh
  const triggerUpload = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file, index);
    }
    // Reset input value để cho phép chọn lại cùng 1 file
    e.target.value = "";
  };

  // --- Render ---
  if (variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Chưa có biến thể nào.</p>
        <p className="text-gray-400 text-sm">Thêm nhóm phân loại để bắt đầu tạo biến thể.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-center border-r w-12">#</th>
            {/* Cột tên phân loại */}
            {optionNames.map((name, idx) => (
              <th key={idx} className="px-4 py-3 border-r min-w-[120px] font-semibold">
                {name}
              </th>
            ))}
            
            {/* Các cột dữ liệu chính */}
            <th className="px-4 py-3 border-r min-w-[140px] font-semibold text-blue-600">SKU <span className="text-red-500">*</span></th>
            <th className="px-4 py-3 border-r min-w-[120px] font-semibold text-right">Giá gốc <span className="text-red-500">*</span></th>
            <th className="px-4 py-3 border-r min-w-[120px] font-semibold text-right">Giá bán <span className="text-red-500">*</span></th>
            <th className="px-4 py-3 border-r min-w-[100px] font-semibold text-right">Kho <span className="text-red-500">*</span></th>
            
            {/* Nhóm kích thước */}
            <th className="px-2 py-3 border-r text-center w-[80px] font-medium text-gray-500">Dài (cm)</th>
            <th className="px-2 py-3 border-r text-center w-[80px] font-medium text-gray-500">Rộng (cm)</th>
            <th className="px-2 py-3 border-r text-center w-[80px] font-medium text-gray-500">Cao (cm)</th>
            <th className="px-2 py-3 text-center w-[90px] font-medium text-gray-500">Nặng (g)</th>
          </tr>
        </thead>

        <tbody className="text-gray-600">
          {/* --- Hàng Bulk Actions (Áp dụng tất cả) --- */}
          <tr className="bg-blue-50/30 border-b border-dashed border-blue-200">
            <td className="px-2 py-3 text-center border-r"><Edit className="w-4 h-4 mx-auto text-blue-400" /></td>
            <td colSpan={optionNames.length} className="px-4 py-3 border-r text-xs text-blue-500 italic font-medium">
              Nhập nhanh cho tất cả dòng bên dưới
            </td>
            <td className="p-2 border-r">
              <input 
                placeholder="SKU chung..." 
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:outline-none focus:border-blue-500 bg-white"
                onBlur={(e) => handleBulkUpdate('sku', e.target.value)}
              />
            </td>
            <td className="p-2 border-r">
                <input type="number" placeholder="0" className="w-full px-2 py-1.5 text-xs text-right border border-blue-200 rounded focus:outline-none focus:border-blue-500 bg-white"
                onBlur={(e) => handleBulkUpdate('corePrice', parseNumber(e.target.value))} />
            </td>
            <td className="p-2 border-r">
                <input type="number" placeholder="0" className="w-full px-2 py-1.5 text-xs text-right border border-blue-200 rounded focus:outline-none focus:border-blue-500 bg-white"
                onBlur={(e) => handleBulkUpdate('price', parseNumber(e.target.value))} />
            </td>
            <td className="p-2 border-r">
                <input type="number" placeholder="0" className="w-full px-2 py-1.5 text-xs text-right border border-blue-200 rounded focus:outline-none focus:border-blue-500 bg-white"
                onBlur={(e) => handleBulkUpdate('stockQuantity', parseNumber(e.target.value))} />
            </td>
            <td className="p-2 border-r"><input type="number" placeholder="0" className="w-full text-center px-1 py-1 text-xs border border-blue-200 rounded bg-white" onBlur={(e) => handleBulkUpdate('lengthCm', parseNumber(e.target.value))} /></td>
            <td className="p-2 border-r"><input type="number" placeholder="0" className="w-full text-center px-1 py-1 text-xs border border-blue-200 rounded bg-white" onBlur={(e) => handleBulkUpdate('widthCm', parseNumber(e.target.value))} /></td>
            <td className="p-2 border-r"><input type="number" placeholder="0" className="w-full text-center px-1 py-1 text-xs border border-blue-200 rounded bg-white" onBlur={(e) => handleBulkUpdate('heightCm', parseNumber(e.target.value))} /></td>
            <td className="p-2"><input type="number" placeholder="0" className="w-full text-center px-1 py-1 text-xs border border-blue-200 rounded bg-white" onBlur={(e) => handleBulkUpdate('weightGrams', parseNumber(e.target.value))} /></td>
          </tr>

          {/* --- Các hàng dữ liệu --- */}
          {optionNames.length > 0 
            ? groups.flatMap((group, gIdx) => 
                group.items.map((item, idxInGroup) => {
                  const variant = item.variant;
                  const idx = item.originalIndex;
                  const isFirstInGroup = idxInGroup === 0;
                  
                  return (
                    <tr key={`${group.label}-${idx}`} className="hover:bg-gray-50 border-b last:border-b-0 border-gray-100">
                      <td className="px-2 py-3 text-center border-r text-gray-400">{idx + 1}</td>
                      
                      {/* Cột Option 1 + Upload Ảnh */}
                      {isFirstInGroup && (
                        <td rowSpan={group.items.length} className="px-4 py-3 border-r bg-white align-top">
                          <div className="flex flex-col gap-2">
                            <span className="font-medium text-gray-800">{group.label}</span>
                            
                            {/* Upload Image Box */}
                            <div 
                              onClick={() => triggerUpload(idx)}
                              className="w-16 h-16 relative border border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center group"
                            >
                              {variant.imageUrl ? (
                                <>
                                  <img src={variant.imageUrl} alt="Variant" className="w-full h-full object-cover rounded" />
                                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded">
                                    <Edit className="w-4 h-4 text-white" />
                                  </div>
                                </>
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="w-5 h-5 text-gray-400 mx-auto" />
                                  <span className="text-[10px] text-gray-400">Ảnh</span>
                                </div>
                              )}
                              
                              {/* Loading Overlay */}
                              {variant.imageProcessing && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/png, image/jpeg, image/jpg"
                              ref={el => { fileInputRefs.current[idx] = el; }}
                              onChange={(e) => onFileChange(e, idx)}
                            />
                          </div>
                        </td>
                      )}

                      {/* Các cột Option còn lại */}
                      {optionNames.slice(1).map((_, optIdx) => (
                        <td key={optIdx} className="px-4 py-3 border-r align-middle">
                          {variant.optionValueNames?.[optIdx + 1] || "-"}
                        </td>
                      ))}

                      {/* Input Data */}
                      <td className="p-2 border-r">
                        <input 
                          type="text" 
                          value={variant.sku} 
                          onChange={(e) => handleInputChange(idx, 'sku', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                          placeholder="SKU"
                        />
                      </td>
                      <td className="p-2 border-r">
                        <input 
                          type="number" 
                          value={variant.corePrice} 
                          onChange={(e) => handleInputChange(idx, 'corePrice', parseNumber(e.target.value))}
                          className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2 border-r">
                        <input 
                          type="number" 
                          value={variant.price} 
                          onChange={(e) => handleInputChange(idx, 'price', parseNumber(e.target.value))}
                          className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2 border-r">
                        <input 
                          type="number" 
                          value={variant.stockQuantity} 
                          onChange={(e) => handleInputChange(idx, 'stockQuantity', parseNumber(e.target.value))}
                          className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      
                      {/* Dimensions */}
                      <td className="p-1 border-r"><input type="number" value={variant.lengthCm || ""} onChange={(e) => handleInputChange(idx, 'lengthCm', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                      <td className="p-1 border-r"><input type="number" value={variant.widthCm || ""} onChange={(e) => handleInputChange(idx, 'widthCm', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                      <td className="p-1 border-r"><input type="number" value={variant.heightCm || ""} onChange={(e) => handleInputChange(idx, 'heightCm', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                      <td className="p-1"><input type="number" value={variant.weightGrams || ""} onChange={(e) => handleInputChange(idx, 'weightGrams', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                    </tr>
                  )
                })
              )
            : 
            /* Trường hợp không có nhóm phân loại (Variant đơn) */
            variants.map((variant, idx) => (
              <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="px-2 py-3 text-center border-r text-gray-400">{idx + 1}</td>
                {/* Không có cột options */}
                <td className="p-2 border-r">
                    <input type="text" value={variant.sku} onChange={(e) => handleInputChange(idx, 'sku', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none" />
                </td>
                <td className="p-2 border-r">
                    <input type="number" value={variant.corePrice} onChange={(e) => handleInputChange(idx, 'corePrice', parseNumber(e.target.value))}
                    className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:border-blue-500 focus:outline-none" />
                </td>
                <td className="p-2 border-r">
                    <input type="number" value={variant.price} onChange={(e) => handleInputChange(idx, 'price', parseNumber(e.target.value))}
                    className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:border-blue-500 focus:outline-none" />
                </td>
                <td className="p-2 border-r">
                    <input type="number" value={variant.stockQuantity} onChange={(e) => handleInputChange(idx, 'stockQuantity', parseNumber(e.target.value))}
                    className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:border-blue-500 focus:outline-none" />
                </td>
                <td className="p-1 border-r"><input type="number" value={variant.lengthCm || ""} onChange={(e) => handleInputChange(idx, 'lengthCm', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                <td className="p-1 border-r"><input type="number" value={variant.widthCm || ""} onChange={(e) => handleInputChange(idx, 'widthCm', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                <td className="p-1 border-r"><input type="number" value={variant.heightCm || ""} onChange={(e) => handleInputChange(idx, 'heightCm', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
                <td className="p-1"><input type="number" value={variant.weightGrams || ""} onChange={(e) => handleInputChange(idx, 'weightGrams', parseNumber(e.target.value))} className="w-full text-center p-1 border rounded text-xs" placeholder="0"/></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};