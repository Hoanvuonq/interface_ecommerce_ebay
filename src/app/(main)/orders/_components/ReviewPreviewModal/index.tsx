"use client";

import React, { useState } from "react";
import { PortalModal } from "@/features/PortalModal";
import {
  Star,
  MessageSquare,
  ShieldCheck,
  ImageIcon,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { CustomRate } from "@/components/rating";
import { cn } from "@/utils/cn";

interface ReviewPreviewModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  reviewData: {
    rating: number;
    comment: string;
    media?: string[];
    createdAt?: string;
  };
}

export const ReviewPreviewModal: React.FC<ReviewPreviewModalProps> = ({
  open,
  onClose,
  productName,
  productImage,
  reviewData,
}) => {
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(
    null
  );

  return (
    <>
      <PortalModal
        isOpen={open}
        onClose={onClose}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500 shadow-sm border border-gray-100/50">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight leading-none">
                Chi tiết đánh giá
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1">
                Verified Review <ChevronRight size={10} />
              </p>
            </div>
          </div>
        }
        width="max-w-xl"
        className="rounded-4xl"
      >
        <div className="space-y-8 py-2 font-sans px-1">
          <div className="flex gap-4 p-4 bg-gray-50/40 rounded-3xl border border-gray-100 items-center transition-colors hover:bg-gray-50">
            <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 overflow-hidden shrink-0 relative shadow-sm">
              {productImage ? (
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-1">
                Đã mua tại Calatha
              </p>
              <p className="text-sm font-bold text-gray-800 line-clamp-1 italic tracking-tight">
                {productName}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                <Calendar size={12} />
                <span className="text-[10px] font-bold uppercase">
                  {reviewData.createdAt || "Vừa xong"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <MessageSquare className="absolute -top-4 -right-2 w-20 h-20 text-orange-50 opacity-[0.05] -rotate-12 pointer-events-none" />

            <div className="space-y-6">
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-6 bg-white rounded-4xl border ",
                  "border-gray-100/50 shadow-xl shadow-orange-500/5 relative overflow-hidden"
                )}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/20" />
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">
                  Mức độ hài lòng
                </label>
                <CustomRate
                  value={reviewData.rating}
                  disabled
                  size={32}
                  className="gap-2"
                />
                <span className="mt-4 text-[13px] font-bold text-orange-600 uppercase tracking-tighter">
                  {reviewData.rating === 5
                    ? "Rất tuyệt vời"
                    : reviewData.rating === 4
                    ? "Rất hài lòng"
                    : "Bình thường"}
                </span>
              </div>

              {/* Nhận xét */}
              <div className="px-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-0.5 bg-orange-500 rounded-full" />
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    Lời nhắn từ khách hàng
                  </span>
                </div>
                <div className="relative">
                  <div className="p-6 bg-gray-50/80 border border-gray-100 rounded-3xl text-sm text-gray-700 leading-relaxed font-medium italic shadow-inner">
                    "
                    {reviewData.comment ||
                      "Khách hàng không để lại nhận xét bằng lời."}
                    "
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media Gallery (Instagram Style) */}
          {reviewData.media && reviewData.media.length > 0 && (
            <div className="space-y-4 px-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                Ảnh & Video thực tế
              </span>
              <div className="flex flex-wrap gap-3">
                {reviewData.media.map((url, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative w-20 h-20 rounded-2xl border-2 border-white overflow-hidden bg-gray-100",
                      "cursor-pointer shadow-md hover:scale-105 transition-all active:scale-95 group/img"
                    )}
                    onClick={() => setSelectedFullImage(url)}
                  >
                    <Image
                      src={url}
                      alt={`Review ${idx}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PortalModal>

      <PortalModal
        isOpen={!!selectedFullImage}
        onClose={() => setSelectedFullImage(null)}
        width="max-w-4xl"
        className="bg-transparent shadow-none border-none p-0 overflow-visible"
      >
        <div className="relative w-full h-[80vh] group/lightbox">
          {selectedFullImage && (
            <Image
              src={selectedFullImage}
              alt="Full view"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          )}
          <button
            onClick={() => setSelectedFullImage(null)}
            className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
          >
            Đóng ảnh <ShieldCheck size={16} />
          </button>
        </div>
      </PortalModal>
    </>
  );
};
