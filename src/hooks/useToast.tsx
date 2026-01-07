"use client";

import { toastConfig, ToastOptions, ToastType } from "@/types/toast";
import { cn } from "@/utils/cn";
import {
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const ToastComponent = ({ t, message, options, config }: any) => {
  const Icon = config.icon;
  const duration = options?.duration || 4000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsedTime / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div
      className={cn(
        "relative flex w-[calc(100vw-32px)] sm:w-85 flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-500",
        config.bg,
        config.border,
        "animate-in zoom-in-95 slide-in-from-top-2 sm:slide-in-from-right-5"
      )}
    >
      <div className="flex items-center gap-2.5 p-3 sm:p-3.5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            config.lightBg
          )}
        >
          <Icon size={18} className={config.iconColor} strokeWidth={2.5} />
        </div>

        <div className="flex-1 overflow-hidden">
          <h3
            className={cn(
              "text-[13px] sm:text-[14px] font-bold tracking-tight leading-tight truncate",
              config.text
            )}>
            {message}
          </h3>
        </div>

        <div className="flex items-center self-center shrink-0">
          <button
            onClick={() => toast.dismiss(t)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-all active:scale-90"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {options?.description && (
        <div className="bg-gray-50/50 px-3.5 py-2 border-t border-gray-100/50">
          <p className="text-[11px] sm:text-[12px] text-gray-500 font-medium leading-relaxed">
            {options.description}
          </p>
        </div>
      )}

      <div className="h-0.5 w-full bg-gray-100/30">
        <div
          className={cn("h-full transition-none", config.accent)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType,
    options?: ToastOptions
  ) => {
    const config = toastConfig[type];
    toast.dismiss();
    toast.custom(
      (t) => (
        <ToastComponent 
          t={t} 
          message={message} 
          options={options} 
          config={config} 
        />
      ),
      { duration: options?.duration || 3000 }
    );
  };

  return {
    success: (msg: string, opts?: ToastOptions) =>
      showToast(msg, "success", opts),
    error: (msg: string, opts?: ToastOptions) => showToast(msg, "error", opts),
    warning: (msg: string, opts?: ToastOptions) =>
      showToast(msg, "warning", opts),
    info: (msg: string, opts?: ToastOptions) => showToast(msg, "info", opts),
  };
};
