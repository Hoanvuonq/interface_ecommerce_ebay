"use client";

import React from "react";
import { X, Play } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";

interface CustomVideoModalProps {
  open: boolean;
  videoUrl: string | null;
  onCancel: () => void;
}

export const CustomVideoModal: React.FC<CustomVideoModalProps> = ({
  open,
  videoUrl,
  onCancel,
}) => {
  if (!videoUrl) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onCancel}
      width="max-w-5xl"
      className="bg-transparent border-none shadow-none overflow-visible"
    >
      <div className="relative w-full flex flex-col items-center select-none">
        <button
          onClick={onCancel}
          className="absolute -top-3 right-0 p-3 bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/50 rounded-full text-white/70 hover:text-orange-500 transition-all duration-300 group z-50 backdrop-blur-md"
          aria-label="Đóng video"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-2">
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Play size={10} fill="currentColor" /> Preview Video
            </span>
          </div>
        </div>

        <div className="relative w-full group rounded-[2.5rem] bg-black p-2 shadow-2xl border border-white/10 overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-auto max-h-[70vh] rounded-4xl shadow-inner"
          >
            Trình duyệt của bạn không hỗ trợ xem video.
          </video>
        </div>
      </div>
    </PortalModal>
  );
};
