import React from "react";
import { Package } from "lucide-react";
import { OrderItemResponse } from "@/api/_types/adminOrder.types";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

interface ProductListCardProps {
  items: OrderItemResponse[];
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Package size={18} className="text-blue-600" />
          Sản phẩm ({items.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {items.map((item) => {
          const imageUrl =
            resolveVariantImageUrl(
              {
                imageBasePath: item.imageBasePath,
                imageExtension: item.imageExtension,
              },
              "_medium",
            ) || "/placeholder-product.png";

          return (
            <div
              key={item.variantId}
              className="px-6 py-4 flex gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="shrink-0">
                <img
                  src={imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.productName}
                </h4>
                {item.variantAttributes && (
                  <p className="text-xs text-gray-600 mb-1">
                    {item.variantAttributes}
                  </p>
                )}
                <p className="text-xs text-gray-500">SKU: {item.sku}</p>
              </div>

              {/* Price & Quantity */}
              <div className="flex flex-col items-end justify-between text-right">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {(item.unitPrice || 0).toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-xs text-gray-500">x{item.quantity || 0}</p>
                </div>
                <p className="text-sm font-bold text-blue-600">
                  {(item.lineTotal || 0).toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
