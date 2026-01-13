"use client";

import { PortalModal } from "@/features/PortalModal";
import { X } from "lucide-react";
import Image from "next/image";

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
      className="bg-black/95 border-none rounded-none max-h-screen p-0 shadow-none flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-10 group">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-orange-500 text-white rounded-full transition-all duration-300 z-100 shadow-lg border border-white/10 hover:scale-110 active:scale-95"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {media.title && (
          <div className="absolute top-6 left-6 z-100 max-w-[70%] animate-in slide-in-from-left-4 duration-500">
            <p className="text-white text-sm font-bold bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 uppercase tracking-widest leading-none">
              {media.title}
            </p>
          </div>
        )}

        <div 
          className="relative w-full h-full flex items-center justify-center select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {media.type === "VIDEO" ? (
            <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/5 animate-in zoom-in-95 duration-500">
              <video
                src={media.url}
                controls
                autoPlay
                className="w-full h-full outline-none"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500">
               <Image
                src={media.url}
                alt={media.title || "Preview"}
                width={1600}
                height={1000}
                className="max-w-full max-h-[90vh] object-contain rounded-lg transition-transform duration-500"
                priority
                unoptimized 
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] bg-white/5 px-8 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
            Nhấn ESC hoặc vùng trống để đóng
          </p>
        </div>
      </div>
    </PortalModal>
  );
};