"use client";
import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster 
      position="top-right" // Vị trí xuất hiện: top-center, top-right, bottom-right...
      expand={true} // Cho phép mở rộng nhiều toast
      richColors // Tự động dùng màu đẹp nếu dùng toast mặc định
      closeButton // Hiện nút đóng
      toastOptions={{
        style: { zIndex: 99999 },
        className: 'my-toast-class',
      }}
      offset="24px" 
    />
  );
};
