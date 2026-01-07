"use client";

import { useProductDetail } from "@/app/(main)/products/_context/products";
import { ButtonField, CustomButton, CustomSpinner } from "@/components";
import { CardComponents } from "@/components/card";
import { CustomAvatar } from "@/components/customAvatar";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CustomProgressBar } from "@/components/CustomProgressBar";
import { CustomRate } from "@/components/rating";
import { TagComponents } from "@/components/tags";
import {
  CheckCircle,
  Image as ImageIcon,
  MessageSquareText,
  Star,
  User,
  PlayCircle,
  Video,
} from "lucide-react";
import Image from "next/image";

export const ProductReviews = () => {
  const {
    reviewSummary,
    productReviews,
    reviewsLoading,
    reviewHasMore,
    loadMoreReviews,
  } = useProductDetail();

  // Thống kê phân bổ sao
  const ratingEntries = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewSummary?.ratingDistribution?.[star] ?? 0,
    percentage: reviewSummary?.ratingPercentage?.[star] ?? 0,
  }));

  // Helper xử lý URL ảnh/video (Cần khớp với domain storage của bạn)
  const resolveReviewMediaUrl = (media?: any) => {
    if (!media) return "";
    const raw =
      media.url ||
      (media.basePath && media.extension
        ? `${media.basePath}${media.extension}`
        : "");
    // Sử dụng domain từ JSON shop logo của bạn làm mẫu
    return raw.startsWith("http")
      ? raw
      : `https://pub-5341c10461574a539df355b9fbe87197.r2.dev/${raw}`;
  };

  return (
    <CardComponents
      title={`Đánh giá sản phẩm (${reviewSummary?.totalReviews ?? 0})`}
      bodyClassName="p-6"
      className="shadow-md border-none"
    >
      <div className="space-y-8">
        <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center border-r-0 md:border-r border-gray-200">
              <div className="text-6xl font-bold text-orange-500 mb-2">
                {Number(reviewSummary?.averageRating ?? 0).toFixed(1)}
              </div>
              <CustomRate
                value={Number(reviewSummary?.averageRating ?? 0)}
                size={28}
                disabled
              />
              <div className="mt-4 flex gap-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
                <span>{reviewSummary?.totalReviews ?? 0} đánh giá</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600">
                  {reviewSummary?.verifiedPurchaseCount ?? 0} xác thực
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-3 px-0 md:px-6">
              {ratingEntries.map((item) => (
                <div
                  key={item.star}
                  className="flex items-center gap-4 text-sm"
                >
                  <span className="w-10 font-bold text-gray-600 flex items-center gap-1">
                    {item.star}{" "}
                    <Star
                      size={12}
                      className="fill-orange-400 text-orange-400"
                    />
                  </span>
                  <CustomProgressBar
                    percent={item.percentage}
                    color="bg-orange-400"
                    className="h-2 flex-1"
                  />
                  <span className="w-24 text-gray-600 text-right text-xs font-medium">
                    {item.count} ({Math.round(item.percentage)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
            <TagComponents colorClass="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1">
              <MessageSquareText size={14} className="mr-1.5" />
              {reviewSummary?.commentCount ?? 0} Nhận xét
            </TagComponents>
            <TagComponents colorClass="bg-purple-50 text-purple-600 border-purple-100 px-3 py-1">
              <Video size={14} className="mr-1.5" />
              {reviewSummary?.mediaReviewCount ?? 0} Có media
            </TagComponents>
            <TagComponents colorClass="bg-cyan-50 text-cyan-600 border-cyan-100 px-3 py-1">
              <ImageIcon size={14} className="mr-1.5" />
              {reviewSummary?.imageReviewCount ?? 0} Ảnh
            </TagComponents>
          </div>
        </div>

        {/* --- 2. DANH SÁCH CHI TIẾT BÌNH LUẬN --- */}
        <div className="divide-y divide-gray-100">
          {productReviews.length === 0 && !reviewsLoading ? (
            <div className="py-12 flex flex-col items-center text-center">
              <CustomEmpty description="Chưa có đánh giá nào cho sản phẩm này." />
              <ButtonField
                type="login"
                size="middle"
                className="rounded-full w-50 text-[12px] uppercase h-12 font-bold tracking-tight mt-6"
              >
                Viết đánh giá ngay
              </ButtonField>
            </div>
          ) : (
            productReviews.map((review) => (
              <div
                key={review.id}
                className="py-8 first:pt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex gap-5">
                  <CustomAvatar
                    size={48}
                    src={review.userAvatar || undefined}
                    icon={<User size={24} />}
                    className="bg-gray-100 shrink-0 border border-gray-100 shadow-sm"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {review.username ||
                              review.buyerName ||
                              "Người dùng ẩn danh"}
                          </span>
                          {review.verifiedPurchase && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
                              <CheckCircle size={10} /> Đã mua hàng
                            </div>
                          )}
                        </div>
                        <CustomRate
                          value={Number(review.rating)}
                          size={12}
                          disabled
                        />
                      </div>
                      <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest italic">
                        {new Date(review.createdDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>

                    {/* Nội dung text */}
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {review.comment ||
                        "Khách hàng không để lại nội dung nhận xét."}
                    </p>

                    {review.media && review.media.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.media.map((m: any) => (
                          <div
                            key={m.id}
                            className="w-20 h-20 relative rounded-lg overflow-hidden border"
                          >
                            <Image
                              src={resolveReviewMediaUrl(m)}
                              fill
                              className="object-cover"
                              alt="review"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {review.sellerResponse && (
                      <div className="mt-4 bg-gray-50 rounded-2xl p-4 border-l-4 border-orange-400 relative">
                        <div className="absolute -top-2 left-4 px-2 bg-orange-400 text-white text-[9px] font-bold uppercase rounded shadow-sm">
                          Phản hồi của Shop
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                          {review.sellerResponse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {reviewsLoading && (
          <div className="flex flex-col items-center py-8 gap-2">
            <CustomSpinner />
            <span className="text-xs text-gray-600 font-bold uppercase tracking-widest animate-pulse">
              Đang tải thêm...
            </span>
          </div>
        )}

        {reviewHasMore && !reviewsLoading && (
          <div className="text-center pt-6">
            <CustomButton
              onClick={loadMoreReviews}
              className="px-12 rounded-full border-gray-200 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 font-bold transition-all h-12 shadow-sm"
            >
              Xem thêm đánh giá (
              {reviewSummary?.totalReviews
                ? reviewSummary.totalReviews - productReviews.length
                : 0}
              )
            </CustomButton>
          </div>
        )}
      </div>
    </CardComponents>
  );
};
