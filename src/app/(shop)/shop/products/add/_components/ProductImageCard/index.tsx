/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Trash2,
  Star,
  Plus,
  Loader2,
  Grid3X3,
  ImageIcon as LucideImageIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PortalModal } from "@/features/PortalModal";
import { toPublicUrl } from "@/utils/storage/url";
import { ImageLibraryModal } from "../ImageLibraryModal";

interface CustomFile {
  uid: string;
  url: string;
  imagePath: string;
  name: string;
  status?: "uploading" | "done" | "error";
  processing?: boolean;
}

interface ProductImageCardProps {
  fileList: CustomFile[];
  setFileList: (
    files: CustomFile[] | ((prev: CustomFile[]) => CustomFile[]),
  ) => void;
  onUpload: (files: FileList) => Promise<void>;
  onRemove: (uid: string) => void;
  onPreview: (file: CustomFile) => void;
}

export const ProductImageCard: React.FC<ProductImageCardProps> = ({
  fileList,
  setFileList,
  onUpload,
  onRemove,
  onPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showListPreview, setShowListPreview] = useState(false);

  const setMainImage = (index: number) => {
    if (index === 0) return;
    const newFileList = [...fileList];
    const [movedFile] = newFileList.splice(index, 1);
    newFileList.unshift(movedFile);
    setFileList(newFileList);
  };

  const getDisplayUrl = (file: CustomFile) => {
    const rawPath = file.imagePath || file.url;
    if (!rawPath) return "";

    return toPublicUrl(rawPath.replace("*", "orig"));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const validFiles = selectedFiles.filter((file) => {
        const fileName = file.name.toLowerCase();
        const extension = fileName.split(".").pop();
        return (
          extension &&
          allowedExtensions.includes(extension) &&
          !fileName.endsWith(".webp")
        );
      });

      if (validFiles.length < selectedFiles.length) {
        alert("Hệ thống chỉ chấp nhận định dạng JPG, JPEG hoặc PNG.");
      }

      if (validFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        onUpload(dataTransfer.files);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-sm">
            <LucideImageIcon size={24} />
          </div>
          <div>
            <h5 className="text-lg font-bold text-gray-800 tracking-tight leading-none">
              Hình ảnh sản phẩm <span className="text-red-500">*</span>
            </h5>
            <p className="text-xs text-gray-400 mt-1 font-medium italic">
              Tối đa 9 ảnh • Định dạng JPG, PNG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {fileList.length > 0 && (
            <button
              type="button"
              onClick={() => setShowListPreview(true)}
              className="group flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 transition-all hover:bg-slate-100 active:scale-95"
            >
              <Grid3X3 size={14} className="group-hover:text-blue-500" />
              Tổng quan ({fileList.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {fileList.map((file, index) => (
          <div
            key={file.uid}
            className="relative group aspect-4/5 flex flex-col"
          >
            <div
              className={cn(
                "relative flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-slate-50 shadow-sm",
                index === 0
                  ? "border-orange-500 ring-4 ring-orange-50"
                  : "border-slate-100 group-hover:border-orange-200",
              )}
            >
              <Image
                src={getDisplayUrl(file)}
                alt={file.name || "Product image"}
                fill
                sizes="150px"
                className={cn(
                  "object-cover transition-all duration-700 group-hover:scale-110 cursor-pointer",
                  (file.status === "uploading" || file.processing) &&
                    "opacity-40 blur-sm",
                )}
                onClick={() => onPreview(file)}
                unoptimized={true}
              />

              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2 z-20">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(file.uid);
                    }}
                    className="p-1.5 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainImage(index);
                    }}
                    className="w-full py-1.5 bg-white/20 backdrop-blur-md hover:bg-orange-500 text-[9px] font-bold uppercase text-white rounded-lg transition-colors tracking-tighter"
                  >
                    Làm ảnh bìa
                  </button>
                )}
              </div>

              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-[8px] text-white font-bold rounded-md shadow-sm uppercase tracking-tighter z-10">
                  Bìa
                </div>
              )}

              {(file.status === "uploading" || file.processing) && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/20 backdrop-blur-[2px]">
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                </div>
              )}
            </div>

            <span className="mt-1.5 text-[9px] text-gray-400 truncate px-1 text-center font-medium">
              {file.name}
            </span>
          </div>
        ))}

        {fileList.length < 9 && (
          <label className="aspect-4/5 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-50/30 hover:border-orange-300 transition-all cursor-pointer group">
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 group-hover:bg-white transition-all shadow-sm group-hover:shadow-orange-100">
              <Plus className="text-gray-400 group-hover:text-orange-500 w-5 h-5 transition-colors" />
            </div>
            <span className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-orange-600 transition-colors">
              Thêm ảnh
            </span>
          </label>
        )}
      </div>

      <ImageLibraryModal
        isOpen={showListPreview}
        onClose={() => setShowListPreview(false)}
        fileList={fileList}
        onSetMainImage={setMainImage}
        getDisplayUrl={getDisplayUrl}
      />
    </div>
  );
};
