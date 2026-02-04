"use client";

import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { X, PlayCircle } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

interface ImageWithPreviewProps {
  src?: string;
  imagePath?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  onError?: (e: any) => void;
}

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({
  src,
  imagePath,
  alt = "Product Media",
  className,
  width,
  height,
  sizes,
  onError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const { displayUrl, isVideo } = useMemo(() => {
    const rawPath = String(imagePath || src || "");
    if (!rawPath || rawPath === "") {
      return { displayUrl: "/placeholder-product.png", isVideo: false };
    }

    // Kiểm tra video bằng cách tìm chuỗi định dạng
    const isVid =
      rawPath.toLowerCase().includes(".mp4") ||
      rawPath.toLowerCase().includes(".mov") ||
      rawPath.toLowerCase().includes(".webm");

    const processedPath = rawPath.includes("*")
      ? rawPath.replace("*", "orig")
      : rawPath;
    const url = processedPath.startsWith("http")
      ? processedPath
      : toPublicUrl(processedPath);

    return { displayUrl: url, isVideo: isVid };
  }, [src, imagePath]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const ModalContent = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <button
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500 rounded-full text-white transition-all z-50"
        onClick={handleClose}
      >
        <X size={28} />
      </button>

      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={displayUrl}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl bg-black"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={displayUrl}
              alt={alt}
              fill
              unoptimized
              className="object-contain animate-in zoom-in-95 duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden cursor-pointer group bg-slate-200 flex items-center justify-center rounded-lg border border-gray-100",
          !width && !height ? "w-full h-full" : "",
          className,
        )}
        style={width ? { width, height } : {}}
        onClick={() => setIsOpen(true)}
      >
        {isVideo ? (
          /* 🟢 BƯỚC 2: Hiển thị Video Thumbnail tĩnh */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              src={`${displayUrl}#t=0.1`} // Buộc trình duyệt bốc frame ở giây 0.1
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous" // Cần thiết để bốc frame từ R2
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity"
            />
            {/* Overlay icon Play */}
            <div className="relative z-10 p-2.5 bg-black/40 rounded-full backdrop-blur-md border border-white/20 text-white shadow-xl">
              <PlayCircle
                size={width ? Math.min(width / 3.5, 28) : 24}
                strokeWidth={2.5}
                fill="currentColor"
                className="opacity-90"
              />
            </div>
          </div>
        ) : (
          /* Thumbnail cho Ảnh */
          <Image
            src={displayUrl}
            alt={alt}
            {...(!width && !height ? { fill: true, sizes } : { width, height })}
            unoptimized
            onError={onError}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>

      {isOpen && mounted && createPortal(ModalContent, document.body)}
    </>
  );
};
