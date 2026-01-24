"use client";

import React from "react";
import {
  Inbox,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { ReviewResponse } from "../../_types/review.types";
import ReviewCard from "../ReviewCard";
import { cn } from "@/utils/cn";

interface ReviewListProps {
  reviews: ReviewResponse[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  onRespond?: (reviewId: string) => void;
  onDeleteResponse?: (reviewId: string) => void;
  showActions?: boolean;
}

export default function ReviewList({
  reviews,
  loading = false,
  pagination,
  onPageChange,
  onRespond,
  onDeleteResponse,
  showActions = true,
}: ReviewListProps) {
  // State: Loading ban đầu khi chưa có dữ liệu
  if (loading && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-orange-50 rounded-2xl mb-4">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
        <p className=" text-gray-400 font-medium italic animate-pulse">
          Đang tải danh sách đánh giá...
        </p>
      </div>
    );
  }

  // State: Danh sách trống
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-4xl border-2 border-dashed border-slate-200">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 ring-8 ring-slate-50">
          <Inbox size={40} className=" text-gray-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold  text-gray-800 uppercase tracking-widest mb-2">
          Trống
        </h3>
        <p className=" text-gray-400 text-sm font-medium">
          Sản phẩm này chưa có đánh giá nào từ khách hàng.
        </p>
      </div>
    );
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className="space-y-6">
      {/* Danh sách Review */}
      <div
        className={cn(
          "space-y-4 transition-opacity duration-300",
          loading ? "opacity-50 pointer-events-none" : "opacity-100"
        )}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <ReviewCard
              review={review}
              onRespond={onRespond}
              onDeleteResponse={onDeleteResponse}
              showActions={showActions}
            />
          </div>
        ))}
      </div>

      {/* Pagination Custom chuyên nghiệp */}
      {pagination && onPageChange && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="text-[10px] font-bold  text-gray-400 uppercase tracking-[0.2em]">
            Hiển thị{" "}
            <span className=" text-gray-900">
              {(pagination.current - 1) * pagination.pageSize + 1} -{" "}
              {Math.min(
                pagination.current * pagination.pageSize,
                pagination.total
              )}
            </span>{" "}
            trên <span className=" text-gray-900">{pagination.total}</span> đánh
            giá
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onPageChange(pagination.current - 1, pagination.pageSize)
              }
              disabled={pagination.current === 1 || loading}
              className="p-2 rounded-xl border border-slate-200  text-gray-500 hover:bg-slate-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 px-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Chỉ hiển thị trang đầu, trang cuối và trang hiện tại xung quanh
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= pagination.current - 1 &&
                    pageNum <= pagination.current + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum, pagination.pageSize)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-[11px] font-bold transition-all",
                        pagination.current === pageNum
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105"
                          : " text-gray-400 hover:bg-slate-100 hover:text-gray-600"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                }
                // Hiển thị dấu ba chấm
                if (
                  pageNum === pagination.current - 2 ||
                  pageNum === pagination.current + 2
                ) {
                  return (
                    <MoreHorizontal
                      key={pageNum}
                      size={16}
                      className=" text-gray-300 mx-1"
                    />
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() =>
                onPageChange(pagination.current + 1, pagination.pageSize)
              }
              disabled={pagination.current === totalPages || loading}
              className="p-2 rounded-xl border border-slate-200  text-gray-500 hover:bg-slate-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
