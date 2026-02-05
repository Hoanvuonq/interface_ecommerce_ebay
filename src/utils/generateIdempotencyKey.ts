// src/utils/generateIdempotencyKey.ts

export const generateIdempotencyKey = (): string => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    try {
      return window.crypto.randomUUID();
    } catch (e) {
      // Fallback nếu có lỗi thực thi
    }
  }
  // Fallback chuẩn cho môi trường cũ hoặc không có HTTPS
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};