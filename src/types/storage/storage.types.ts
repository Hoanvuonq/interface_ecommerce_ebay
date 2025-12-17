
export enum UploadContext {
  PRODUCT_IMAGE = "PRODUCT_IMAGE",
  PRODUCT_THUMBNAIL = "PRODUCT_THUMBNAIL",
  PRODUCT_VIDEO = "PRODUCT_VIDEO",
  USER_AVATAR = "USER_AVATAR",
  USER_COVER = "USER_COVER",
  SHOP_LOGO = "SHOP_LOGO",
  SHOP_BANNER = "SHOP_BANNER",
  SHOP_VIDEO = "SHOP_VIDEO",
  EMPLOYEE_AVATAR = "EMPLOYEE_AVATAR",
  CATEGORY_IMAGE = "CATEGORY_IMAGE",
  REVIEW_IMAGE = "REVIEW_IMAGE",
  REVIEW_VIDEO = "REVIEW_VIDEO",
  DOCUMENT = "DOCUMENT",
  BANNER = "BANNER",
  VOUCHER_IMAGE = "VOUCHER_IMAGE",
  WISHLIST_COVER = "WISHLIST_COVER",
  CHAT_IMAGE = "CHAT_IMAGE",
  CHAT_VIDEO = "CHAT_VIDEO",
  CHAT_FILE = "CHAT_FILE",
}

export type UploadStatus = "PRESIGNED" | "PENDING" | "READY" | "FAILED" | "NOT_FOUND";

export interface MediaAsset {
  id: string; // Snowflake ID
  context: string;
  entityId?: string;
  basePath: string; // "public/products/2025/01/uuid"
  extension: string; // ".jpg", ".mp4"
  originalPath?: string; // pending path
  mimeType?: string;
  sizeBytes?: number;
  declaredSizeBytes?: number;
  status: UploadStatus;
}

