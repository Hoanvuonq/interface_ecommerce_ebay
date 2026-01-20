"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Star,
  Video as VideoIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import Image from "next/image";

export interface MediaUploadItem {
  id?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  title?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  file?: File;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
}

interface ProductMediaUploadProps {
  productId: string;
  productName: string;
  existingMedia?: MediaUploadItem[];
  onMediaChange?: (media: MediaUploadItem[]) => void;
}

export default function ProductMediaUpload({
  productId,
  productName,
  existingMedia = [],
  onMediaChange,
}: ProductMediaUploadProps) {
  const [mediaItems, setMediaItems] =
    useState<MediaUploadItem[]>(existingMedia);
  const { uploadFile, uploading: globalUploading } = usePresignedUpload();

  useEffect(() => {
    setMediaItems(existingMedia);
  }, [existingMedia]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaUploadItem[] = [];

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const preview = isVideo ? undefined : URL.createObjectURL(file);

      const tempItem: MediaUploadItem = {
        url: "",
        type: isVideo ? "VIDEO" : "IMAGE",
        file,
        preview,
        uploading: true,
        uploaded: false,
        sortOrder: mediaItems.length + newItems.length,
      };

      newItems.push(tempItem);
    }

    setMediaItems((prev) => [...prev, ...newItems]);

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      if (!item.file) continue;

      try {
        const context =
          item.type === "VIDEO"
            ? UploadContext.PRODUCT_VIDEO
            : UploadContext.PRODUCT_IMAGE;

        const result = await uploadFile(item.file, context);

        if (result.finalUrl) {
          setMediaItems((prev) =>
            prev.map((m) =>
              m === item
                ? {
                    ...m,
                    url: result.finalUrl || "",
                    uploading: false,
                    uploaded: true,
                  }
                : m,
            ),
          );
        } else {
          throw new Error("Tải lên thất bại");
        }
      } catch (error: any) {
        setMediaItems((prev) =>
          prev.map((m) =>
            m === item
              ? {
                  ...m,
                  uploading: false,
                  uploaded: false,
                  error: error.message || "Lỗi tải lên",
                }
              : m,
          ),
        );
      }
    }

    if (onMediaChange) {
      setMediaItems((current) => {
        onMediaChange(current);
        return current;
      });
    }
    event.target.value = "";
  };

  const handleRemove = (index: number) => {
    setMediaItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (onMediaChange) onMediaChange(updated);
      return updated;
    });
  };

  const handleSetPrimary = (index: number) => {
    setMediaItems((prev) => {
      const updated = prev.map((item, i) => ({
        ...item,
        isPrimary: i === index,
      }));
      if (onMediaChange) onMediaChange(updated);
      return updated;
    });
  };

  const allUploaded = mediaItems.every((item) => item.uploaded || item.id);
  const hasErrors = mediaItems.some((item) => item.error);

  return (
    <div className="space-y-6">
      {/* Vùng tải lên - Style Web3 */}
      <div className="relative group">
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-40 rounded-[2rem] border-2 border-dashed transition-all duration-300 cursor-pointer",
            globalUploading
              ? "bg-gray-50 border-orange-200 cursor-not-allowed"
              : "bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 group-hover:shadow-2xl group-hover:shadow-orange-100",
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">
              {globalUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" strokeWidth={2.5} />
              )}
            </div>
            <p className="text-[13px] font-bold uppercase tracking-widest text-gray-700 italic">
              {globalUploading
                ? "🚀 Đang đồng bộ dữ liệu..."
                : "Kéo thả hoặc Click để tải lên"}
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
              JPG, PNG, WebP, MP4 (Tối đa 10MB)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={globalUploading}
          />
        </label>
      </div>

      {/* Lưới hiển thị Media */}
      {mediaItems.length > 0 && (
        <div className="bg-white/50 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-6 shadow-xl shadow-gray-100/50">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <p className="text-[11px] font-bold uppercase  text-gray-500">
                Thư viện tài sản{" "}
                <span className="text-orange-500 italic">
                  ({mediaItems.length})
                </span>
              </p>
            </div>

            {allUploaded && !hasErrors && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                Đã đồng bộ tất cả
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-[1.8rem] overflow-hidden border border-gray-100 bg-gray-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
              >
                {item.uploading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50/50">
                    <Loader2
                      className="w-8 h-8 text-orange-500 animate-spin"
                      strokeWidth={3}
                    />
                  </div>
                ) : item.error ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-red-50">
                    <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                    <p className="text-[10px] font-bold text-red-600 uppercase leading-tight">
                      {item.error}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {item.type === "VIDEO" ? (
                      <div className="relative w-full h-full bg-slate-900">
                        <video
                          src={item.preview || item.url}
                          className="w-full h-full object-cover opacity-60"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                            <VideoIcon
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.preview || item.url}
                        alt="Hình ảnh sản phẩm"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      />
                    )}
                  </div>
                )}

                {/* Nhãn Ảnh chính */}
                {item.isPrimary && (
                  <div className="absolute top-3 left-3 z-10 animate-in zoom-in-50 duration-500">
                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-[9px] font-bold uppercase italic rounded-lg shadow-lg">
                      <Star className="w-2.5 h-2.5 fill-current" /> Ảnh chính
                    </span>
                  </div>
                )}

                {/* Hành động khi Hover - Hiệu ứng kính */}
                {!item.uploading && (
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4 z-20">
                    <div className="flex flex-col gap-2 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {!item.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(index)}
                          className="w-full py-2 bg-white/90 backdrop-blur-md text-slate-900 rounded-xl hover:bg-orange-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest italic shadow-xl"
                        >
                          Đặt làm chính
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(index)}
                        className="w-full py-2 bg-red-500/90 backdrop-blur-md text-white rounded-xl hover:bg-red-600 transition-all text-[10px] font-bold uppercase tracking-widest italic shadow-xl flex items-center justify-center gap-1"
                      >
                        <X size={12} strokeWidth={3} /> Xóa mục này
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phần hướng dẫn - Web3 tối giản */}
      <div className="bg-orange-50/50 border border-orange-100 rounded-4xl p-6">
        <h4 className="text-[11px] font-semibold text-orange-600 uppercase  mb-3 flex items-center gap-2">
          Yêu cầu hệ thống
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {[
            "Tải lên tài sản đồng bộ hàng loạt",
            "Lựa chọn hình ảnh hiển thị chính",
            "Tự động tối ưu hóa kích thước ảnh",
            "Hỗ trợ đa định dạng (JPG, MP4, WebP)",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[11px] font-bold text-orange-800 opacity-70"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
