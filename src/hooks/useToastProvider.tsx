"use client";
import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "bg-black/50 backdrop-blur-md border border-[#00D084]/50 text-white font-kode-mono shadow-lg",
          title: "text-white",
          description: "text-white/80",
        },
      }}
    />
  );
};