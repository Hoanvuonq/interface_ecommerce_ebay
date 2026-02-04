"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

export interface CustomFile {
  uid: string;
  name: string;
  url?: string;
  originFileObj?: File;
}

interface ImageUploadFieldProps {
  value?: CustomFile[];
  onChange?: (value: CustomFile[]) => void;
  maxCount?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value = [],
  onChange,
  maxCount = 1,
  allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  maxSizeMB = 5,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: toastError, warning: toastWarning } = useToast();

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: CustomFile[] = [];
    const currentCount = value.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 1. Validate số lượng
      if (currentCount + i >= maxCount) {
        toastWarning(`Chỉ được phép tải lên tối đa ${maxCount} ảnh.`);
        break;
      }

      // 2. Validate loại file
      if (!allowedTypes.includes(file.type)) {
        toastError(
          `File ${
            file.name
          } không hợp lệ! Định dạng cho phép: ${allowedTypes.join(", ")}`,
        );
        continue;
      }

      // 3. Validate dung lượng
      if (file.size / 1024 / 1024 > maxSizeMB) {
        toastError(`File ${file.name} quá lớn! Tối đa ${maxSizeMB}MB.`);
        continue;
      }

      // 4. Tạo preview
      const base64 = await getBase64(file);

      newFiles.push({
        uid: URL.createObjectURL(file), // Tạo ID tạm
        name: file.name,
        url: base64,
        originFileObj: file,
      });
    }

    if (newFiles.length > 0) {
      onChange?.([...value, ...newFiles]);
    }

    // Reset input để cho phép chọn lại file cũ nếu muốn
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xóa ảnh
  const handleRemove = (uid: string) => {
    const newFileList = value.filter((item) => item.uid !== uid);
    onChange?.(newFileList);
  };

  // Xem preview
  const handlePreview = (url?: string) => {
    if (url) setPreviewImage(url);
  };

  // Đóng preview
  const closePreview = () => setPreviewImage(null);

  return (
    <div className="flex flex-wrap gap-4">
      {/* Danh sách ảnh đã chọn */}
      {value.map((file) => (
        <div
          key={file.uid}
          className="group relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center"
        >
          {/* Ảnh */}
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />

          {/* Overlay Actions (Hiện khi hover) */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePreview(file.url)}
              className="text-white hover:text-blue-400 transition-colors p-1"
              title="Xem trước"
            >
              <FaEye />
            </button>
            <button
              type="button"
              onClick={() => handleRemove(file.uid)}
              className="text-white hover:text-red-400 transition-colors p-1"
              title="Xóa"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {value.length < maxCount && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-500 bg-gray-50 hover:bg-orange-50 ",
            "cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-orange-500 transition-all duration-200",
          )}
        >
          <FaPlus className="text-xl mb-1" />
          <span className="text-xs font-medium">Upload</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(",")}
            multiple={maxCount > 1}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={closePreview}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-500 text-2xl transition-colors"
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
