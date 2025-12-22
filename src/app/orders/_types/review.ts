import { ReviewResponse } from "@/types/reviews/review.types";

export interface UploadFile {
  uid: string;
  name: string;
  status?: "uploading" | "done" | "error";
  url?: string;
  thumbUrl?: string; // Blob URL for preview
  originFileObj?: File;
  type?: string;
}

export interface ReviewModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  productId: string;
  productName: string;
  orderId: string;
  existingReview?: ReviewResponse | null;
}