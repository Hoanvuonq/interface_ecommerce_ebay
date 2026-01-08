"use client";

import { toPublicUrl } from "@/utils/storage/url";
import _ from "lodash";
import { Package, Search, X, ShoppingBag } from "lucide-react";
import React from "react";
import Image from "next/image"; // Sử dụng Next.js Image
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
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "w-full bg-white/95 backdrop-blur-md border-t border-orange-100",
        "shadow-[0_-15px_50px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-10 duration-500 md:rounded-none"
      )}
    >
      <div className="px-6 py-5 border-b border-orange-50 bg-linear-to-r from-orange-50/30 via-white to-amber-50/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-black text-gray-800 uppercase tracking-tight">
                Kho sản phẩm
              </h3>
              <p className="text-[11px] text-orange-400 font-bold mt-0.5 uppercase tracking-widest">
                Chọn để gửi hỗ trợ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-100/50 rounded-full text-gray-400 hover:text-orange-600 transition-all duration-300 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
          />
          <input
            placeholder="Tìm theo tên hoặc mã sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-700 outline-none focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-500/5 transition-all duration-300 shadow-inner"
          />
        </div>
      </div>

      <div className="relative h-100 overflow-y-auto custom-scrollbar bg-white p-4">
        {isLoading && (
          <SectionLoading
            isOverlay
            message="Đang tìm..."
            className="rounded-none"
          />
        )}

        {_.isEmpty(products) && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-gray-50 rounded-full mb-4">
              <Package size={48} className="opacity-10" />
            </div>
            <p className="text-[13px] font-bold text-gray-500 uppercase">
              Không thấy sản phẩm
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 gap-3 transition-opacity duration-300",
              isLoading ? "opacity-30 grayscale-50" : "opacity-100"
            )}
          >
            {_.map(products, (product) => {
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
                  className="p-3 bg-white rounded-3xl border border-gray-100 flex gap-4 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group"
                >
                  <div className="w-20 h-20 rounded-2xl border border-gray-50 overflow-hidden shrink-0 bg-gray-50 relative">
                    <Image
                      src={productImageUrl || "/placeholder-product.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h5 className="text-[13px] font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        ID:{" "}
                        {product.sku ||
                          product.id?.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-black text-orange-600 tracking-tight">
                      {price.toLocaleString("vi-VN")}
                      <span className="text-[10px] ml-0.5 font-bold">₫</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 justify-center shrink-0">
                    <button
                      onClick={() => onSendDirect(product)}
                      disabled={isSending}
                      className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-2xl text-[11px] font-black shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-90 transition-all duration-300 disabled:opacity-50"
                    >
                      {isSending ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "GỬI"
                      )}
                    </button>
                    <button
                      onClick={() => onViewDetails(product)}
                      className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-2xl text-[10px] font-bold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-300"
                    >
                      XEM
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
