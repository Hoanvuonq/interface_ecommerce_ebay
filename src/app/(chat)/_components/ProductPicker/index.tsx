"use client";

import React from "react";
import _ from "lodash";
import { Search, Info, Send, X, Package } from "lucide-react";
import { toPublicUrl } from "@/utils/storage/url";

// Định nghĩa Props trực tiếp trong file hoặc import từ type chung
export interface ProductPickerProps {
  isVisible: boolean;
  onClose: () => void;
  products: any[];
  isLoading: boolean;
  searchText: string;
  onSearchChange: (val: string) => void;
  onSendDirect: (product: any) => void;
  onViewDetails: (product: any) => void;
  isSending: boolean;
}

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
    <div className="bg-white border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300 rounded-t-2xl md:rounded-none">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Package size={16} />
            Chọn sản phẩm
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            placeholder="Tìm theo tên sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-[320px] overflow-y-auto bg-slate-50/50 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : _.isEmpty(products) ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Package size={32} className="opacity-20 mb-2" />
            <p className="text-xs">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white">
            {_.map(products, (product) => {
              // Xử lý dữ liệu an toàn với Lodash
              const mediaList = _.get(product, "media", []);
              const imageObj =
                _.find(mediaList, (m) => m.type === "IMAGE" && m.url) || {};
              const rawUrl =
                imageObj.url || product.thumbnailUrl || product.imageUrl || "";
              const productImageUrl = toPublicUrl(rawUrl);

              const price =
                _.get(product, "basePrice") || _.get(product, "price") || 0;

              return (
                <div
                  key={product.id}
                  className="p-3 flex gap-3 hover:bg-blue-50/30 transition-colors group"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg border border-slate-100 overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={productImageUrl || "/placeholder-product.png"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.png";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h5
                        className="text-sm font-semibold text-slate-800 truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h5>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        Mã SP: {product.sku || product.id?.substring(0, 8)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      {price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 justify-center shrink-0">
                    <button
                      onClick={() => onSendDirect(product)}
                      disabled={isSending}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-md shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSending ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Gửi <Send size={10} />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onViewDetails(product)}
                      className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
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
