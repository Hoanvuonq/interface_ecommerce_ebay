/* eslint-disable @next/next/no-img-element */
"use client";

import { PortalModal } from "@/features/PortalModal";
import { X, Maximize2, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface MediaLightboxProps {
  media: {
    url: string;
    type: "IMAGE" | "VIDEO";
    title?: string;
  } | null;
  onClose: () => void;
}

export const MediaLightbox = ({ media, onClose }: MediaLightboxProps) => {
  if (!media || !media.url) return null;

  const isOpen = Boolean(media && media.url);

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[100vw] h-screen"
      className="bg-black/90 backdrop-blur-xl border-none rounded-none max-h-screen p-0 shadow-none flex items-center justify-center overflow-hidden z-9999"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center group overflow-hidden">
        <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-100 bg-linear-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
              {media.type === "VIDEO" ? (
                <MonitorPlay size={20} className="text-white" />
              ) : (
                <Maximize2 size={20} className="text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[13px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                {media.type === "VIDEO" ? "Phát Video" : "Xem Ảnh Chi Tiết"}
              </span>
              {media.title && (
                <p className="text-white/60 text-[11px] font-medium italic truncate max-w-md">
                  {media.title}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-orange-500 text-white rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-90 shadow-2xl"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div
          className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 select-none cursor-zoom-out"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-full flex items-center justify-center"
          >
            {media.type === "VIDEO" ? (
              <div className="relative w-full max-w-5xl aspect-video rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 bg-black group/video">
                <video
                  src={media.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain outline-none"
                />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 bg-white/5 backdrop-blur-sm">
                <Image
                  src={media.url}
                  alt={media.title || "Preview"}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-screen object-contain transition-transform duration-700 hover:scale-105"
                  priority
                  unoptimized
                />
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
              Click vùng trống để thoát
            </p>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
