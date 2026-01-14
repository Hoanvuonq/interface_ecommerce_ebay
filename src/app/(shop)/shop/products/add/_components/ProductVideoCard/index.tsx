"use client";

import React, { useRef } from "react";
import {
  Trash2,
  PlayCircle,
  Plus,
  Loader2,
  Video,
  Info,
  CheckCircle2,
  Clapperboard,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface MediaFile {
  uid: string;
  url: string;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-custom border border-gray-100 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
            <Clapperboard size={24} />
          </div>
          <div>
            <h5 className="text-lg font-bold text-gray-800 tracking-tight leading-none">
              Video sản phẩm
            </h5>
            <p className="text-xs text-orange-400 mt-1.5 font-medium italic">
              Tối đa 1 video • Giúp tăng 80% tỷ lệ chốt đơn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {videoList.map((file) => (
          <div key={file.uid} className="group relative flex flex-col gap-3">
            <div className="relative aspect-video rounded-4xl overflow-hidden bg-gray-900 border border-orange-100 shadow-inner group-hover:shadow-xl group-hover:shadow-orange-900/10 transition-all duration-500">
              <video
                src={file.url}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  file.processing
                    ? "opacity-30 blur-sm"
                    : "opacity-70 group-hover:opacity-90"
                )}
              />

              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                onClick={() => !file.processing && onPreview(file)}
              >
                {file.processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] drop-shadow-md">
                      Đang xử lý
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-full group-hover:scale-110 transition-all duration-300 border border-white/20 shadow-2xl">
                    <PlayCircle className="w-10 h-10 text-white fill-white/10" />
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => onRemove(file.uid)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Video Label */}
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-bold text-gray-500 truncate italic">
                {file.name}
              </span>
            </div>
          </div>
        ))}

        {videoList.length < 1 && (
          <>
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
            <div
              onClick={() => videoInputRef.current?.click()}
              className="aspect-video w-full rounded-[2.5rem] border-2 border-dashed border-orange-200 bg-orange-50/30 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group shadow-inner"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:shadow-orange-100 transition-all duration-500">
                <Plus className="text-orange-500 w-8 h-8" />
              </div>
              <span className="mt-4 text-xs font-bold text-orange-400 group-hover:text-orange-600 uppercase tracking-widest transition-colors">
                Tải Video lên
              </span>
              <p className="mt-1 text-[9px] font-bold text-orange-300 uppercase tracking-tighter">
                MP4, MOV tối đa 30MB
              </p>
            </div>
          </>
        )}
      </div>

      <div className="relative overflow-hidden bg-gray-50 border border-gray-100 rounded-[1.8rem] p-5">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-orange-200">
          <Video size={80} />
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-orange-600">
            <Info size={18} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-orange-900 uppercase tracking-wide">
              Tiêu chuẩn Video hợp lệ:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
              {[
                "Dung lượng tối đa 30MB",
                "Định dạng MP4 phổ biến",
                "Thời lượng 10s - 60s",
                "Tỷ lệ chuẩn 16:9 hoặc 1:1",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-[11px] text-orange-800 font-bold"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-orange-700">
                    <CheckCircle2 size={10} strokeWidth={3} />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
