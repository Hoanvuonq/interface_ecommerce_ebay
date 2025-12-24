/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";

// ==================== API ENDPOINTS ====================

const API_ENDPOINT_CHAT = "v1/chat";
const API_ENDPOINT_UPLOAD = `${API_ENDPOINT_CHAT}/upload`;

// ==================== FILE UPLOAD SERVICES ====================

/**
 * Upload file tổng quát
 */
export async function uploadFile(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("file", file);

  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_UPLOAD}/file`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Upload ảnh
 */
export async function uploadImage(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("file", file);

  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_UPLOAD}/image`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Upload video
 */
export async function uploadVideo(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("file", file);

  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_UPLOAD}/video`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Upload audio
 */
export async function uploadAudio(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("file", file);

  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_UPLOAD}/audio`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ==================== FILE VALIDATION UTILITIES ====================

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
