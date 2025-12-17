"use client";
import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "bg-slate-800/20 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-xl",
          success: "bg-green-900/20 border-green-500/50 text-green-100",
          error: "bg-red-900/20 border-red-500/50 text-red-100",
          warning: "bg-amber-900/20 border-amber-500/50 text-amber-100",
          title: "font-semibold text-lg",
          description: "text-gray-300",
          icon: "text-md",
        },
      }}
    />
  );
};
