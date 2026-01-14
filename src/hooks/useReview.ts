/**
 * Review Hooks
 * React hooks for customer review feature
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getReviewStatistics,
  getMyReviews,
  markReviewHelpful,
  markReviewNotHelpful,
} from "@/services/review/review.service";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewResponse,
  ReviewListResponse,
  ReviewStatisticsResponse,
  ReviewType,
} from "@/app/(shop)/shop/reviews/_types/review.types";

/**
 * Hook to create a review
 */
export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (request: CreateReviewRequest): Promise<ReviewResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await createReview(request);
        toast.success("Đánh giá đã được gửi thành công!");
        return data;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Có lỗi xảy ra khi tạo đánh giá";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
};

/**
 * Hook to update a review
 */
export const useUpdateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      reviewId: string,
      request: UpdateReviewRequest
    ): Promise<ReviewResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await updateReview(reviewId, request);
        toast.success("Đánh giá đã được cập nhật!");
        return data;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật đánh giá";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
};

/**
 * Hook to delete a review
 */
export const useDeleteReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (reviewId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteReview(reviewId);
        toast.success("Đánh giá đã được xóa!");
        return true;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Có lỗi xảy ra khi xóa đánh giá";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
};

/**
 * Hook to get reviews for a product/shop
 */
export const useGetReviews = (
  reviewType: ReviewType,
  reviewableId: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  const [data, setData] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled || !reviewableId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getReviews(reviewType, reviewableId, page, size);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Có lỗi xảy ra khi tải đánh giá";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [reviewType, reviewableId, page, size, enabled]);

  return { data, loading, error, refetch };
};

/**
 * Hook to get review statistics
 */
export const useGetReviewStatistics = (
  reviewType: ReviewType,
  reviewableId: string,
  enabled: boolean = true
) => {
  const [data, setData] = useState<ReviewStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled || !reviewableId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getReviewStatistics(reviewType, reviewableId);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Có lỗi xảy ra khi tải thống kê đánh giá";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [reviewType, reviewableId, enabled]);

  return { data, loading, error, refetch };
};

/**
 * Hook to get current user's reviews
 */
export const useGetMyReviews = (page: number = 0, size: number = 20) => {
  const [data, setData] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyReviews(page, size);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Có lỗi xảy ra khi tải đánh giá của bạn";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  return { data, loading, error, refetch };
};

/**
 * Hook to mark review as helpful
 */
export const useMarkReviewHelpful = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (reviewId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await markReviewHelpful(reviewId);
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

/**
 * Hook to mark review as not helpful
 */
export const useMarkReviewNotHelpful = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (reviewId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await markReviewNotHelpful(reviewId);
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

