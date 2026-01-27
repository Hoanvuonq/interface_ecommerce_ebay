/**
 * Storage Service
 * 
 * Quản lý tất cả các API calls liên quan đến Storage:
 * - Presigned upload (upload trực tiếp lên S3/R2)
 * - Pre-check images/videos (trigger post-processing)
 * - Status check (kiểm tra trạng thái upload)
 * - Delete files
 * - Get public URLs
 * - Multipart upload (legacy, cho backward compatibility)
 */

import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import { UploadContext } from "@/types/storage/storage.types";

const API_ENDPOINT_STORAGE = "v1/storage";

// =========================
// Helper Functions
// =========================

/**
 * Generate UUID for Idempotency-Key header
 * NOTE: crypto.randomUUID() only works on HTTPS or localhost
 * For HTTP connections, we use a fallback UUID v4 generator
 */
const generateIdempotencyKey = (): string => {
  // Check if crypto.randomUUID is available (HTTPS/localhost only)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback below
    }
  }

  // Fallback for HTTP connections - Generate UUID v4 manually
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// =========================
// DTOs
// =========================

export interface PresignUploadRequest {
  context: UploadContext | string;
  extension: string; // "jpg", "png", "mp4", etc. (không có dấu chấm)
  fileSizeBytes: number;
  md5?: string; // MD5 hash (32 hex characters)
  isPrivate?: boolean; // true = upload to private bucket
}

export interface PresignedUploadResponse {
  url: string; // Presigned URL để upload
  id?: string | number;
  method: string; // "PUT"
  headers: Record<string, string>; // Headers cần gửi kèm (Content-MD5, Content-Type, etc.)
  expiresAtEpochSeconds: number; // Timestamp khi URL hết hạn
  path: string; // Path của file (không có prefix "pending/")
  assetId: string; // Snowflake ID của MediaAsset - dùng để query status
}

export interface PreCheckImagesRequest {
  assetIds: string[]; // Array of asset IDs từ presign upload
}

export interface PreCheckVideosRequest {
  assetIds: string[]; // Array of asset IDs từ presign upload
}

export interface StorageStatusResponse {
  [key: string]: string | { status: string; publicUrl?: string | null; publicPath?: string | null };
}

export interface UploadResult {
  path: string;
  url: string;
}

// =========================
// Storage Service
// =========================

