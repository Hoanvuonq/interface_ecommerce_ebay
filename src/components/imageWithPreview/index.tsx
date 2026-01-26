"use client";

import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ImageWithPreviewProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  sizes?: string;
  height?: number;
  onError?: (e: any) => void;
}

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({
  src,
  alt = "Product Image",
  className,
  sizes,
  width,
  height,
  onError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, handleClose]);

  if (!src) return null;

  const ModalContent = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <button
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500 rounded-full text-white z-100 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      >
        <X size={28} strokeWidth={3} />
      </button>

      <div
        className="relative w-[90vw] h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-contain animate-in zoom-in-95 duration-500"
        />
      </div>

      <div className="absolute bottom-10 text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase pointer-events-none">
        {alt}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden cursor-pointer group",
          !width && !height ? "w-full h-full" : "",
          className,
        )}
        style={width ? { width, height } : {}}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src || "/placeholder-product.png"}
          alt={alt}
          {...(!width && !height ? { fill: true, sizes } : { width, height })}
          onError={onError}
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            !width && !height ? "" : "w-full h-full",
          )}
        />
      </div>

      {isOpen && mounted && createPortal(ModalContent, document.body)}
    </>
  );
};
