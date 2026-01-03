"use client";

import React from "react";
import _ from "lodash";
import { Search, Info, Send, X, Package } from "lucide-react";
import { toPublicUrl } from "@/utils/storage/url";
import { ProductPickerProps } from "./type";

export const ProductPicker: React.FC<ProductPickerProps> = ({
  isVisible,
  onClose,
  products,
  isLoading,
  searchText,
  onSearchChange,
  onSendDirect,
  onViewDetails,
  isSending,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300">
      {/* Header & Search */}
      <div className="px-4 py-3 border-b border-slate-100 bg-linear-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-tight">
            <Info size={16} />
            Chọn sản phẩm gửi Shop
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Product List Area */}
      <div className="max-h-[380px] overflow-y-auto custom-scrollbar bg-slate-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Đang tải sản phẩm...</span>
          </div>
        ) : _.isEmpty(products) ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Package size={40} className="opacity-20 mb-2" />
            <p className="text-sm">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white">
            {_.map(products, (product) => {
              // Logic lấy ảnh dùng Lodash gọn hơn
              const mediaImg = _.find(_.get(product, "media"), (m) => m.type === "IMAGE" && m.url);
              const productImageUrl = toPublicUrl(
                mediaImg?.url || product.thumbnailUrl || product.imageUrl || ""
              );
              const price = _.get(product, "basePrice") || _.get(product, "price") || 0;

              return (
                <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-blue-50/30 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50">
                    <img
                      src={productImageUrl || "/avt.jpg"}
                      className="w-full h-full object-cover"
                      alt={product.name}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-800 truncate mb-1">
                      {product.name}
                    </h5>
                    <p className="text-sm font-black text-blue-600">
                      {price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => onSendDirect(product)}
                      disabled={isSending}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-300"
                    >
                      {isSending ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={12} fill="currentColor" />
                      )}
                      Gửi
                    </button>
                    <button
                      onClick={() => onViewDetails(product)}
                      className="px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};