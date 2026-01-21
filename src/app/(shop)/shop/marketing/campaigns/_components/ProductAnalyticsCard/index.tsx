"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";

export const ProductAnalyticsCard = ({ prod, formatPrice }: any) => {
  const sellRatio = Math.min((prod.stockSold / prod.stockLimit) * 100, 100);

  const getImageUrl = (thumb: string | null | undefined) => {
    if (!thumb) return "https://picsum.photos/100/100";
    if (/^(https?:)?\/\//i.test(thumb) || thumb.startsWith("data:") || thumb.startsWith("blob:")) return thumb;
    if (thumb.startsWith("public/")) return `/${thumb.replace(/^public\//, "")}`;
    if (thumb.startsWith("/")) return thumb;
    if (typeof toPublicUrl === "function") return toPublicUrl(thumb);
    return `/${thumb}`;
  };

  return (
    <div className="group flex flex-col gap-4 p-5 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-inner bg-slate-50 border border-slate-100">
          <Image
            src={getImageUrl(prod.productThumbnail)}
            alt="thumb"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 text-sm truncate uppercase italic tracking-tighter mb-1">
            {prod.productName}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-orange-600 tracking-tighter">
              {formatPrice(prod.salePrice)}
            </span>
            <span className="text-[10px] font-bold text-slate-300 line-through">
              {formatPrice(prod.salePrice * 1.2)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>Sold Intensity</span>
          <span className="text-orange-500">{Math.round(sellRatio)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out rounded-full",
              sellRatio > 80
                ? "bg-linear-to-r from-orange-500 to-red-500"
                : "bg-orange-500",
            )}
            style={{ width: `${sellRatio}%` }}
          />
        </div>
        <div className="text-[10px] font-bold text-slate-600 uppercase text-right tracking-tighter">
          {prod.stockSold} <span className="text-slate-300">/</span>{" "}
          {prod.stockLimit} UNITS
        </div>
      </div>
    </div>
  );
};
