"use client";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import Image from "next/image";

export const ImageWithPreview: React.FC<any> = ({
  src,
  alt,
  className,
  fallback = "/placeholder-product.png",
  onError,
  onClick,
  showModal,
  setShowModal,
  ...rest
}) => {
  return (
    <>
      <Image
        src={src || fallback}
        alt={alt}
        className={cn("object-cover cursor-zoom-in", className)}
        fill
        onError={onError}
        onClick={onClick}
        {...rest}
      />
      {showModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal && setShowModal(false)}
        >
          <button className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors">
            <X size={32} />
          </button>
          <img
            src={src || fallback}
            alt={alt}
            className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />
        </div>
      )}
    </>
  );
};