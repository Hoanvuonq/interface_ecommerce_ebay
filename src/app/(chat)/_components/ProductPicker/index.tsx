"use client";

import _ from "lodash";
import { ShoppingBag, Send, Package } from "lucide-react";
import React from "react";
import Image from "next/image";
import { ProductPickerProps } from "./type";
import { PickupModal } from "../modals";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

export const ProductPicker: React.FC<ProductPickerProps> = (props) => {
  const { isVisible, onClose, products, isLoading, searchText, onSearchChange, onSendDirect, onViewDetails, isSending } = props;

  return (
    <PickupModal
      isOpen={isVisible}
      onClose={onClose}
      title="Sản phẩm hỗ trợ"
      icon={ShoppingBag}
      searchText={searchText}
      onSearchChange={onSearchChange}
      placeholder="Tìm theo tên sản phẩm..."
      isLoading={isLoading}
    >
      {_.isEmpty(products) ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Package size={40} className="mb-3 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-widest italic">Không có sản phẩm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-10">
          {products.map((product) => {
            // FIX: Đảm bảo truyền đúng object có chứa media info
            const imgUrl = resolveVariantImageUrl(product, "_thumb");
            const price = product.basePrice || product.price || 0;

            return (
              <div key={product.id} className="p-3 bg-white border border-gray-100 rounded-3xl flex gap-4 hover:border-gray-500 transition-all group shadow-sm">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-50 relative flex items-center justify-center border border-gray-100">
                  {imgUrl ? (
                    <Image 
                      src={imgUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                      sizes="80px" 
                    />
                  ) : (
                    // Fallback icon nếu không có link ảnh
                    <Package size={32} className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h5 className="text-[13px] font-bold text-gray-900 truncate">{product.name}</h5>
                  <p className="text-[10px] text-gray-400 font-medium mb-1 truncate uppercase">SKU: {product.sku || "N/A"}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {price.toLocaleString("vi-VN")}₫
                  </p>
                </div>

                <div className="flex flex-col gap-2 justify-center shrink-0">
                  <button
                    onClick={() => onSendDirect(product)}
                    disabled={isSending}
                    className="h-9 px-5 bg-orange-600 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={12} /> GỬI
                  </button>
                  <button onClick={() => onViewDetails(product)} className="h-8 px-5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold uppercase">
                    CHI TIẾT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PickupModal>
  );
};