/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  getReviews,
  getReviewStatistics,
  createReviewResponse,
  deleteReviewResponse,
} from "../_services/review.service";
import {
  GetReviewsParams,
  CreateReviewResponseRequest,
} from "../_types/dto/review.dto";
import { ReviewType } from "../_types/review.types";
import { ApiResponse } from "@/api/_types/api.types";

/**
 * Hook for getting reviews
 */
export function useGetReviews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetReviews = async (
    reviewType: ReviewType,
    reviewableId: string,
    params?: GetReviewsParams
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReviews(reviewType, reviewableId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách reviews thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetReviews, loading, error };
}

/**
 * Hook for getting review statistics
 */
export function useGetReviewStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetReviewStatistics = async (
    reviewType: ReviewType,
    reviewableId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReviewStatistics(reviewType, reviewableId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê reviews thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetReviewStatistics, loading, error };
}

/**
 * Hook for creating review response
 */
export function useCreateReviewResponse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateReviewResponse = async (
    reviewId: string,
    payload: CreateReviewResponseRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createReviewResponse(reviewId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Trả lời review thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateReviewResponse, loading, error };
}

/**
 * Hook for deleting review response
 */
export function useDeleteReviewResponse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteReviewResponse = async (
    reviewId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteReviewResponse(reviewId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa phản hồi thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteReviewResponse, loading, error };
}
