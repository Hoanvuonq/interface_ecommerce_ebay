"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPendingReviews, 
  getFlaggedReviews, 
  moderateReview 
} from "../_services/review.service";
import { 
  GetReviewsAdminRequest, 
  ModerateReviewRequest, 
  ReviewStatus 
} from "../_types/review.type";
import { useToast } from "@/hooks/useToast"; 

export function useAdminReview(params: GetReviewsAdminRequest, activeTab: "pending" | "flagged") {
  const queryClient = useQueryClient();
  const { error: toastError, success: toastSuccess } = useToast();

  const reviewsQuery = useQuery({
    queryKey: ["admin-reviews", activeTab, params],
    queryFn: () => activeTab === "pending" ? getPendingReviews(params) : getFlaggedReviews(params),
    placeholderData: (prev) => prev,
  });

  const statsQuery = useQuery({
    queryKey: ["admin-reviews-stats"],
    queryFn: async () => {
      const [pending, flagged] = await Promise.all([
        getPendingReviews({ page: 0, size: 1 }),
        getFlaggedReviews({ page: 0, size: 1 }),
      ]);
      return {
        pending: pending?.data?.totalElements || 0,
        flagged: flagged?.data?.totalElements || 0,
      };
    },
    refetchInterval: 30000, 
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ModerateReviewRequest }) => 
      moderateReview(id, payload),
    onSuccess: () => {
      toastSuccess("Thành công!", { description: "Trạng thái đánh giá đã được cập nhật." });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-stats"] });
    },
    onError: (err: any) => {
      toastError("Lỗi!", { description: err.message || "Kiểm duyệt thất bại" });
    }
  });

  return {
    reviews: reviewsQuery.data?.data?.content || [],
    pagination: {
      current: (reviewsQuery.data?.data?.page || 0) + 1,
      pageSize: reviewsQuery.data?.data?.size || 20,
      total: reviewsQuery.data?.data?.totalElements || 0,
    },
    stats: statsQuery.data || { pending: 0, flagged: 0 },
    isLoading: reviewsQuery.isLoading || statsQuery.isLoading,
    isProcessing: moderateMutation.isPending,
    moderateReview: moderateMutation.mutateAsync,
    refresh: () => {
      reviewsQuery.refetch();
      statsQuery.refetch();
    }
  };
}