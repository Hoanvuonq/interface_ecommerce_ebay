"use client";

import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { CloudUpload, Eye, FileText, X, Plus, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";

export interface CustomFile {
  id: string;
  originFileObj?: File;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

interface FiedFileUploadProps {
  value?: CustomFile[];
  onChange?: (files: CustomFile[]) => void;
  maxCount?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  description?: string;
  variant?: "list" | "grid";
}

export const FiedFileUpload: React.FC<FiedFileUploadProps> = ({
  value = [],
  onChange,
  maxCount = 1,
  allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"],
  maxSizeMB = 10,
  description = "Hỗ trợ hình ảnh hoặc PDF",
  variant = "list",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: toastError } = useToast();

  // Dọn dẹp bộ nhớ Blob URL
  useEffect(() => {
    return () => {
      value.forEach((file) => {
        if (file.preview?.startsWith("blob:")) URL.revokeObjectURL(file.preview);
      });
    };
  }, [value]);

  const validateFile = useCallback((file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toastError(`File ${file.name} không hợp lệ. Định dạng cho phép: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size / 1024 / 1024 > maxSizeMB) {
      toastError(`File ${file.name} vượt quá ${maxSizeMB}MB!`);
      return false;
    }
    return true;
  }, [allowedTypes, maxSizeMB, toastError]);

  const handleFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray
      .filter(validateFile)
      .slice(0, maxCount - value.length);

    const processedFiles: CustomFile[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      originFileObj: file,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    if (processedFiles.length > 0) {
      onChange?.([...value, ...processedFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    const fileToRemove = value.find((f) => f.id === id);
    if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
    onChange?.(value.filter((f) => f.id !== id));
  };

  // --- RENDERING LOGIC ---

  // Giao diện ô vuông (Grid) cho Hình ảnh
  const renderGridView = () => (
    <div className="flex flex-wrap gap-4">
      {value.map((file) => (
        <div key={file.id} className="group relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
          {file.preview ? (
            <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
          ) : (
            <FileText className="text-blue-500" size={24} />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => window.open(file.preview, "_blank")} className="text-white hover:text-blue-400 p-1">
              <Eye size={18} />
            </button>
            <button type="button" onClick={() => removeFile(file.id)} className="text-white hover:text-red-400 p-1">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      {value.length < maxCount && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 bg-gray-50 hover:bg-orange-50 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-orange-500 transition-all"
        >
          <Plus size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Tải lên</span>
        </div>
      )}
    </div>
  );

  // Giao diện danh sách (List) cho Tài liệu
  const renderListView = () => (
    <div className="space-y-4">
      {value.length < maxCount && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-4xl transition-all",
            isDragging ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-gray-50 hover:bg-white hover:border-orange-300 shadow-sm"
          )}
        >
          <CloudUpload className={cn("mb-2 transition-colors", isDragging ? "text-orange-500" : "text-gray-400")} size={32} />
          <p className="text-xs font-bold text-gray-700 uppercase italic">Kéo thả hoặc nhấp để tải file</p>
          <p className="text-[10px] text-gray-500 uppercase mt-1">{description}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {value.map((file) => (
          <div key={file.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl group hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
              {file.preview ? <img src={file.preview} className="w-full h-full object-cover" /> : <FileText className="text-blue-500" size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700 truncate">{file.name}</p>
              <p className="text-[9px] text-gray-500 uppercase">{(file.size / 1024).toFixed(0)} KB • {file.type.split("/")[1]}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => window.open(file.preview, "_blank")} className="p-1.5 text-gray-400 hover:text-orange-500"><Eye size={16} /></button>
              <button type="button" onClick={() => removeFile(file.id)} className="p-1.5 text-gray-400 hover:text-red-500"><X size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <input type="file" ref={fileInputRef} className="hidden" multiple={maxCount > 1} accept={allowedTypes.join(",")} onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      {variant === "grid" ? renderGridView() : renderListView()}
    </div>
  );
};