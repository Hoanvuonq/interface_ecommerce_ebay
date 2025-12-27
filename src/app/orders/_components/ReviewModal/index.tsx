"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCreateReview, useUpdateReview } from "@/hooks/useReview";
import type { CreateReviewRequest, UpdateReviewRequest, ReviewResponse } from "@/types/reviews/review.types";
import { ReviewType } from "@/types/reviews/review.types";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { 
  Star, 
  X, 
  UploadCloud, 
  Loader2, 
  Image as ImageIcon, 
  Video, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import { ReviewModalProps, UploadFile } from "../../_types/review";



export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onCancel,
  onSuccess,
  productId,
  productName,
  orderId,
  existingReview,
}) => {
  const { mutate: createReview, loading: createLoading } = useCreateReview();
  const { mutate: updateReview, loading: updateLoading } = useUpdateReview();
  const { uploadFile, uploading: uploadingMedia } = usePresignedUpload();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const [uploadedAssetIds, setUploadedAssetIds] = useState<Map<string, string>>(new Map());
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUpdateMode = !!existingReview;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (existingReview) {
        // Update mode
        setRating(existingReview.rating);
        setComment(existingReview.comment || "");
        setFileList([]);
        setUploadedAssetIds(new Map());
        setUploadingFiles(new Set());
      } else {
        // Create mode
        setRating(0);
        setComment("");
        setFileList([]);
        setUploadedAssetIds(new Map());
        setUploadingFiles(new Set());
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open, existingReview]);

  // --- Handlers ---

  const handleClose = () => {
    setRating(0);
    setComment("");
    setFileList([]);
    setUploadedAssetIds(new Map());
    setUploadingFiles(new Set());
    onCancel();
  };

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }
    if (comment.length > 2000) {
      toast.error("Nhận xét không được vượt quá 2000 ký tự");
      return;
    }

    try {
      if (isUpdateMode && existingReview) {
        // Update Logic
        const updateRequest: UpdateReviewRequest = {
          rating: rating,
          comment: comment || undefined,
        };
        const result = await updateReview(existingReview.id, updateRequest);
        if (result) {
          toast.success("Cập nhật đánh giá thành công!");
          handleClose();
          onSuccess?.();
        }
      } else {
        // Create Logic
        // Check pending uploads
        const hasUnuploadedFiles = fileList.some(
          file => file.originFileObj && !uploadedAssetIds.has(file.uid)
        );
        
        if (hasUnuploadedFiles || uploadingFiles.size > 0) {
          toast.warning("Vui lòng đợi tất cả files tải lên hoàn tất trước khi gửi!");
          return;
        }

        const allAssetIds = fileList
          .map(file => uploadedAssetIds.get(file.uid))
          .filter((id): id is string => Boolean(id));

        const createRequest: CreateReviewRequest = {
          reviewType: ReviewType.PRODUCT,
          reviewableId: productId,
          rating: rating,
          comment: comment || undefined,
          orderId: orderId,
          mediaAssetIds: allAssetIds.length > 0 ? allAssetIds : undefined,
        };

        const result = await createReview(createRequest);
        if (result) {
          toast.success("Gửi đánh giá thành công!");
          handleClose();
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // --- Upload Logic (Adapted from Antd to Native) ---
  const handleNativeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    
    // 1. Validation Logic
    const currentImages = fileList.filter(f => f.type?.startsWith("image/")).length;
    const currentVideos = fileList.filter(f => f.type?.startsWith("video/")).length;
    
    let newImagesCount = 0;
    let newVideosCount = 0;
    const validFiles: File[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isImage && !isVideo) {
        toast.error(`${file.name}: Chỉ chấp nhận file hình ảnh hoặc video!`);
        continue;
      }
      if (!isLt10M) {
        toast.error(`${file.name}: File phải nhỏ hơn 10MB!`);
        continue;
      }

      if (isImage) newImagesCount++;
      if (isVideo) newVideosCount++;
      validFiles.push(file);
    }

    if (currentImages + newImagesCount > 5) {
      toast.error("Tối đa 5 hình ảnh!");
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (currentVideos + newVideosCount > 2) {
      toast.error("Tối đa 2 video!");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Process Valid Files
    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      uid: crypto.randomUUID(), // Generate unique ID
      name: file.name,
      status: "uploading",
      originFileObj: file,
      type: file.type,
      thumbUrl: URL.createObjectURL(file),
    }));

    // Update UI List immediately
    setFileList(prev => [...prev, ...newUploadFiles]);

    // 3. Trigger Upload for each file
    newUploadFiles.forEach(async (fileWrapper) => {
      const fileUid = fileWrapper.uid;
      const fileObj = fileWrapper.originFileObj!;

      // Mark as uploading
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.add(fileUid);
        return newSet;
      });

      try {
        const isImage = fileWrapper.type?.startsWith("image/") ?? false;
        const context = isImage ? UploadContext.REVIEW_IMAGE : UploadContext.REVIEW_VIDEO;

        const result = await uploadFile(fileObj, context);

        if (result.assetId) {
          setUploadedAssetIds(prev => {
            const newMap = new Map(prev);
            newMap.set(fileUid, result.assetId);
            return newMap;
          });

          const finalUrl = result.finalUrl;
          setFileList(prev => prev.map(f => {
            if (f.uid === fileUid) {
              return { ...f, status: "done", url: finalUrl, thumbUrl: finalUrl || f.thumbUrl };
            }
            return f;
          }));
          
          toast.success(`Đã tải lên ${fileWrapper.name}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Lỗi tải lên ${fileWrapper.name}`);
        
        setFileList(prev => prev.map(f => f.uid === fileUid ? { ...f, status: "error" } : f));
        
        setUploadedAssetIds(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileUid);
          return newMap;
        });
      } finally {
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileUid);
          return newSet;
        });
      }
    });

    // Reset input for next selection
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (fileUid: string) => {
    const fileToRemove = fileList.find(f => f.uid === fileUid);
    
    // Revoke object URL to avoid memory leaks
    if (fileToRemove?.thumbUrl && fileToRemove.thumbUrl.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.thumbUrl);
    }

    setFileList(prev => prev.filter(f => f.uid !== fileUid));
    
    setUploadedAssetIds(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileUid);
      return newMap;
    });
    
    setUploadingFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileUid);
      return newSet;
    });
  };

  const isLoading = createLoading || updateLoading || uploadingMedia || uploadingFiles.size > 0;

  if (!open || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col overflow-hidden border border-gray-100 z-10 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h3 className="text-xl font-bold text-gray-800">
              {isUpdateMode ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Product Info */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Sản phẩm</p>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{productName}</p>
          </div>

          <div className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Chất lượng sản phẩm <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-medium text-orange-600">
                  {(hoverRating || rating) > 0 ? (
                    (hoverRating || rating) === 5 ? "Tuyệt vời" :
                    (hoverRating || rating) === 4 ? "Hài lòng" :
                    (hoverRating || rating) === 3 ? "Bình thường" :
                    (hoverRating || rating) === 2 ? "Không hài lòng" : "Tệ"
                  ) : ""}
                </span>
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nhận xét <span className="font-normal text-gray-400">(Tùy chọn)</span>
              </label>
              <div className="relative">
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                  placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 text-sm text-gray-800 placeholder:text-gray-400 resize-none transition-all"
                />
                <span className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-1">
                  {comment.length}/2000
                </span>
              </div>
            </div>

            {/* Media Upload Section (Only for Create Mode) */}
            {!isUpdateMode && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Hình ảnh / Video thực tế
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Tối đa 5 ảnh & 2 video. Mỗi file không quá 10MB.
                </p>

                {/* Grid of Images */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {fileList.map((file) => (
                    <div key={file.uid} className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      {file.type?.startsWith("video/") ? (
                        <video src={file.thumbUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={file.thumbUrl} alt="preview" className="w-full h-full object-cover" />
                      )}
                      
                      {/* Uploading Overlay */}
                      {(file.status === "uploading" || uploadingFiles.has(file.uid)) && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}

                      {/* Error Overlay */}
                      {file.status === "error" && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center border-2 border-red-500">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                      )}

                      {/* Type Indicator */}
                      <div className="absolute top-1 left-1 bg-black/50 p-0.5 rounded text-white">
                        {file.type?.startsWith("video/") ? <Video size={10} /> : <ImageIcon size={10} />}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFile(file.uid)}
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                        type="button"
                      >
                        <X size={14} className="text-gray-600" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  {fileList.length < 7 && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-orange-500 gap-1"
                    >
                      <UploadCloud size={24} />
                      <span className="text-[10px] font-medium">Thêm</span>
                    </div>
                  )}
                </div>
                
                {/* Hidden Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleNativeFileSelect}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                />
              </div>
            )}

            {/* Note for Create Mode */}
            {!isUpdateMode && (
              <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  Đánh giá của bạn sẽ được kiểm duyệt trước khi hiển thị công khai để đảm bảo tính minh bạch.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUpdateMode ? "Cập nhật" : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};