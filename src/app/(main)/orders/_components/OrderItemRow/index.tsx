import { formatPrice } from "@/hooks/useFormatPrice";
import { resolveOrderItemImageUrl } from "../../_types/order";
import { Link, Package, Star } from "lucide-react";

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
    <div className="p-6 flex gap-6 hover:bg-slate-50/30 transition-colors">
      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" alt="" />
        ) : (
          <Package size={32} className="text-slate-200" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <Link
          href={`/products/${item.productId}`}
          className="font-bold text-slate-900 hover:text-orange-600 transition-colors block text-base line-clamp-1"
        >
          {item.productName}
        </Link>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          SKU: {item.sku || "N/A"}
        </p>
        <div className="flex justify-between items-end pt-2">
          <span className="text-slate-400 text-sm font-medium">
            Số lượng: <b className="text-slate-900">{item.quantity}</b>
          </span>
          <div className="text-right">
            <p className="text-lg font-semibold text-slate-900">
              {formatPrice(item.lineTotal)}
            </p>
            {canReview && (
              <button
                onClick={onReview}
                disabled={isReviewed}
                className={`mt-2 flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all border ${
                  isReviewed
                    ? "bg-slate-50 text-slate-300 border-slate-100"
                    : "bg-white text-orange-600 border-orange-100 hover:bg-orange-50"
                }`}
              >
                <Star
                  size={12}
                  className={isReviewed ? "fill-slate-200" : "fill-orange-500"}
                />{" "}
                {isReviewed ? "Đã đánh giá" : "Đánh giá"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
