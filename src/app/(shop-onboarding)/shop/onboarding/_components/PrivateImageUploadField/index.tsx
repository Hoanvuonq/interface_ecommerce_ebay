/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CloudUpload,
  X,
  Eye,
  Lock,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { UploadContext } from "@/types/storage/storage.types";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";

export interface PrivateUploadFile {
  uid: string;
  name: string;
  url?: string;
  finalUrl?: string;
  assetId?: string;
  status: "uploading" | "done" | "error";
  percent: number;
}

interface PrivateImageUploadFieldProps {
  value?: PrivateUploadFile[];
  onChange: (value: PrivateUploadFile[]) => void;
  onUploadApi: (file: File, options: any) => Promise<any>;
  maxCount?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  context?: UploadContext;
}

export const PrivateImageUploadField: React.FC<
  PrivateImageUploadFieldProps
> = ({
  value = [],
  onChange,
  onUploadApi,
  maxCount = 1,
  allowedTypes = ["image/png", "image/jpeg", "image/jpg"],
  maxSizeMB = 10,
  context = UploadContext.DOCUMENT,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<PrivateUploadFile | null>(
    null,
  );

  // 🟢 QUAN TRỌNG: Ref dùng để quản lý danh sách file đang xử lý async, tránh bị ghi đè khi render
  const filesRef = useRef<PrivateUploadFile[]>(value);
  useEffect(() => {
    filesRef.current = value;
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFilesArray = Array.from(files);

    for (const file of newFilesArray) {
      if (filesRef.current.length >= maxCount) break;
      if (!allowedTypes.includes(file.type)) continue;
      if (file.size / 1024 / 1024 > maxSizeMB) continue;

      const uid = Math.random().toString(36).substring(7);
      const objectUrl = URL.createObjectURL(file);

      const newFile: PrivateUploadFile = {
        uid,
        name: file.name,
        url: objectUrl,
        status: "uploading",
        percent: 0,
      };

      // Cập nhật danh sách mới
      const newList = [...filesRef.current, newFile];
      filesRef.current = newList;
      onChange(newList);

      try {
        // 🟢 Thực hiện upload qua prop (hàm này gọi Hook uploadFile)
        const result = await onUploadApi(file, {
          onUploadProgress: (ev: any) => {
            const p = Math.round((ev.loaded * 100) / ev.total);
            const updated = filesRef.current.map((f) =>
              f.uid === uid ? { ...f, percent: p } : f,
            );
            filesRef.current = updated;
            onChange(updated);
          },
        });

        // 🟢 DONE: Gán assetId và finalUrl (link signed) để thoát loading
        const final = filesRef.current.map((f) =>
          f.uid === uid
            ? {
                ...f,
                status: "done" as const,
                assetId: result.assetId,
                finalUrl: result.finalUrl,
                url: result.finalUrl || f.url, 
                percent: 100,
              }
            : f,
        );
        filesRef.current = final;
        onChange(final);
      } catch (error) {
        console.error("Upload tạch:", error);
        const errorList = filesRef.current.map((f) =>
          f.uid === uid ? { ...f, status: "error" as const } : f,
        );
        filesRef.current = errorList;
        onChange(errorList);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-wrap gap-4">
      <AnimatePresence mode="popLayout">
        {value.map((file) => (
          <motion.div
            key={file.uid}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative w-32 h-40 rounded-3xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm group"
          >
            <div className="relative w-full h-full">
              <Image
                src={file.url || file.finalUrl || ""}
                alt="p"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-lg text-white z-20">
                <Lock size={10} />
              </div>
            </div>

            {file.status === "uploading" && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                <span className="text-[10px] font-bold text-white">
                  {file.percent}%
                </span>
                <span className="text-[8px] font-bold text-white uppercase mt-1 text-center">
                  Đang mã hóa
                </span>
              </div>
            )}

            {file.status === "done" && (
              <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full p-0.5 z-30 shadow-lg border border-white">
                <CheckCircle2 size={10} strokeWidth={3} />
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 z-40 transition-opacity">
              <button
                type="button"
                onClick={() => setPreviewFile(file)}
                className="p-1.5 bg-white rounded-lg active:scale-90 shadow-md"
              >
                <Eye size={14} />
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange(value.filter((f) => f.uid !== file.uid))
                }
                className="p-1.5 bg-white rounded-lg text-red-500 active:scale-90 shadow-md"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {value.length < maxCount && (
          <motion.label
            layout
            className="w-32 h-40 border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 rounded-3xl group transition-all"
          >
            <input
              type="file"
              className="hidden"
              accept={allowedTypes.join(",")}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <CloudUpload
              className="text-gray-300 group-hover:text-orange-500 transition-colors"
              size={24}
            />
            <span className="mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Tải lên
            </span>
          </motion.label>
        )}
      </AnimatePresence>
      {previewFile && (
        <PreviewPortal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

const PreviewPortal = ({
  file,
  onClose,
}: {
  file: PrivateUploadFile;
  onClose: () => void;
}) => {
  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={file.finalUrl || file.url || ""}
          alt="p"
          fill
          className="object-contain unoptimized"
        />
      </div>
    </div>,
    document.body,
  );
};
