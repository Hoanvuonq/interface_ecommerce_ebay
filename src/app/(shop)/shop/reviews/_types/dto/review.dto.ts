/**
 * Review DTOs for Shop Feature
 */


// Request DTOs
export interface GetReviewsParams {
  page?: number; // 0-based
  size?: number; // default: 20
  sort?: string; // e.g. "createdDate,desc", "rating,desc"
}

export interface CreateReviewResponseRequest {
  response: string; // max 1000 chars
}

// Query params for getting reviews by shop products
export interface GetShopProductReviewsParams extends GetReviewsParams {
  shopId?: string;
  productId?: string;
  rating?: number; // Filter by rating (1-5)
  verifiedPurchase?: boolean; // Filter by verified purchase
  hasResponse?: boolean; // Filter by response status
}
