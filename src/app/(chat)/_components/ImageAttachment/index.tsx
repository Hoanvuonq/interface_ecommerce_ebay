"use client";

import React, { useState } from "react";
import _ from "lodash";
import Image from "next/image";
import { 
  Maximize2, 
  Download, 
  AlertCircle, 
  Loader2,
  Image as ImageIcon
} from "lucide-react"; 
import { cn } from "@/utils/cn";

interface MessageAttachmentResponse {
  fileUrl: string;
  fileName?: string;
}

interface ImageAttachmentProps {
  attachment: MessageAttachmentResponse;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageAttachment: React.FC<ImageAttachmentProps> = ({
  attachment,
  maxWidth = 260,
  maxHeight = 260,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileUrl = _.get(attachment, 'fileUrl');
    const fileName = _.get(attachment, 'fileName', 'image.jpg');

    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("CORS fetch failed, falling back to window.open", err);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="relative mt-2 w-fit group">
      <div 
        className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98]"
        style={{ width: maxWidth, height: maxHeight }}
      >
        {loading && !error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-orange-50 animate-pulse">
            <Loader2 className="animate-spin text-orange-400" size={28} />
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center h-full bg-red-50 gap-2">
            <AlertCircle className="text-red-400" size={32} />
            <span className="text-[11px] font-medium text-red-400 uppercase tracking-tighter">Lỗi tải ảnh</span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={attachment.fileUrl}
              alt={attachment.fileName || "Image"}
              fill
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-110",
                loading ? "opacity-0" : "opacity-100"
              )}
              onLoadingComplete={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              sizes="(max-width: 768px) 100vw, 260px"
            />

            {!loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-4 bg-black/30 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
                <button 
                  onClick={() => window.open(attachment.fileUrl, '_blank')}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
                >
                  <Maximize2 size={20} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/80 text-white backdrop-blur-md transition-all hover:bg-orange-500 hover:scale-110 active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  <Download size={20} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Tag */}
      {!loading && !error && attachment.fileName && (
        <div className="mt-1.5 flex items-center gap-1.5 px-1">
          <ImageIcon size={12} className="text-orange-400 shrink-0" />
          <span className="truncate text-[11px] font-semibold text-white tracking-tight max-w-50">
            {_.truncate(attachment.fileName, { length: 25 })}
          </span>
        </div>
      )}
    </div>
  );
};