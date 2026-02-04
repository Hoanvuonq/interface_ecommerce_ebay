"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { PortalModal } from "@/features/PortalModal";

interface CustomFile {
  uid: string;
  url: string;
  imagePath: string;
  name: string;
}

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileList: CustomFile[];
  onSetMainImage: (index: number) => void;
  getDisplayUrl: (file: CustomFile) => string;
}

export const ImageLibraryModal: React.FC<ImageLibraryModalProps> = ({
  isOpen,
  onClose,
  fileList,
  onSetMainImage,
  getDisplayUrl,
}) => {
  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Quản lý thư viện ảnh"
      width="max-w-6xl"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2">
        {fileList.map((file, index) => (
          <div
            key={file.uid}
            className={cn(
              "relative group rounded-4xl overflow-hidden border-2 transition-all duration-500 bg-slate-50",
              index === 0
                ? "border-orange-500 ring-8 ring-orange-50 shadow-xl scale-[1.02]"
                : "border-slate-100 hover:border-orange-200",
            )}
          >
            <div className="relative aspect-square">
              <Image
                src={getDisplayUrl(file)}
                alt={file.name || `Product image ${index + 1}`} // Fix lỗi thiếu alt
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                unoptimized={true}
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase",
                      index === 0
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-900",
                    )}
                  >
                    {index === 0 ? "Ảnh chính" : `Vị trí ${index + 1}`}
                  </span>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => onSetMainImage(index)}
                      className="p-1.5 bg-white/20 hover:bg-orange-500 rounded-lg text-white transition-colors"
                    >
                      <Star size={12} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalModal>
  );
};
