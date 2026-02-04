"use client";

import { FileText } from "lucide-react";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { FormInput } from "@/components";
import { cn } from "@/utils/cn";

export const ProductGeneralInfo = ({
  product,
  onOpenRichText,
}: {
  product: UserProductDTO;
  onOpenRichText: () => void;
}) => {
  return (
    <div className="bg-white rounded-4xl shadow-custom border border-gray-50 overflow-hidden transition-all duration-300 hover:shadow-orange-100/50">
      {/* Header tinh tế */}
      <div className="px-8 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 rounded-2xl text-orange-600 shadow-sm shadow-orange-100">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-800  uppercase italic">
              Thông tin chung
            </h2>
            <p className="text-[12px] text-gray-600 font-semibold italic leading-none mt-0.5">
              Chi tiết định danh sản phẩm
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-4">
        <FormInput
          label="Tên sản phẩm"
          value={product.name}
          readOnly
          className="bg-gray-50/80 font-bold  text-gray-800 border-gray-100 cursor-default"
          containerClassName="group"
        />

        <FormInput
          label="Slug (URL Định danh)"
          value={product.slug}
          readOnly
          className="bg-gray-50/50 font-mono text-xs  text-gray-500 border-gray-100 cursor-default"
          containerClassName="group"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">
              Mô tả sản phẩm
            </label>
            {/* <button
              onClick={onOpenRichText}
              className="group flex items-center gap-2 px-5 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 shadow-md shadow-orange-100"
            >
              <FileText
                size={14}
                className="group-hover:rotate-12 transition-transform"
              />
              Chỉnh sửa nâng cao
            </button> */}
          </div>

          <div className="relative group">
            <FormInput
              isTextArea
              value={product.description || ""}
              placeholder="Sản phẩm chưa có mô tả chi tiết..."
              readOnly
              className={cn(
                "min-h-40 py-6 leading-relaxed bg-gray-50/30 border-gray-100 transition-all group-hover:bg-white",
                !product.description && "italic text-gray-500",
              )}
            />
            {/* Hiệu ứng trang trí góc cho TextArea chuẩn Web3 */}
            <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <FileText size={40} strokeWidth={1} />
            </div>
          </div>

          <p className="text-[10px] text-gray-500 font-medium italic ml-2">
            * Sử dụng "Chỉnh sửa nâng cao" để thêm định dạng văn bản, hình ảnh
            và video.
          </p>
        </div>
      </div>
    </div>
  );
};
