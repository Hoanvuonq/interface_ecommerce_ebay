"use client";
import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster 
      position="top-right" 
      expand={true} 
      visibleToasts={2}
      toastOptions={{
        style: { 
          zIndex: 99999,
          background: 'transparent', 
          border: 'none',
          boxShadow: 'none'
        },
      }}
      offset="24px" 
    />
  );
};