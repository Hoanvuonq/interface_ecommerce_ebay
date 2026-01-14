"use client";

import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    url: string;
    name: string;
  } | null;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  if (!file) return null;

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-6xl"
      className="bg-transparent border-none shadow-none overflow-visible"
    >
      <div className="relative w-full flex flex-col items-center select-none py-2">
        <button
          onClick={onClose}
          className={cn(
            "fixed top-6 right-6 p-3 bg-white/10 hover:bg-orange-500/20 border",
            "border-white/10 hover:border-orange-500/50 rounded-full text-white/70",
            "hover:text-orange-500 transition-all duration-300 group z-60 backdrop-blur-md"
          )}
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-3 shadow-inner">
            <Maximize2 size={12} className="text-orange-400" />
            <span className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Preview Mode
            </span>
          </div>
          <h3 className="text-white font-bold text-lg tracking-tight truncate max-w-sm sm:max-w-xl drop-shadow-lg opacity-90">
            {file.name}
          </h3>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group w-full max-w-4xl"
        >
          <div className="relative w-full h-[70vh] min-h-100">
            <Image
              src={file.url}
              alt={file.name}
              fill
              priority
              unoptimized
              sizes="80vw"
              className="object-contain rounded-4xl z-10 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </PortalModal>
  );
};
