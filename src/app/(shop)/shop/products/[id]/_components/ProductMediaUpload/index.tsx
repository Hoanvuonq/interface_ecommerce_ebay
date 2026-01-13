"use client";

import { useState, useEffect } from "react";
import { Upload, X, Star, Video as VideoIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";

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
  const [mediaItems, setMediaItems] = useState<MediaUploadItem[]>(existingMedia);
  const { uploadFile, uploading: globalUploading } = usePresignedUpload();

  // Sync with existingMedia prop changes
  useEffect(() => {
    setMediaItems(existingMedia);
  }, [existingMedia]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaUploadItem[] = [];

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const preview = isVideo ? undefined : URL.createObjectURL(file);

      const tempItem: MediaUploadItem = {
        url: "", // Will be set after upload
        type: isVideo ? "VIDEO" : "IMAGE",
        file,
        preview,
        uploading: true,
        uploaded: false,
        sortOrder: mediaItems.length + newItems.length,
      };

      newItems.push(tempItem);
    }

    // Add temp items to state
    setMediaItems((prev) => [...prev, ...newItems]);

    // Upload each file
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      if (!item.file) continue;

      try {
        const context = item.type === "VIDEO" 
          ? UploadContext.PRODUCT_VIDEO 
          : UploadContext.PRODUCT_IMAGE;

        const result = await uploadFile(item.file, context);

        if (result.finalUrl) {
          // Update the item with final URL
          setMediaItems((prev) =>
            prev.map((m) =>
              m === item
                ? { ...m, url: result.finalUrl || "", uploading: false, uploaded: true }
                : m
            )
          );
        } else {
          throw new Error("Upload failed - no final URL");
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        setMediaItems((prev) =>
          prev.map((m) =>
            m === item
              ? { ...m, uploading: false, uploaded: false, error: error.message || "Upload failed" }
              : m
          )
        );
      }
    }

    // Notify parent
    if (onMediaChange) {
      setMediaItems((current) => {
        onMediaChange(current);
        return current;
      });
    }

    // Clear input
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
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium">
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={globalUploading}
          />
        </label>

        {globalUploading && (
          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang upload...
          </span>
        )}
      </div>

      {/* Upload Status */}
      {mediaItems.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              {mediaItems.length} media files
            </p>
            {allUploaded && !hasErrors && (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Tất cả đã upload
              </span>
            )}
            {hasErrors && (
              <span className="inline-flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                Có lỗi xảy ra
              </span>
            )}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-5 gap-3">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
              >
                {/* Media Preview */}
                {item.uploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                ) : item.error ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-xs text-red-600">{item.error}</p>
                  </div>
                ) : item.type === "VIDEO" ? (
                  <div className="relative w-full h-full bg-gray-900">
                    {item.preview ? (
                      <video
                        src={item.preview}
                        className="w-full h-full object-cover"
                        muted
                        onError={(e) => {
                          console.error("❌ Video load error:", item);
                        }}
                      />
                    ) : item.url ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        onError={(e) => {
                          console.error("❌ Video load error:", item);
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                        <VideoIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.preview || item.url || "/placeholder.png"}
                    alt={item.altText || `Media ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("❌ Image load error:", item);
                      // Fallback to placeholder
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                )}

                {/* Primary Badge */}
                {item.isPrimary && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                {!item.uploading && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col gap-2">
                      {!item.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(index)}
                          className="px-3 py-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(index)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Hướng dẫn:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>✅ Upload nhiều ảnh/video cùng lúc</li>
          <li>✅ Click "Set Primary" để chọn ảnh đại diện chính</li>
          <li>✅ Click "Remove" để xóa media không mong muốn</li>
          <li>📌 Hỗ trợ: JPG, PNG, GIF, WebP, MP4, MOV (tối đa 10MB/file)</li>
          <li>🚀 Tự động xử lý: resize và tạo variants cho tốc độ tải nhanh</li>
        </ul>
      </div>
    </div>
  );
}

