/* eslint-disable @next/next/no-img-element */
import { formatPrice } from "@/hooks/useFormatPrice";
import { resolveOrderItemImageUrl } from "../../_types/order";
import { Package, Star, Tag } from "lucide-react";
import NextLink from "next/link";
import { cn } from "@/utils/cn";
import Image from "next/image";

export const OrderItemRow = ({
  item,
  isReviewed,
  canReview,
  onReview,
}: any) => {
  const imageUrl = resolveOrderItemImageUrl(
    item.imageBasePath,
    item.imageExtension,
    "_medium"
  );

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-gray-50/50 transition-all duration-300 group border-b border-gray-50 last:border-0">
      <div className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-100 shrink-0 bg-white shadow-sm flex items-center justify-center transition-all duration-500 group-hover:shadow-orange-100 group-hover:border-orange-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.productName}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-200">
            <Package size={32} strokeWidth={1.2} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5">
        <NextLink
          href={`/products/${item.productId}`}
          className="font-bold text-gray-800 hover:text-orange-600 transition-colors block text-[13px] sm:text-[14px] leading-tight line-clamp-2"
        >
          {item.productName}
        </NextLink>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-3">
          {item.sku && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-100/80 px-2 py-0.5 rounded-md">
              <Tag size={10} />
              SKU: {item.sku}
            </div>
          )}

          <span className="text-gray-500 text-[11px] font-semibold italic">
            Phân loại:{" "}
            <span className="text-gray-400 font-medium">
              {item.variantAttributes || "Mặc định"}
            </span>
          </span>

          <span className="text-gray-600 text-[11px] font-bold">
            x{item.quantity}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center  justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 border-dashed border-gray-100 pt-3 sm:pt-0">
        <div className="flex flex-col sm:items-end">
          <p className="text-lg sm:text-xl font-bold text-orange-600 tracking-tight leading-none">
            {formatPrice(item.lineTotal)}
          </p>
        </div>

        {canReview && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onReview();
            }}
            disabled={isReviewed}
            className={cn(
              "flex items-center gap-2 p-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm active:scale-95",
              isReviewed
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-white text-orange-600 border border-orange-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:shadow-orange-200"
            )}
          >
            <Star
              size={14}
              className={cn(
                isReviewed
                  ? "fill-gray-300"
                  : "fill-current group-hover:rotate-12 transition-transform"
              )}
            />
            {isReviewed ? "Đã đánh giá" : "Viết nhận xét"}
          </button>
        )}
      </div>
    </div>
  );
};
