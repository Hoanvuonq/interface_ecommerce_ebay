"use client";

import React from "react";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from "lucide-react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  duration?: number;
  description?: string;
}

// Cấu hình giao diện cho từng loại Toast
const toastConfig = {
  success: {
    icon: CheckCircle2,
    bg: "bg-white",
    border: "border-green-200",
    text: "text-gray-800",
    iconColor: "text-green-500",
    accent: "bg-green-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-white",
    border: "border-red-200",
    text: "text-gray-800",
    iconColor: "text-red-500",
    accent: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-white",
    border: "border-orange-200",
    text: "text-gray-800",
    iconColor: "text-orange-500",
    accent: "bg-orange-500",
  },
  info: {
    icon: Info,
    bg: "bg-white",
    border: "border-blue-200",
    text: "text-gray-800",
    iconColor: "text-blue-500",
    accent: "bg-blue-500",
  },
};

export const useToast = () => {
  const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
    // Dismiss các toast cũ nếu muốn (tùy chọn, bỏ dòng này nếu muốn hiện nhiều toast)
    // toast.dismiss(); 

    const Config = toastConfig[type];
    const Icon = Config.icon;

    toast.custom(
      (t) => (
        <div
          className={cn(
            "relative flex w-full max-w-[350px] items-start gap-4 rounded-2xl border p-4 shadow-xl shadow-gray-200/50 transition-all duration-300",
            Config.bg,
            Config.border,
            // Hiệu ứng khi xuất hiện/biến mất do Sonner quản lý, nhưng ta thêm class này để chắc chắn
            "animate-in slide-in-from-top-2 fade-in duration-300" 
          )}
        >
          {/* Thanh màu bên trái tạo điểm nhấn */}
          <div className={cn("absolute left-0 top-4 h-8 w-1 rounded-r-full", Config.accent)} />

          {/* Icon */}
          <div className={cn("mt-0.5 shrink-0", Config.iconColor)}>
            <Icon size={20} strokeWidth={2.5} />
          </div>

          {/* Nội dung */}
          <div className="flex-1 pt-0.5">
            <h3 className={cn("text-sm font-bold leading-none", Config.text)}>
              {message}
            </h3>
            {options?.description && (
              <p className="mt-1 text-xs text-gray-500 font-medium">
                {options.description}
              </p>
            )}
          </div>

          {/* Nút đóng */}
          <button
            onClick={() => toast.dismiss(t)}
            className="group -mr-2 -mt-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ),
      { 
        duration: options?.duration || 3000,
        position: 'top-right' // Hoặc 'top-center' tùy bạn
      }
    );
  };

  return {
    success: (msg: string, opts?: ToastOptions) => showToast(msg, "success", opts),
    error: (msg: string, opts?: ToastOptions) => showToast(msg, "error", opts),
    warning: (msg: string, opts?: ToastOptions) => showToast(msg, "warning", opts),
    info: (msg: string, opts?: ToastOptions) => showToast(msg, "info", opts),
  };
};