"use client";

import { FileText, Tag } from "lucide-react";
import { UserProductDTO } from "@/types/product/user-product.dto";

export const ProductGeneralInfo = ({ product, onOpenRichText }: { product: UserProductDTO, onOpenRichText: () => void }) => (
  <div className="bg-white rounded-[2.5rem] shadow-custom border border-gray-50 overflow-hidden">
    <div className="px-8 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
          <FileText size={20} />
        </div>
        <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Thông tin chung</h2>
      </div>
    </div>
    <div className="p-8 space-y-6">
      <div className="group">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tên sản phẩm</label>
        <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700">
          {product.name}
        </div>
      </div>

      <div className="group">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Slug (URL)</label>
        <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-gray-500 font-mono text-xs">
          {product.slug}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Mô tả sản phẩm</label>
          <button
            onClick={onOpenRichText}
            className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-md shadow-orange-200"
          >
            <FileText size={14} /> Chỉnh sửa nâng cao
          </button>
        </div>
        <div className="border border-gray-100 rounded-4xl bg-gray-50/30 p-6 min-h-35 relative">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {product.description || <span className="text-gray-300 italic font-medium">Sản phẩm chưa có mô tả chi tiết...</span>}
          </p>
        </div>
      </div>
    </div>
  </div>
);