export const storageService = {
  /**
   * Generate presigned URL for direct upload to S3/R2
   * 
   * Flow:
   * 1. Client gọi API này để lấy presigned URL
   * 2. Client upload file trực tiếp lên presigned URL (không qua backend)
   * 3. Client gọi preCheckImages/preCheckVideos để trigger post-processing
   * 
   * @example
   * const { url, headers, assetId } = await storageService.presignUpload({
   *   context: UploadContext.PRODUCT_IMAGE,
   *   extension: "jpg",
   *   fileSizeBytes: 1024000,
   *   md5: "abc123..."
   * });
   * 
   * // Upload file lên S3
   * await fetch(url, {
   *   method: "PUT",
   *   headers: headers,
   *   body: file
   * });
   * 
   * // Trigger post-processing
   * await storageService.preCheckImages({ assetIds: [assetId] });
   */
  /**
   * Generate presigned URL for PUBLIC bucket upload.
   * Use for: logos, banners, product images, avatars, etc.
   */
  presignUpload(payload: Omit<PresignUploadRequest, 'isPrivate'>) {
    return request<ApiResponse<PresignedUploadResponse>>({
      method: "POST",
      url: `/${API_ENDPOINT_STORAGE}/presign-upload`,
      data: payload,
      headers: {
        'Idempotency-Key': generateIdempotencyKey(),
      },
    });
  },

  /**
   * Generate presigned URL for PRIVATE bucket upload.
   * Use for: CMND/CCCD images, sensitive documents, personal identification.
   * Files uploaded here require signed URLs to access.
   */
  presignUploadPrivate(payload: Omit<PresignUploadRequest, 'isPrivate'>) {
    return request<ApiResponse<PresignedUploadResponse>>({
      method: "POST",
      url: `/${API_ENDPOINT_STORAGE}/presign-upload-private`,
      data: payload,
      headers: {
        'Idempotency-Key': generateIdempotencyKey(),
      },
    });
  },

  /**
   * Trigger image post-processing (resize, transcode, generate variants)
   * 
   * Flow:
   * 1. Client đã upload file lên S3 qua presigned URL
   * 2. Client gọi API này để trigger async processing
   * 3. Backend sẽ validate, resize, và generate variants (_thumb, _medium, _large)
   * 4. Client có thể query status để check khi nào processing xong
   * 
   * @returns 202 Accepted - Processing started async
   */
  preCheckImages(payload: PreCheckImagesRequest) {
    return request<ApiResponse<void>>({
      method: "POST",
      url: `/${API_ENDPOINT_STORAGE}/pre-check-images`,
      data: payload,
    });
  },

  /**
   * Trigger video post-processing
   * 
   * Similar to preCheckImages but for videos
   */
  preCheckVideos(payload: PreCheckVideosRequest) {
    return request<ApiResponse<void>>({
      method: "POST",
      url: `/${API_ENDPOINT_STORAGE}/pre-check-videos`,
      data: payload,
    });
  },

  /**
   * Confirm private upload completion.
   * Mark assets as UPLOADED without image processing (no _orig, _thumb variants).
   * Use this after successfully uploading to private bucket.
   */
  confirmPrivateUpload(payload: PreCheckImagesRequest) {
    return request<ApiResponse<void>>({
      method: "POST",
      url: `/${API_ENDPOINT_STORAGE}/confirm-private-upload`,
      data: payload,
    });
  },

  /**
   * Get presigned URL for viewing a private file.
   * Private files (CMND/CCCD, sensitive documents) cannot be accessed directly.
   * This returns a short-lived signed URL (default 5 minutes).
   * 
   * @param assetId - The asset ID to get URL for
   * @param expirySeconds - URL expiry time (default: 300 = 5 minutes)
   */
  getPrivateUrl(assetId: string, expirySeconds: number = 300) {
    return request<ApiResponse<{ url: string }>>({
      method: "GET",
      url: `/${API_ENDPOINT_STORAGE}/private-url/${assetId}`,
      params: { expirySeconds },
    });
  },

  /**
   * Check upload/processing status
   * 
   * Có thể query bằng:
   * - assetIds: Array of asset IDs từ presign upload
   * - paths: Array of file paths
   * 
   * @returns Map of assetId/path -> status ("PENDING", "READY", "FAILED", "NOT_FOUND")
   * 
   * @example
   * const status = await storageService.getStatus({
   *   assetIds: ["123", "456"]
   * });
   * // { "123": "READY", "456": "PENDING" }
   */
  getStatus(params: {
    assetIds?: string[];
    paths?: string[];
  }) {
    return request<ApiResponse<StorageStatusResponse>>({
      method: "GET",
      url: `/${API_ENDPOINT_STORAGE}/status`,
      params,
    });
  },

  /**
   * Delete a file from storage
   * 
   * @param path - File path (sẽ được URL encode)
   */
  deleteFile(path: string) {
    const encodedPath = encodeURIComponent(path);
    return request<ApiResponse<void>>({
      method: "DELETE",
      url: `/${API_ENDPOINT_STORAGE}/file/${encodedPath}`,
    });
  },

  /**
   * Get public URL for a file
   * 
   * @param path - File path (sẽ được URL encode)
   * @returns Redirect (302) to public URL
   */
  getPublicUrl(path: string) {
    const encodedPath = encodeURIComponent(path);
    return request<void>({
      method: "GET",
      url: `/${API_ENDPOINT_STORAGE}/url/${encodedPath}`,
    });
  },

  /**
   * Legacy multipart upload (for backward compatibility)
   * 
   * ⚠️ DEPRECATED: Nên dùng presignUpload + direct S3 upload thay vì method này
   * Method này upload qua backend → chậm hơn và tốn bandwidth của backend
   * 
   * @param file - File to upload
   * @param uploadPath - Optional path prefix
   */
  uploadMultipart(file: File, uploadPath?: string): Promise<ApiResponse<UploadResult>> {
    const formData = new FormData();
    formData.append("file", file);
    if (uploadPath) {
      formData.append("path", uploadPath);
    }

    return request<ApiResponse<UploadResult>>({
      method: "POST",
      url: `/${API_ENDPOINT_STORAGE}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

