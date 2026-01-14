/**
 * Review Types for Shop Feature
 */

export type ReviewType = "PRODUCT" | "SHOP" | "ORDER";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";

export interface ReviewResponse {
  id: string;
  reviewType: ReviewType;
  reviewableId: string;

  // Content
  rating: number; // 1-5
  comment?: string;

  // User info
  userId: string;
  username: string;
  userAvatar?: string;
  buyerId: string;
  buyerName: string;

  // Verification
  verifiedPurchase: boolean;
  orderId?: string;

  // Status
  status: ReviewStatus;
  rejectionReason?: string;

  // Engagement
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulnessScore: number;

  // Seller response
  hasResponse: boolean;
  sellerResponse?: string;
  respondedBy?: string;
  respondedAt?: string;

  // Audit
  createdDate: string; // ISO 8601
  lastModifiedDate: string;
  version: number;
}

export interface ReviewStatisticsResponse {
  reviewableId: string;
  totalReviews: number;
  averageRating: number; // e.g. 4.5

  // Rating distribution
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  // Percentage
  ratingPercentage: {
    1: number; // e.g. 2.70
    2: number;
    3: number;
    4: number;
    5: number;
  };

  // Verified purchase
  verifiedPurchaseCount: number;
  verifiedPurchasePercentage: number;
}

export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type ReviewPageDto = PageDto<ReviewResponse>;
