/**
 * Review Types for Shop Feature
 */

export enum ReviewType {
  PRODUCT = "PRODUCT",
  SHOP = "SHOP",
  ORDER = "ORDER",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
}

/**
 * Create Review Request
 * POST /api/v1/reviews
 */
export interface CreateReviewRequest {
  reviewType: ReviewType;
  reviewableId: string; // Product ID or Shop ID
  rating: number; // 1-5
  comment?: string; // Max 2000 characters
  orderId: string; // Required to verify purchase
  mediaAssetIds?: string[]; // Optional: Media asset IDs (images/videos)
}

/**
 * Update Review Request
 * PUT /api/v1/reviews/{reviewId}
 */
export interface UpdateReviewRequest {
  rating: number; // 1-5
  comment?: string; // Max 2000 characters
}

/**
 * Review Media Response
 */
export interface ReviewMediaResponse {
  id: string;
  basePath?: string; // MediaAsset.basePath
  extension?: string; // from MediaAsset.getExtension()
  url?: string; // Computed URL from MediaAsset
  type: "IMAGE" | "VIDEO";
  title?: string;
  altText?: string;
  sortOrder: number;
  reviewId: string;
  createdDate: string; // ISO 8601
  lastModifiedDate: string;
  version: number;
}

/**
 * Review Response
 * GET /api/v1/reviews/{reviewType}/{reviewableId}
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
  sellerResponseDate?: string; // ISO 8601
  sellerResponseBy?: string; // Shop ID

  // Media assets (images/videos)
  media?: ReviewMediaResponse[];

  // Audit
  createdDate: string; // ISO 8601
  lastModifiedDate: string;
  version: number;
}

/**
 * Review List Response (Paginated)
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
 * Review Statistics Response
 * GET /api/v1/reviews/{reviewType}/{reviewableId}/statistics
 */
export interface ReviewStatisticsResponse {
  reviewableId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  ratingPercentage: Record<number, number>;
  verifiedPurchaseCount: number;
  verifiedPurchasePercentage: number;
  commentCount: number;
  mediaReviewCount: number;
  imageReviewCount: number;
  videoReviewCount: number;
}


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

// export interface ReviewStatisticsResponse2 {
//   reviewableId: string;
//   totalReviews: number;
//   averageRating: number; // e.g. 4.5

//   // Rating distribution
//   ratingDistribution: {
//     1: number;
//     2: number;
//     3: number;
//     4: number;
//     5: number;
//   };

//   // Percentage
//   ratingPercentage: {
//     1: number; // e.g. 2.70
//     2: number;
//     3: number;
//     4: number;
//     5: number;
//   };

//   // Verified purchase
//   verifiedPurchaseCount: number;
//   verifiedPurchasePercentage: number;
// }

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

