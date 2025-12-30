/**
 * Admin Review Management DTOs
 * Based on REVIEW_API_DOCUMENTATION.md
 */

// ==================== ENUMS ====================

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
}

export enum ReviewType {
  PRODUCT = "PRODUCT",
  SHOP = "SHOP",
  ORDER = "ORDER",
}

// ==================== REQUEST DTOs ====================

/**
 * Moderate Review Request
 * PUT /api/v1/admin/reviews/{reviewId}/moderate
 */
export interface ModerateReviewRequest {
  status: ReviewStatus.APPROVED | ReviewStatus.REJECTED | ReviewStatus.FLAGGED;
  rejectionReason?: string; // Required if status = REJECTED
}

/**
 * Get Reviews Request (for filtering)
 */
export interface GetReviewsAdminRequest {
  page?: number; // 0-based
  size?: number; // Default: 20
  sort?: string; // e.g. "createdDate,desc"
}

// ==================== RESPONSE DTOs ====================

/**
 * Review Response
 * Full review information
 */
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

  // Audit
  createdDate: string; // ISO 8601
  lastModifiedDate: string;
  version: number;
}

/**
 * Paginated Review List Response
 */
export interface ReviewListResponse {
  content: ReviewResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Admin Review Statistics
 */
export interface AdminReviewStatistics {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  flaggedReviews: number;
}
