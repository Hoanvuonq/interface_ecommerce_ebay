"use client";

import { CustomAvatar } from "@/components/custom/components/customAvatar";
import { CustomRate } from "@/components/rating";
import { CheckCircle, MessageSquareText, User } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ReviewItemProps {
  review: any;
  onImageClick: (url: string) => void;
  resolveMediaUrl: (media: any) => string;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onImageClick,
  resolveMediaUrl,
}) => {
  return (
    <div className="py-8 first:pt-0 border-b border-slate-50 last:border-0 group transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-5 md:gap-7">
        <div className="flex items-center sm:items-start gap-3 shrink-0">
          <CustomAvatar
            size={42}
            src={review.userAvatar || undefined}
            icon={<User size={20} />}
            className="bg-slate-100 border border-slate-200 shadow-sm rounded-xl transition-transform group-hover:scale-105"
          />
          <div className="sm:hidden">
            <h4 className="font-semibold  text-gray-900 text-[14px] tracking-tight">
              {review.username || review.buyerName || "Ẩn danh"}
            </h4>
            <CustomRate value={Number(review.rating)} size={10} disabled className="text-amber-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="hidden sm:flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold  text-gray-900 text-[14px] tracking-tight">
                  {review.username || review.buyerName || "Người dùng ẩn danh"}
                </span>
                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-tight">
                    <CheckCircle size={10} /> Đã mua
                  </span>
                )}
              </div>
              <CustomRate value={Number(review.rating)} size={10} disabled className="text-amber-400" />
            </div>
            <span className="text-[10px]  text-gray-400 font-semibold uppercase tracking-widest">
              {new Date(review.createdDate).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* Comment của khách */}
          <p className=" text-gray-600 text-[14px] leading-relaxed mb-4 antialiased whitespace-pre-line">
            {review.comment || "Khách hàng không để lại nội dung."}
          </p>

          {/* Media Grid */}
          {review.media && review.media.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {review.media.map((m: any) => (
                <div
                  key={m.id}
                  className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500/50 transition-all duration-300 group/media border border-slate-100"
                  onClick={() => onImageClick(resolveMediaUrl(m))}
                >
                  <Image
                    src={resolveMediaUrl(m)}
                    fill
                    className="object-cover group-hover/media:scale-110 transition-transform duration-500"
                    alt="review media"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}

          {review.sellerResponse && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquareText size={12} className="text-orange-500" />
                <span className="text-[11px] font-semibold  text-gray-800 uppercase tracking-wider">
                  Phản hồi từ Shop
                </span>
              </div>
              <p className="text-[13px]  text-gray-500 leading-normal italic">
                {review.sellerResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};