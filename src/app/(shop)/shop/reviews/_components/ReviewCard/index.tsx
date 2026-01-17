"use client";

import React from "react";
import {
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  Trash2,
  Star,
  User,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { ReviewResponse } from "../../_types/review.types";
import { cn } from "@/utils/cn";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ReviewCardProps {
  review: ReviewResponse;
  onRespond?: (reviewId: string) => void;
  onDeleteResponse?: (reviewId: string) => void;
  showActions?: boolean;
}

export default function ReviewCard({
  review,
  onRespond,
  onDeleteResponse,
  showActions = true,
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            className={cn(
              s <= rating
                ? "text-orange-400 fill-orange-400"
                : "text-slate-200 fill-slate-100"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar & User Info Side */}
          <div className="flex sm:flex-col items-center gap-4 shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-400 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              {review.userAvatar ? (
                <img
                  src={review.userAvatar}
                  alt={review.username}
                  className="relative w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="relative w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                  <User size={32} />
                </div>
              )}
            </div>

            {review.verifiedPurchase && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <CheckCircle2 size={12} strokeWidth={3} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Đã mua
                </span>
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800 tracking-tight leading-none mb-2">
                  {review.username || review.buyerName}
                </h4>
                <div className="flex items-center gap-3">
                  {renderStars(review.rating)}
                  <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                    {dayjs(review.createdDate).fromNow()}
                  </span>
                </div>
              </div>
            </div>

            {review.comment && (
              <p className="text-slate-600 leading-relaxed text-sm mb-6 bg-slate-50/50 p-4 rounded-2xl italic border border-slate-50">
                "{review.comment}"
              </p>
            )}

            {/* Engagement Stats - Tinh gọn */}
            <div className="flex items-center gap-6 mb-6 px-2">
              <div className="flex items-center gap-2 group cursor-default">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                  <ThumbsUp
                    size={14}
                    className="text-slate-400 group-hover:text-emerald-500"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600">
                  {review.helpfulCount}
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-rose-50 transition-colors">
                  <ThumbsDown
                    size={14}
                    className="text-slate-400 group-hover:text-rose-500"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-rose-600">
                  {review.notHelpfulCount}
                </span>
              </div>
            </div>

            {/* Seller Response Section */}
            {review.hasResponse && review.sellerResponse && (
              <div className="relative mt-6 p-6 rounded-3xl bg-indigo-50/50 border-2 border-indigo-100/50 group/response">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-indigo-100 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <MessageSquareText size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Phản hồi của Shop
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {review.sellerResponse}
                </p>

                {showActions && onDeleteResponse && (
                  <button
                    onClick={() => onDeleteResponse(review.id)}
                    className="mt-4 flex items-center gap-2 px-3 py-1.5 text-rose-500 hover:bg-rose-100 rounded-xl transition-all text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover/response:opacity-100"
                  >
                    <Trash2 size={12} /> Xóa phản hồi
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {showActions && !review.hasResponse && onRespond && (
              <button
                onClick={() => onRespond(review.id)}
                className="mt-4 group flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                <MessageSquareText
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
                Trả lời ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
