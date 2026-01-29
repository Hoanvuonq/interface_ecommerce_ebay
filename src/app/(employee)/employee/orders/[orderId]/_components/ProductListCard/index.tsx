import React from "react";
import Image from "next/image";
import { Package, Hash } from "lucide-react"; // Thêm icon Hash cho SKU
import { OrderItemResponse } from "@/api/_types/adminOrder.types";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

interface ProductListCardProps {
  items: OrderItemResponse[];
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl shadow-custom overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Package size={20} className="text-orange-600" />
          DANH SÁCH SẢN PHẨM 
          <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
            {items.length}
          </span>
        </h3>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => {
          const imageUrl =
            resolveVariantImageUrl(
              {
                imagePath: item.imagePath,
                imageExtension: item.imageExtension,
              },
              "_medium",
            ) || "/placeholder-product.png";

          return (
            <div
              key={item.variantId || index}
              className="px-6 py-5 flex gap-5 hover:bg-gray-50/80 transition-all duration-200"
            >
              {/* Image Thumbnail */}
              <div className="relative shrink-0 w-22 h-22 group">
                <div className="absolute inset-0 bg-transparent transition-colors z-10 rounded-xl" />
                <Image
                  src={imageUrl}
                  alt={item.productName || "Product image"}
                  fill
                  sizes="88px"
                  className="object-cover rounded-xl border border-gray-100 shadow-sm"
                  priority={index === 0}
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight hover:text-orange-600 transition-colors cursor-pointer">
                    {item.productName}
                  </h4>
                  
                  {item.variantAttributes && (
                    <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      {item.variantAttributes}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 shadow-sm">
                    <Hash size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">
                      SKU: {item.sku || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing & Quantity */}
              <div className="flex flex-col items-end justify-between py-0.5 min-w-25">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {(item.unitPrice || 0).toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-sm font-medium text-gray-400 mt-0.5">
                    <span className="text-gray-600">x{item.quantity || 0}</span>
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-md font-bold text-orange-600">
                    {(item.lineTotal || 0).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};