import { ReviewResponse } from "@/types/reviews/review.types";

export interface UploadFile {
  uid: string;
  name: string;
  status?: "uploading" | "done" | "error";
  url?: string;
  thumbUrl?: string;
  originFileObj?: File;
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