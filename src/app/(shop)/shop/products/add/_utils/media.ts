// src/utils/media.ts
export const resolveMediaUrl = (url: string | undefined | null) => {
  if (!url) return "";
  
  // 1. Nếu là ảnh vừa upload (blob:) hoặc đã là URL tuyệt đối (http) thì giữ nguyên
  if (url.startsWith("blob:") || url.startsWith("http")) {
    return url;
  }

  // 2. Nếu là đường dẫn từ Backend (bắt đầu bằng public/ hoặc /public)
  // Giả sử domain API của bro là https://api.calatha.com
  const baseUrl = "https://api.calatha.com";
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  
  return `${baseUrl}${cleanPath}`;
};