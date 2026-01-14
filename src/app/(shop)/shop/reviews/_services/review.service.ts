/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/api/_types/api.types";
import { request } from "@/utils/axios.customize";
import {
  GetReviewsParams,
  CreateReviewResponseRequest,
} from "../_types/dto/review.dto";
import {
  ReviewResponse,
  ReviewStatisticsResponse,
  ReviewPageDto,
  ReviewType,
} from "../_types/review.types";

/**
 * Get reviews for a reviewable entity (product, shop, order)
 * GET /api/v1/reviews/{reviewType}/{reviewableId}
 */
export async function getReviews(
  reviewType: ReviewType,
  reviewableId: string,
  params?: GetReviewsParams
): Promise<ApiResponse<ReviewPageDto>> {
  return request<ApiResponse<ReviewPageDto>>({
    url: `/v1/reviews/${reviewType}/${reviewableId}`,
    method: "GET",
    params,
  });
}

/**
 * Get review statistics for a reviewable entity
 * GET /api/v1/reviews/{reviewType}/{reviewableId}/statistics
 */
export async function getReviewStatistics(
  reviewType: ReviewType,
  reviewableId: string
): Promise<ApiResponse<ReviewStatisticsResponse>> {
  return request<ApiResponse<ReviewStatisticsResponse>>({
    url: `/v1/reviews/${reviewType}/${reviewableId}/statistics`,
    method: "GET",
  });
}

/**
 * Shop responds to a review
 * POST /api/v1/shop/reviews/{reviewId}/response
 */
export async function createReviewResponse(
  reviewId: string,
  payload: CreateReviewResponseRequest
): Promise<ApiResponse<ReviewResponse>> {
  return request<ApiResponse<ReviewResponse>>({
    url: `/v1/shop/reviews/${reviewId}/response`,
    method: "POST",
    data: payload,
  });
}

/**
 * Shop deletes response to a review
 * DELETE /api/v1/shop/reviews/{reviewId}/response
 */
export async function deleteReviewResponse(
  reviewId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/v1/shop/reviews/${reviewId}/response`,
    method: "DELETE",
  });
}
