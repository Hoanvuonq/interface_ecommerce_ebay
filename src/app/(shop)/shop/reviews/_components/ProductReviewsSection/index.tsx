"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  RefreshCw, 
  Star, 
  MessageCircle, 
  Inbox, 
  CheckCircle2, 
  Filter,
  X
} from "lucide-react";
import ReviewList from "../ReviewList";
import ReviewResponseModal from "../ReviewResponseModal";
import {
  useGetReviews,
  useGetReviewStatistics,
  useDeleteReviewResponse,
} from "../../_hooks/useShopReview";
import { 
  ReviewStatisticsResponse, 
  ReviewResponse, 
  ReviewPageDto 
} from "@/app/(shop)/shop/reviews/_types/review.types";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

interface ProductReviewsSectionProps {
  productId: string;
}

export default function ProductReviewsSection({
  productId,
}: ProductReviewsSectionProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const getReviews = useGetReviews();
  const getStatistics = useGetReviewStatistics();
  const deleteResponse = useDeleteReviewResponse();

  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [responseFilter, setResponseFilter] = useState<"all" | "need_response" | "responded">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  // Local state for data
  const [reviewsData, setReviewsData] = useState<ReviewPageDto | null>(null);
  const [statisticsData, setStatisticsData] = useState<ReviewStatisticsResponse | null>(null);

  const fetchData = async () => {
    // Fetch Statistics
    const statsRes = await getStatistics.handleGetReviewStatistics("PRODUCT", productId);
    if (statsRes && statsRes.data) setStatisticsData(statsRes.data);

    // Fetch Reviews
    const params: any = {
      page: page - 1,
      size: pageSize,
      sort: "createdDate,desc",
    };
    if (selectedRatings.length > 0) params.rating = selectedRatings[0];
    if (responseFilter === "need_response") params.hasResponse = false;
    else if (responseFilter === "responded") params.hasResponse = true;

    const reviewsRes = await getReviews.handleGetReviews("PRODUCT", productId, params);
    if (reviewsRes && reviewsRes.data) setReviewsData(reviewsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [productId, page, pageSize, selectedRatings, responseFilter]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleRespond = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setResponseModalOpen(true);
  };

  const handleDeleteResponse = async (reviewId: string) => {
    if (!confirm("Bạn có chắc muốn xóa phản hồi này?")) return;
    const res = await deleteResponse.handleDeleteReviewResponse(reviewId);
    if (res && res.data) {
      toastSuccess("Đã xóa phản hồi thành công!");
      fetchData();
    } else {
      toastError("Không thể xóa phản hồi!");
    }
  };

  const getRatingCount = (rating: number): number => {
    if (!statisticsData) return 0;
    const percentage = (statisticsData.ratingPercentage as any)[rating] || 0;
    return Math.round((statisticsData.totalReviews * percentage) / 100);
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [rating] // Backend hiện chỉ hỗ trợ 1 rating
    );
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Main Filter Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Chi tiết đánh giá</h3>
                <p className="text-xs text-slate-400 font-medium italic">Lọc và quản lý các phản hồi từ khách hàng</p>
              </div>
            </div>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all active:scale-95"
            >
              <RefreshCw size={16} className={cn(getReviews.loading && "animate-spin")} />
              <span className="text-xs font-bold uppercase tracking-widest">Làm mới</span>
            </button>
          </div>

          {/* Response Type Tabs (Chips style) */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-50">
              {[
                { id: "all", label: "Tất cả", count: statisticsData?.totalReviews || 0 },
                { id: "need_response", label: "Cần phản hồi", count: reviewsData?.totalElements || 0, color: "rose" },
                { id: "responded", label: "Đã phản hồi", count: 0, color: "emerald" } // Count logic cần mapping từ API thật
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => { setResponseFilter(filter.id as any); setPage(1); }}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border",
                    responseFilter === filter.id 
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 scale-105" 
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-600"
                  )}
                >
                  {filter.label}
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px]",
                    responseFilter === filter.id ? "bg-white/20" : "bg-slate-100"
                  )}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Star Rating Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800">
                  <Filter size={14} className="text-orange-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Lọc theo số sao</span>
                </div>
                {selectedRatings.length > 0 && (
                  <button 
                    onClick={() => { setSelectedRatings([]); setPage(1); }}
                    className="text-[10px] font-black text-orange-500 uppercase hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Xóa lọc
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const isActive = selectedRatings.includes(rating);
                  return (
                    <button
                      key={rating}
                      onClick={() => toggleRating(rating)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                        isActive 
                          ? "bg-orange-50 border-orange-200 text-orange-600 ring-2 ring-orange-100 shadow-sm" 
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                      )}
                    >
                      <div className="flex gap-0.5">
                        <Star size={14} className={cn(isActive ? "fill-orange-500" : "fill-slate-200 text-slate-200")} />
                      </div>
                      <span className="text-xs font-black">{rating}</span>
                      <span className="text-[10px] font-bold opacity-60">({getRatingCount(rating)})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List Area */}
        <div className="bg-slate-50/30 p-6 sm:p-8 border-t border-slate-100">
          <ReviewList
            reviews={reviewsData?.content || []}
            loading={getReviews.loading}
            pagination={reviewsData ? {
              current: page,
              pageSize: pageSize,
              total: reviewsData.totalElements,
            } : undefined}
            onPageChange={handlePageChange}
            onRespond={handleRespond}
            onDeleteResponse={handleDeleteResponse}
            showActions={true}
          />
        </div>
      </div>

      {/* Response Modal */}
      <ReviewResponseModal
        open={responseModalOpen}
        reviewId={selectedReviewId}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedReviewId(null);
        }}
        onSuccess={fetchData}
      />
    </div>
  );
}