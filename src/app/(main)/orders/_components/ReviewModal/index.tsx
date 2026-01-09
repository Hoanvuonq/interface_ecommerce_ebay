"use client";

import React, { useRef } from "react";
import { PortalModal } from "@/features/PortalModal";
import {
  Star,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Video,
  ShieldCheck,
  X,
} from "lucide-react";
import { ButtonField } from "@/components";
import { useReviewModalLogic } from "../../_hooks/useReviewModalLogic";
import { ReviewModalProps } from "../../_types/review";
import { cn } from "@/utils/cn";
import Image from "next/image";

export const ReviewModal: React.FC<ReviewModalProps> = (props) => {
  const { open, productName, productImage } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    fileList,
    uploadingFiles,
    handleNativeFileSelect,
    handleRemoveFile,
    handleSubmit,
    resetState,
    isUpdateMode,
    isLoading,
  } = useReviewModalLogic(props);

  return (
    <PortalModal
      isOpen={open}
      onClose={resetState}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800 tracking-tight block">
              {isUpdateMode ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Phản hồi của bạn rất quý giá
            </span>
          </div>
        </div>
      }
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="hidden sm:flex items-center gap-2 text-emerald-600">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Bảo mật nội dung
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={resetState}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Hủy
            </button>
            <ButtonField
              type="login"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 sm:min-w-35 h-11 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 uppercase tracking-widest transition-all active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUpdateMode ? "Cập nhật" : "Gửi ngay"}
              </div>
            </ButtonField>
          </div>
        </div>
      }
    >
      <div className="space-y-8 py-2 font-sans">
        <div className="flex gap-4 p-2 bg-gray-50/50 rounded-2xl border border-gray-100 items-center">
          <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative shadow-sm">
            {productImage ? (
              <Image
                src={productImage}
                alt={productName || "Product"}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <ImageIcon size={20} strokeWidth={1.5} />
                <span className="text-[8px] font-bold uppercase mt-1">
                  No Img
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter mb-0.5">
              Sản phẩm đánh giá
            </p>
            <p className="text-sm font-bold text-gray-800 truncate italic">
              {productName}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center py-6 bg-white rounded-3xl border border-orange-50 shadow-sm shadow-orange-100/30">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
            Chất lượng sản phẩm
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all hover:scale-125 active:scale-90"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-colors duration-200",
                    star <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-100 fill-gray-100"
                  )}
                />
              </button>
            ))}
          </div>
          <div className="h-5 mt-4">
            {rating > 0 && (
              <span className="text-xs font-bold text-orange-600 uppercase tracking-tighter">
                {rating === 5
                  ? "Rất Tuyệt vời"
                  : rating === 4
                  ? "Rất Hài lòng"
                  : rating === 3
                  ? "Bình thường"
                  : rating === 2
                  ? "Không hài lòng"
                  : "Tệ"}
              </span>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
            <span>Nhận xét chi tiết</span>
            <span
              className={cn(
                "text-[10px]",
                comment.length > 1900 ? "text-red-500" : "text-gray-400"
              )}
            >
              {comment.length}/2000
            </span>
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này..."
            className="w-full p-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-orange-200 text-sm text-gray-800 placeholder:text-gray-400 resize-none transition-all shadow-inner outline-none"
          />
        </div>

        {!isUpdateMode && (
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block px-1">
              Hình ảnh & Video
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {fileList.map((file: any) => (
                <div
                  key={file.uid}
                  className="relative aspect-square rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 group"
                >
                  {file.type?.startsWith("video/") ? (
                    <video
                      src={file.thumbUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={file.thumbUrl}
                      alt="preview"
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      unoptimized={file.thumbUrl.startsWith("blob:")} 
                    />
                  )}

                  {uploadingFiles.has(file.uid) && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveFile(file.uid)}
                    className="absolute top-1 right-1 bg-bold/50 hover:bg-red-500 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={10} />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-bold/40 px-1 rounded text-[8px] text-white font-bold uppercase">
                    {file.type?.startsWith("video/") ? "Video" : "Ảnh"}
                  </div>
                </div>
              ))}

              {fileList.length < 7 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-orange-500 gap-1.5"
                >
                  <UploadCloud size={24} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase">Thêm</span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleNativeFileSelect(e.target.files)}
            />
          </div>
        )}
      </div>
    </PortalModal>
  );
};
