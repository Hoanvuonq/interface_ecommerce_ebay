import { ReviewResponse } from "@/types/reviews/review.types";

export type UploadFileStatus = "error" | "done" | "uploading" | "removed";

export interface UploadFile<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File;
  response?: T;
  error?: any;
  type?: string;

  processing?: boolean;
  assetId?: string;
}

export interface ReviewModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  orderId: string;
  existingReview?: ReviewResponse | null;
}
