/* eslint-disable @next/next/no-img-element */
import { formatPrice } from "@/hooks/useFormatPrice";
import { resolveOrderItemImageUrl } from "../../_types/order";
import { Package, Star } from "lucide-react";
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
    <div className="p-4 sm:p-5 flex gap-4 sm:gap-6 hover:bg-slate-50/50 transition-all duration-300 group border-b border-slate-50 last:border-0">
      
      <div className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-[1.02]">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={item.productName}
            fill
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Package size={28} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex items-center justify-between py-1">
        <div className="space-y-1">
          <NextLink
            href={`/products/${item.productId}`}
            className="font-semibold text-slate-700 hover:text-orange-600 transition-colors block text-[12px] truncate pr-4"
          >
            {item.productName}
          </NextLink>
          
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              SKU: {item.sku || "N/A"}
            </span>
            <span className="text-slate-400 text-[9px] font-medium uppercase">
              Số lượng: <b className="text-slate-700">{item.quantity}</b>
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <p className="text-base sm:text-2xl font-bold text-orange-600 tracking-tighter">
            {formatPrice(item.lineTotal)}
          </p>

          {canReview && (
            <button
              onClick={onReview}
              disabled={isReviewed}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border shadow-sm",
                isReviewed
                  ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  : "bg-white text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white hover:border-orange-600 active:scale-95"
              )}
            >
              <Star
                size={12}
                className={cn(isReviewed ? "fill-slate-200" : "fill-current")}
              />
              {isReviewed ? "Đã đánh giá" : "Viết nhận xét"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};