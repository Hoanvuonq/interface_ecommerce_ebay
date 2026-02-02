/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  CloudUpload,
  Eye,
  Globe,
  ImageIcon,
  Lock,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CustomFile, MediaUploadFieldProps } from "./type";

export const MediaUploadField: React.FC<
  MediaUploadFieldProps & {
    onUploadApi?: (file: File, onProgress: (p: number) => void) => Promise<any>;
    mode?: "public" | "private";
  }
> = ({
  value = [],
  onChange,
  maxCount = 1,
  size = "md",
  allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4"],
  maxSizeMB = 10,
  className,
  classNameSizeUpload,
  onUploadApi,
  mode = "public",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewMedia, setPreviewMedia] = useState<CustomFile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const sizeClasses = {
    sm: "w-24 h-24 rounded-2xl",
    md: "w-34 h-40 rounded-2xl",
    lg: "w-full h-48 rounded-[2rem]",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFilesArray = Array.from(files);
    let currentList = [...value].filter((f) => f.uid);

    for (const file of newFilesArray) {
      if (currentList.length >= maxCount) break;

      const uid = Math.random().toString(36).substring(7);
      const objectUrl = URL.createObjectURL(file);

      const newFile: CustomFile = {
        uid,
        name: file.name,
        status: "uploading",
        originFileObj: file,
        url: objectUrl,
        type: file.type,
        percent: 0,
        isPublic: mode === "public",
        isPrivate: mode === "private",
      };

      const updatedList = [...currentList, newFile];
      currentList = updatedList;
      onChange(updatedList);

      if (onUploadApi) {
        try {
          const result = await onUploadApi(file, (p) => {
            // 🟢 Cập nhật phần trăm loading vào UI
            onChange(
              currentList.map((f) =>
                f.uid === uid ? { ...f, percent: p } : f,
              ),
            );
          });

          // 🟢 Upload hoàn tất
          onChange(
            currentList.map((f) =>
              f.uid === uid
                ? {
                    ...f,
                    status: "done",
                    url: result.url || result.finalUrl || objectUrl, // Ưu tiên URL kết quả hoặc giữ Blob URL
                    assetId: result.assetId || result.id,
                    percent: 100,
                  }
                : f,
            ),
          );
        } catch (error) {
          onChange(currentList.filter((f) => f.uid !== uid));
        }
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const CircularProgress = ({ percent }: { percent: number }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    return (
      <div className="relative flex items-center justify-center">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            stroke="#f97316"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset: circumference - (percent / 100) * circumference,
            }}
          />
        </svg>
        <span className="absolute text-[9px] font-bold text-white">
          {Math.round(percent)}%
        </span>
      </div>
    );
  };

  const renderPortal = () => {
    if (!mounted || typeof document === "undefined") return null;
    return createPortal(
      <AnimatePresence>
        {previewMedia && previewMedia.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setPreviewMedia(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewMedia(null)}
                className="absolute -top-12 right-0 text-white hover:text-orange-500"
              >
                <X size={32} />
              </button>
              {previewMedia.type?.includes("video") ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-2xl mx-auto"
                />
              ) : (
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={previewMedia.url}
                    alt="preview"
                    fill
                    unoptimized
                    priority
                    className="object-contain rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center flex-wrap gap-4",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {value
          .filter((f) => f.uid)
          .map((file) => (
            <motion.div
              key={file.uid}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "relative group border-2 border-gray-100 bg-gray-50 overflow-hidden shadow-sm",
                sizeClasses[size],
              )}
            >
              {file.url ? (
                <div className="relative w-full h-full">
                  {file.type?.includes("video") ? (
                    <video
                      src={file.url}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={file.url}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 z-20 flex gap-1">
                    <div className="bg-black/50 backdrop-blur-md p-1 rounded-full text-white shadow-sm">
                      {mode === "public" ? (
                        <Globe size={10} />
                      ) : (
                        <Lock size={10} />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="text-gray-300" size={24} />
                </div>
              )}

              {file.status === "uploading" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                  <CircularProgress percent={file.percent || 0} />
                  <span className="text-[8px] font-bold text-white uppercase mt-2 tracking-widest">
                    Đang tải
                  </span>
                </div>
              )}

              {file.status === "done" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 z-20 bg-emerald-500 text-white rounded-full p-0.5 shadow-lg border border-white"
                >
                  <CheckCircle2 size={10} strokeWidth={3} />
                </motion.div>
              )}

              {file.status !== "uploading" && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => setPreviewMedia(file)}
                    className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-orange-500 shadow-sm"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(value.filter((f) => f.uid !== file.uid))
                    }
                    className="p-1.5 bg-white rounded-lg text-gray-700 hover:bg-rose-500 hover:text-white shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}

        {value.filter((f) => f.uid).length < maxCount && (
          <motion.label
            layout
            className={cn(
              "border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group",
              sizeClasses[size],
              classNameSizeUpload,
            )}
          >
            <input
              type="file"
              className="hidden"
              multiple={maxCount > 1}
              accept={allowedTypes.join(",")}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-gray-400 group-hover:text-orange-500">
              <CloudUpload size={20} />
            </div>
            <span className="mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-orange-600">
              Tải lên
            </span>
          </motion.label>
        )}
      </AnimatePresence>
      {renderPortal()}
    </div>
  );
};
