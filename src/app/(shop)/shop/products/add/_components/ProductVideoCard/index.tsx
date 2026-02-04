"use client";

import React, { useRef } from "react";
import {
  Trash2,
  PlayCircle,
  Plus,
  Loader2,
  Info,
  Clapperboard,
} from "lucide-react";
import { cn } from "@/utils/cn";
// 🟢 Bước 1: Import hàm chuẩn của bro
import { toPublicUrl } from "@/utils/storage/url";

interface MediaFile {
  uid: string;
  url: string;
  imagePath?: string; 
  name: string;
  processing?: boolean;
}

interface ProductVideoCardProps {
  videoList: MediaFile[];
  onUpload: (files: FileList) => Promise<void>;
  onRemove: (uid: string) => void;
  onPreview: (file: MediaFile) => void;
}

export const ProductVideoCard: React.FC<ProductVideoCardProps> = ({
  videoList,
  onUpload,
  onRemove,
  onPreview,
}) => {
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 🟢 Bước 2: Hàm xử lý lấy URL video (Dùng cho cả Add và Edit)
  const getDisplayUrl = (file: MediaFile) => {
    // Ưu tiên imagePath (Edit mode), fallback về url (Add mode/blob)
    const rawPath = file.imagePath || file.url;
    if (!rawPath) return "";

    // Video thường không có dấu * như ảnh, nhưng dùng toPublicUrl để gắn domain R2
    return toPublicUrl(rawPath);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-sm border border-orange-100">
            <Clapperboard size={24} />
          </div>
          <div>
            <h5 className="text-lg font-bold text-gray-800 tracking-tight leading-none">
              Video sản phẩm
            </h5>
            <p className="text-xs text-gray-400 mt-1 font-medium italic">
              Tối đa 1 video • Giúp tăng tỷ lệ chốt đơn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
        {videoList.map((file) => (
          <div
            key={file.uid}
            className="relative group aspect-4/5 flex flex-col"
          >
            <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-orange-100 bg-slate-900 shadow-sm transition-all duration-300 group-hover:border-orange-300">
              <video
                // 🟢 Bước 3: Dùng displayUrl đã xử lý qua toPublicUrl
                src={getDisplayUrl(file)}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  file.processing ? "opacity-30 blur-sm" : "opacity-60",
                )}
              />

              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                onClick={() => !file.processing && onPreview(file)}
              >
                {file.processing ? (
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                ) : (
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-full group-hover:scale-110 transition-all border border-white/30">
                    <PlayCircle className="w-6 h-6 text-white fill-white/10" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onRemove(file.uid)}
                className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-20"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <span className="mt-1.5 text-[9px] text-gray-400 truncate px-1 text-center font-medium italic">
              {file.name}
            </span>
          </div>
        ))}

        {videoList.length < 1 && (
          <label className="aspect-4/5 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-50/30 hover:border-orange-300 transition-all cursor-pointer group">
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
            <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 group-hover:bg-white transition-all shadow-sm group-hover:shadow-orange-100">
              <Plus className="text-gray-400 group-hover:text-orange-500 w-5 h-5 transition-colors" />
            </div>
            <span className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-orange-600 transition-colors">
              Tải Video
            </span>
          </label>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-orange-500" />
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Tiêu chuẩn:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            "Tối đa 30MB",
            "Định dạng MP4",
            "Thời lượng 10s-60s",
            "Tỷ lệ 16:9 hoặc 1:1",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[10px] text-gray-500 font-bold italic"
            >
              <div className="w-1 h-1 rounded-full bg-orange-400" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
