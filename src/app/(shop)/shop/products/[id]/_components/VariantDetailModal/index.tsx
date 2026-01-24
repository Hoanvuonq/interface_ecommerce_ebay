"use client";

import React from "react";
import { 
  Edit3, Plus, X, Package, Ruler, Tag, 
  Loader2, Save, ImageIcon, AlertCircle 
} from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { VariantFormValues } from "../../_types/variant";
import { cn } from "@/utils/cn";

interface VariantDetailModalProps {
  open: boolean;
  mode: "create" | "edit" | null;
  values: VariantFormValues | null;
  onClose: () => void;
  onSubmit: () => void;
  saving: boolean;
  imageUploading: boolean;
  onFieldChange: (field: keyof Omit<VariantFormValues, "optionValues">, value: any) => void;
  onOptionChange: (optionName: string, value: string) => void;
  onImageUpload: (file: File | null) => void;
  onImageClear: () => void;
  productOptions: any[];
  singleVariantMode: boolean;
  totalVariants: number;
}

export const VariantDetailModal = ({
  open, mode, values, onClose, onSubmit, saving, 
  imageUploading, onFieldChange, onOptionChange, 
  onImageUpload, onImageClear, productOptions, 
  singleVariantMode, totalVariants
}: VariantDetailModalProps) => {
  
  if (!values) return null;

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <button
        onClick={onClose}
        disabled={saving}
        className="px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
      >
        Hủy bỏ
      </button>
      <button
        onClick={onSubmit}
        disabled={saving || imageUploading}
        className={cn(
          "flex items-center gap-2 px-8 py-2.5 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95",
          saving ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
        )}
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? "ĐANG LƯU..." : mode === "edit" ? "LƯU THAY ĐỔI" : "TẠO BIẾN THỂ"}
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
            {mode === "edit" ? <Edit3 size={20} /> : <Plus size={20} strokeWidth={3} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 uppercase tracking-tight">
              {mode === "edit" ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}
            </h2>
          </div>
        </div>
      }
      footer={footer}
    >
      <div className="space-y-6 py-2">
        {/* Cảnh báo chế độ đơn biến thể */}
        {singleVariantMode && totalVariants >= 1 && mode === "create" && (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
              Lưu ý: Sản phẩm chưa có phân loại (Màu sắc, Size...). Bạn nên thêm phân loại trước khi tạo thêm biến thể mới.
            </p>
          </div>
        )}

        {/* Upload Ảnh */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Ảnh đại diện biến thể</label>
          <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {values.imageUrl ? (
                <img src={values.imageUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-gray-200" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer hover:border-gray-300 hover:text-orange-600 transition-all shadow-sm">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageUpload(e.target.files?.[0] || null)} />
                {imageUploading ? "Đang tải lên..." : "Thay đổi hình ảnh"}
              </label>
              {values.imageAssetId && (
                <button onClick={onImageClear} className="text-[11px] font-bold text-red-500 hover:underline text-left ml-1">
                  Gỡ bỏ ảnh
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid thông tin chính */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mã SKU *</label>
            <input
              type="text"
              value={values.sku}
              onChange={(e) => onFieldChange("sku", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-gray-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-gray-700 transition-all border"
              placeholder="VD: NEM-CS-01"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Số lượng tồn kho *</label>
            <input
              type="number"
              value={values.stockQuantity}
              onChange={(e) => onFieldChange("stockQuantity", Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-gray-500 outline-none font-bold text-gray-700 border"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Giá gốc (₫) *</label>
            <input
              type="number"
              value={values.corePrice}
              onChange={(e) => onFieldChange("corePrice", Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-gray-500 outline-none font-bold text-gray-500 border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-orange-500 uppercase tracking-widest ml-1">Giá bán hiện tại (₫) *</label>
            <input
              type="number"
              value={values.price}
              onChange={(e) => onFieldChange("price", Number(e.target.value))}
              className="w-full px-4 py-3 bg-orange-50/30 border-gray-100 rounded-2xl focus:bg-white focus:border-gray-500 outline-none font-bold text-orange-600 border"
            />
          </div>
        </div>

        {/* Kích thước */}
        <div className="p-5 bg-gray-50/50 rounded-4xl border border-gray-100 space-y-4">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase  flex items-center gap-2">
            <Ruler size={14} /> Thông số vận chuyển
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {["lengthCm", "widthCm", "heightCm"].map((field) => (
              <div key={field}>
                <input
                  type="number"
                  value={(values as any)[field]}
                  onChange={(e) => onFieldChange(field as any, Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-center font-bold text-sm outline-none focus:border-gray-300"
                  placeholder={field === "lengthCm" ? "Dài" : field === "widthCm" ? "Rộng" : "Cao"}
                />
              </div>
            ))}
          </div>
          <div className="relative">
            <input
              type="number"
              value={values.weightGrams}
              onChange={(e) => onFieldChange("weightGrams", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-gray-300"
              placeholder="Trọng lượng (gram)"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase">Gram</span>
          </div>
        </div>

        {/* Thuộc tính động */}
        {productOptions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase  flex items-center gap-2 ml-1">
              <Tag size={14} /> Giá trị phân loại
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {productOptions.map((option) => (
                <div key={option.name} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{option.name}</label>
                  <input
                    type="text"
                    value={values.optionValues[option.name] || ""}
                    onChange={(e) => onOptionChange(option.name, e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-gray-300"
                    placeholder="VD: Trắng, XL..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};