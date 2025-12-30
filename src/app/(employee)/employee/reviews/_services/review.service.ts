/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/types/api.types";
import {
  ReviewListResponse,
  ModerateReviewRequest,
  GetReviewsAdminRequest,
} from "../dto/review.dto";

const API_ENDPOINT_ADMIN_REVIEWS = "v1/admin/reviews";

/**
 * Get Pending Reviews
 * GET /api/v1/admin/reviews/pending
 */
export async function getPendingReviews(
  params?: GetReviewsAdminRequest
): Promise<ApiResponse<ReviewListResponse>> {
  return request<ApiResponse<ReviewListResponse>>({
    url: `/${API_ENDPOINT_ADMIN_REVIEWS}/pending`,
    method: "GET",
    params,
  });
}

/**
 * Get Flagged Reviews
 * GET /api/v1/admin/reviews/flagged
 */
export async function getFlaggedReviews(
  params?: GetReviewsAdminRequest
): Promise<ApiResponse<ReviewListResponse>> {
  return request<ApiResponse<ReviewListResponse>>({
    url: `/${API_ENDPOINT_ADMIN_REVIEWS}/flagged`,
    method: "GET",
    params,
  });
}

/**
 * Moderate Review (Approve/Reject/Flag)
 * PUT /api/v1/admin/reviews/{reviewId}/moderate
 */
export async function moderateReview(
  reviewId: string,
  payload: ModerateReviewRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ADMIN_REVIEWS}/${reviewId}/moderate`,
    method: "PUT",
    data: payload,
  });
}
