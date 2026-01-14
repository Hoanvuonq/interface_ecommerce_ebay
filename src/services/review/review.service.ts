
import { request } from "@/utils/axios.customize";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewResponse,
  ReviewListResponse,
  ReviewStatisticsResponse,
  ReviewType,
} from "@/app/(shop)/shop/reviews/_types/review.types";

const BASE_URL = "/v1/reviews";


export const createReview = async (
  reviewRequest: CreateReviewRequest
): Promise<ReviewResponse> => {
  const response = await request<{
    success: boolean;
    code: number;
    message: string;
    data: ReviewResponse;
  }>({
    method: "POST",
    url: BASE_URL,
    data: reviewRequest,
  });

  return response.data;
};


export const updateReview = async (
  reviewId: string,
  reviewRequest: UpdateReviewRequest
): Promise<ReviewResponse> => {
  const response = await request<{
    success: boolean;
    code: number;
    message: string;
    data: ReviewResponse;
  }>({
    method: "PUT",
    url: `${BASE_URL}/${reviewId}`,
    data: reviewRequest,
  });

  return response.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await request<{
    success: boolean;
    code: number;
    message: string;
  }>({
    method: "DELETE",
    url: `${BASE_URL}/${reviewId}`,
  });
};


export const getReviews = async (
  reviewType: ReviewType,
  reviewableId: string,
  page: number = 0,
  size: number = 20,
  sort: string = "createdDate,desc"
): Promise<ReviewListResponse> => {
  const response = await request<{
    success: boolean;
    code: number;
    message: string;
    data: ReviewListResponse;
  }>({
    method: "GET",
    url: `${BASE_URL}/${reviewType}/${reviewableId}`,
    params: { page, size, sort },
  });

  return response.data;
};

/**
 * Get review statistics
 * GET /api/v1/reviews/{reviewType}/{reviewableId}/statistics
 */
export const getReviewStatistics = async (
  reviewType: ReviewType,
  reviewableId: string
): Promise<ReviewStatisticsResponse> => {
  const response = await request<{
    success: boolean;
    code: number;
    message: string;
    data: ReviewStatisticsResponse;
  }>({
    method: "GET",
    url: `${BASE_URL}/${reviewType}/${reviewableId}/statistics`,
  });

  return response.data;
};

/**
 * Get product review comments with optional media filters
 * GET /api/v1/reviews/products/{productId}/comments
 */
// export const getProductReviewComments = async (
//   productId: string,
//   params: {
//     page?: number;
//     size?: number;
//     withMedia?: boolean;
//     mediaType?: "IMAGE" | "VIDEO";
//   } = {}
// ): Promise<ReviewListResponse> => {
//   const { page = 0, size = 5, withMedia, mediaType } = params;

//   const response = await request<{
//     success: boolean;
//     code: number;
//     message: string;
//     data: ReviewListResponse;
//   }>({
//     method: "GET",
//     url: `/v1/reviews/products/${productId}`,
//     params: {
//       page,
//       size,
//       withMedia,
//       mediaType,
//     },
//   });

//   return response.data;
// };


export const getProductReviewComments = async (
  productId: string,
  params: {
    page?: number;
    size?: number;
    sort?: string;
  } = {}
): Promise<ReviewListResponse> => {
  const { page = 0, size = 5, sort = "createdDate,desc" } = params;

  const response = await request<{
    success: boolean;
    code: number;
    message: string;
    data: ReviewListResponse;
  }>({
    method: "GET",
    url: `/v1/reviews/PRODUCT/${productId}`, 
    params: {
      page,
      size,
      sort,
    },
  });

  return response.data;
};

/**
 * Get current user's reviews
 * GET /api/v1/reviews/my-reviews
 */
export const getMyReviews = async (
  page: number = 0,
  size: number = 20
): Promise<ReviewListResponse> => {
  const response = await request<{
    success: boolean;
    code: number;
    message: string;
    data: ReviewListResponse;
  }>({
    method: "GET",
    url: `${BASE_URL}/my-reviews`,
    params: { page, size },
  });

  return response.data;
};

/**
 * Mark review as helpful
 * POST /api/v1/reviews/{reviewId}/helpful
 */
export const markReviewHelpful = async (reviewId: string): Promise<void> => {
  await request<{
    success: boolean;
    code: number;
    message: string;
  }>({
    method: "POST",
    url: `${BASE_URL}/${reviewId}/helpful`,
  });
};

/**
 * Mark review as not helpful
 * POST /api/v1/reviews/{reviewId}/not-helpful
 */
export const markReviewNotHelpful = async (reviewId: string): Promise<void> => {
  await request<{
    success: boolean;
    code: number;
    message: string;
  }>({
    method: "POST",
    url: `${BASE_URL}/${reviewId}/not-helpful`,
  });
};

