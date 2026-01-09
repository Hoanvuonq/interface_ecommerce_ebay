"use client";

import { toPublicUrl } from "@/utils/storage/url";
import _ from "lodash";
import { Package, Search, X, ShoppingBag, Send } from "lucide-react";
import React, { useCallback } from "react";
import Image from "next/image";
import { ProductPickerProps } from "./type";
import { cn } from "@/utils/cn";
import { SectionLoading } from "@/components";

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
  const handleSend = useCallback(
    (e: React.MouseEvent, product: any) => {
      e.stopPropagation(); 
      if (!isSending) {
        onSendDirect(product);
      }
    },
    [isSending, onSendDirect]
  );

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "w-full bg-white/95 backdrop-blur-xl border-t border-gray-200",
        "shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-full duration-500 md:rounded-none z-50"
      )}
    >
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-black text-gray-800 uppercase tracking-tight">
                Sản phẩm hỗ trợ
              </h3>
              <p className="text-[10px] text-orange-500 font-bold mt-0.5 uppercase tracking-widest italic">
                {products?.length || 0} sản phẩm sẵn sàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
          />
          <input
            placeholder="Tìm theo tên hoặc mã sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative h-96 overflow-y-auto custom-scrollbar bg-white p-4">
        {isLoading && (
          <SectionLoading isOverlay message="Đang tải dữ liệu..." />
        )}

        {_.isEmpty(products) && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-in fade-in zoom-in-95">
            <div className="p-8 bg-gray-50 rounded-full mb-4">
              <Package size={40} className="text-gray-200" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Không tìm thấy sản phẩm
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {_.map(products, (product) => {
              const rawUrl =
                _.get(product, "thumbnailUrl") ||
                _.get(product, "imageUrl") ||
                _.get(product, "media[0].url", "");
              const productImageUrl = toPublicUrl(rawUrl);
              const price =
                _.get(product, "basePrice") || _.get(product, "price") || 0;

              return (
                <div
                  key={product.id}
                  className="p-3 bg-white border border-gray-100 rounded-3xl flex gap-4 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 group"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-50 relative shadow-inner">
                    <Image
                      src={productImageUrl || "/placeholder-product.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h5 className="text-[13px] font-bold text-gray-900 truncate">
                      {product.name}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-medium mb-1">
                      SKU: {product.sku || "N/A"}
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {price.toLocaleString("vi-VN")}
                      <span className="text-[10px] ml-0.5">₫</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center">
                    <button
                      onClick={(e) => handleSend(e, product)}
                      disabled={isSending}
                      className="h-9 px-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 shadow-lg shadow-orange-100"
                    >
                      {isSending ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={12} strokeWidth={3} />
                          <span>GỬI</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onViewDetails(product)}
                      className="h-8 px-5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold hover:bg-gray-100 transition-all"
                    >
                      CHI TIẾT
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
