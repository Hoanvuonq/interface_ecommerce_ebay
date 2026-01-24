"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { 
  Eye, 
  Check, 
  X, 
  RotateCw, 
  Star, 
  BadgeCheck, 
  MoreHorizontal,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAdminReview } from "../../_hooks/useAdminReview";
import { ReviewResponse, ReviewStatus } from "../../_types/review.type";
import { StatCardComponents } from "@/components";
import { SelectComponent } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import ModerateReviewModal from "../ModerateReviewModal";
import ReviewDetailModal from "../ReviewDetailModal";
import { cn } from "@/utils/cn";

export default function ReviewManagement() {
  const [activeTab, setActiveTab] = useState<"pending" | "flagged">("pending");
  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 20,
    sort: "createdDate,desc",
  });

  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
  const [isModerateOpen, setIsModerateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    reviews,
    pagination,
    stats,
    isLoading,
    isProcessing,
    moderateReview,
    refresh,
  } = useAdminReview(queryParams, activeTab);

  // Helper render rating stars
  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={cn(
            i < rating ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-8">
      {/* 1. Header & Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
            Kiểm duyệt <span className="text-orange-500">Đánh giá</span>
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-2">
            Quản lý niềm tin khách hàng
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <RotateCw size={18} className={cn(isLoading && "animate-spin")} />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCardComponents
          label="Chờ phê duyệt"
          value={stats.pending}
          color="text-orange-500"
          icon={<AlertCircle />}
        />
        <StatCardComponents
          label="Đã bị báo cáo"
          value={stats.flagged}
          color="text-red-500"
          icon={<AlertCircle />}
        />
      </div>

      {/* 2. Main Content Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-white/50 backdrop-blur-md">
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl">
            {(["pending", "flagged"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setQueryParams((p) => ({ ...p, page: 0 }));
                }}
                className={cn(
                  "px-8 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition-all",
                  activeTab === tab 
                    ? "bg-white text-orange-500 shadow-sm" 
                    : "text-gray-600 hover:text-gray-600"
                )}
              >
                {tab === "pending" ? "Chờ duyệt" : "Bị báo cáo"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-tighter">Hiển thị:</span>
            <SelectComponent
              options={[
                { label: "20 dòng", value: "20" },
                { label: "50 dòng", value: "50" },
              ]}
              value={String(queryParams.size)}
              onChange={(v) => setQueryParams((p) => ({ ...p, size: Number(v), page: 0 }))}
              className="w-32"
            />
          </div>
        </div>

        {/* Custom Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase font-semibold  text-gray-600 border-b border-gray-50">
                <th className="px-8 py-5">STT</th>
                <th className="px-6 py-5">Người đánh giá</th>
                <th className="px-6 py-5">Đánh giá</th>
                <th className="px-6 py-5">Nội dung</th>
                <th className="px-6 py-5 text-center">Hữu ích</th>
                <th className="px-6 py-5 text-center">Ngày tạo</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-32 text-center">
                      <RotateCw className="animate-spin text-orange-500 mx-auto" size={40} />
                      <p className="text-[10px] font-semibold text-gray-500 uppercase mt-4 tracking-widest">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : reviews.length > 0 ? (
                  reviews.map((record: ReviewResponse, idx: number) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5 text-gray-600 font-mono">
                        {queryParams.page * queryParams.size + idx + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 font-bold text-gray-700">
                            {record.username}
                            {record.verifiedPurchase && (
                              <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md text-[9px] uppercase font-semibold border border-emerald-100">
                                <BadgeCheck size={10} /> Verified
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-600">{record.buyerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">{renderStars(record.rating)}</td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="truncate text-gray-600 font-medium" title={record.comment}>
                          {record.comment || <span className="italic text-gray-500">Không có nội dung</span>}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex gap-3 text-[10px] font-bold">
                          <span className="text-emerald-500">👍 {record.helpfulCount}</span>
                          <span className="text-red-400">👎 {record.notHelpfulCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-gray-600 font-medium">
                        {dayjs(record.createdDate).format("DD/MM HH:mm")}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(): void => { setSelectedReview(record); setIsDetailOpen(true); }}
                            className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => moderateReview({ id: record.id, payload: { status: ReviewStatus.APPROVED } })}
                            className="p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Duyệt nhanh"
                          >
                            {isProcessing && selectedReview?.id === record.id ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                          </button>
                          <button
                            onClick={(): void => { setSelectedReview(record); setIsModerateOpen(true); }}
                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Từ chối / Kiểm duyệt"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <AlertCircle size={48} strokeWidth={1} />
                        <p className="text-sm font-bold italic">Danh sách trống</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Custom Pagination Footer */}
        <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            Tổng cộng: {pagination.total} đánh giá
          </span>
          <div className="flex gap-2">
            <button
              disabled={queryParams.page === 0}
              onClick={() => setQueryParams(p => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-50 hover:bg-white transition-all shadow-sm"
            >
              Trước
            </button>
            <div className="flex items-center px-4 text-xs font-semibold text-orange-500 bg-white rounded-xl shadow-sm border border-gray-100">
              {queryParams.page + 1} / {Math.ceil(pagination.total / queryParams.size) || 1}
            </div>
            <button
              disabled={(queryParams.page + 1) * queryParams.size >= pagination.total}
              onClick={() => setQueryParams(p => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-50 hover:bg-white transition-all shadow-sm"
            >
              Sau tiếp
            </button>
          </div>
        </div>
      </div>

      {/* 3. Modals - Đã tích hợp PortalModal & Form của bạn */}
      <PortalModal
        isOpen={isModerateOpen}
        onClose={() => setIsModerateOpen(false)}
        title="Kiểm duyệt đánh giá"
        width="max-w-xl"
      >
        <ModerateReviewModal
          onCancel={() => setIsModerateOpen(false)}
          onSubmit={async (payload) => {
            await moderateReview({ id: selectedReview!.id, payload });
            setIsModerateOpen(false);
          }}
        />
      </PortalModal>

      <PortalModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Chi tiết đánh giá"
        width="max-w-2xl"
      >
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setIsDetailOpen(false)}
        />
      </PortalModal>
    </div>
  );
}