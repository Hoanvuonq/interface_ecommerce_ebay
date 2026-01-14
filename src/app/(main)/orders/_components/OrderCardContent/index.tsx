import React from "react";
import Image from "next/image";
import { Package, Truck } from "lucide-react";
import { formatDate } from "@/hooks/format";
import { resolveOrderItemImageUrl } from "../../_constants/order.constants";
interface ContentProps {
  status: { label: string; icon: React.ReactNode };
  trackingNumber?: string;
  createdAt: string;
  items: any[];
  thumbnails: any[];
  remaining: number;
  isDelivered: boolean;
  onViewDetail: () => void;
}

export const OrderCardContent: React.FC<ContentProps> = ({
  status,
  trackingNumber,
  createdAt,
  items,
  thumbnails,
  remaining,
  isDelivered,
  onViewDetail,
}) => (
  <div
    className="lg:col-span-8 space-y-5 cursor-pointer"
    onClick={onViewDetail}
  >
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border border-gray-100 bg-orange-50 text-orange-700 shadow-sm">
        {status.icon} {status.label}
      </span>
      {trackingNumber && (
        <span className="text-[11px] font-mono text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          📦 {trackingNumber}
        </span>
      )}
      <span className="text-[11px] text-gray-600 font-medium">
        {formatDate(createdAt)}
      </span>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex -space-x-3">
        {thumbnails.map((item, idx) => {
          const imageUrl =
            resolveOrderItemImageUrl(
              item.imageBasePath,
              item.imageExtension,
              "_thumb"
            ) || null;
          return (
            <div
              key={item.itemId}
              className="relative w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gray-50 group-hover:-translate-y-1 transition-transform"
              style={{ zIndex: 3 - idx }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Product"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-300">
                  <Package size={24} strokeWidth={1.5} />
                </div>
              )}
            </div>
          );
        })}
        {remaining > 0 && (
          <div className="w-16 h-16 rounded-2xl border-4 border-white bg-gray-800 text-white flex items-center justify-center text-xs font-bold shadow-md z-0">
            +{remaining}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">
          {items.length} sản phẩm
        </p>
        {isDelivered && (
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium mt-1">
            <Truck size={12} /> Giao hàng thành công
          </p>
        )}
      </div>
    </div>
  </div>
);
