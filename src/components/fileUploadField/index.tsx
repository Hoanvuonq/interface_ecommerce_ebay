"use client";

import React, { useState, useRef } from "react";
import { 
  CloudUpload, 
  FileText, 
  X, 
  Eye, 
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from "lucide-react";
import _ from "lodash";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";

interface CustomFile extends File {
  preview?: string;
  id: string;
}

interface FileUploadFieldProps {
  value?: any[]; 
  onChange?: (files: any[]) => void;
  maxCount?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  description?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value = [],
  onChange,
  maxCount = 1,
  allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"],
  maxSizeMB = 10,
  description = "Hỗ trợ PDF hoặc hình ảnh (PNG, JPG, JPEG)",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: toastError } = useToast();

  // Helper chuyển đổi sang base64 cho preview
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toastError(`File ${file.name} không hợp lệ. ${description}`);
      return false;
    }
    if (file.size / 1024 / 1024 > maxSizeMB) {
      toastError(`File ${file.name} vượt quá ${maxSizeMB}MB!`);
      return false;
    }
    return true;
  };

  const handleFiles = async (newFiles: FileList | File[]) => {
    const validFiles = _.filter(Array.from(newFiles), validateFile);
    
    const limitedFiles = _.take(validFiles, maxCount - value.length);

    const processedFiles = await Promise.all(
      limitedFiles.map(async (file) => {
        const preview = file.type.startsWith("image/") ? await getBase64(file) : undefined;
        return {
          id: _.uniqueId("file_"),
          originFileObj: file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview,
        };
      })
    );

    onChange?.([...value, ...processedFiles]);
  };

  const removeFile = (id: string) => {
    onChange?.(_.filter(value, (f) => f.id !== id));
  };

  return (
    <div className="space-y-4 w-full">
      {value.length < maxCount && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative cursor-pointer group flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2rem] transition-all duration-300",
            isDragging 
              ? "border-orange-500 bg-orange-50/50" 
              : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple={maxCount > 1}
            accept={allowedTypes.join(",")}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <div className={cn(
            "p-4 rounded-2xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
            isDragging ? "bg-orange-500 text-white" : "bg-white text-slate-400 shadow-sm"
          )}>
            <CloudUpload size={32} />
          </div>

          <div className="text-center">
            <p className="text-sm font-black text-slate-700 uppercase tracking-tighter italic">
              Nhấp hoặc kéo file vào đây
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {description} • Tối đa {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      
      <div className="grid grid-cols-1 gap-3">
        {value.map((file) => (
          <div 
            key={file.id} 
            className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              {file.preview ? (
                <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FileText className="text-blue-500" size={20} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                {(file.size / 1024).toFixed(0)} KB • {file.type?.split("/")[1]}
              </p>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {file.preview && (
                <button 
                  type="button"
                  onClick={() => window.open(file.preview, "_blank")}
                  className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                >
                  <Eye size={16} />
                </button>
              )}
              <button 
                type="button"
                onClick={() => removeFile(file.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};