"use client";

import { useProductDetail } from "@/app/(main)/products/_context/products";
import { ButtonField, CustomButton, CustomSpinner } from "@/components";
import { CardComponents } from "@/components/card";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CustomRate } from "@/components/rating";
import { PortalModal } from "@/features/PortalModal";
import {
  ChevronDown,
  Star
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ReviewItem } from "../ReviewItem";

export const ProductReviews = () => {
  const {
    reviewSummary,
    productReviews,
    reviewsLoading,
    reviewHasMore,
    loadMoreReviews,
  } = useProductDetail();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ratingEntries = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewSummary?.ratingDistribution?.[star] ?? 0,
    percentage: reviewSummary?.ratingPercentage?.[star] ?? 0,
  }));

  const resolveReviewMediaUrl = (media?: any) => {
    if (!media) return "";
    const raw =
      media.url ||
      (media.basePath && media.extension
        ? `${media.basePath}${media.extension}`
        : "");
    return raw.startsWith("http")
      ? raw
      : `https://pub-5341c10461574a539df355b9fbe87197.r2.dev/${raw}`;
  };

  return (
    <CardComponents
      bodyClassName="p-0"
      className="shadow-sm border border-gray-100 rounded-3xl overflow-hidden bg-white"
    >
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
          Đánh giá từ khách hàng
          <span className="text-sm font-medium text-gray-400">
            ({reviewSummary?.totalReviews ?? 0})
          </span>
        </h3>

        <div className="bg-gray-50/80 rounded-2xl p-6 md:p-10 border border-gray-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center md:border-r border-gray-200">
              <div className="text-7xl font-black text-(--color-mainColor)/80 tracking-tighter mb-2">
                {Number(reviewSummary?.averageRating ?? 0).toFixed(1)}
              </div>
              <CustomRate
                value={Number(reviewSummary?.averageRating ?? 0)}
                size={24}
                disabled
              />
              <p className="mt-4 text-[12px] font-bold text-gray-600 ">
                Trung bình {reviewSummary?.totalReviews ?? 0} đánh giá
              </p>
            </div>

            <div className="md:col-span-8 space-y-4 px-0 md:px-6">
              {ratingEntries.map((item) => (
                <div
                  key={item.star}
                  className="flex items-center gap-4 text-sm group"
                >
                  <span className="w-8 font-semibold text-gray-500 flex items-center gap-1 text-xs">
                    {item.star}{" "}
                    <Star
                      size={12}
                      className="fill-yellow-500 text-yellow-500 transition-colors"
                    />
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-(--color-mainColor) rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-gray-600 text-center text-[11px] font-bold">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {productReviews.length === 0 && !reviewsLoading ? (
            <div className="py-20 flex flex-col items-center">
              <CustomEmpty description="Sản phẩm chưa có nhận xét nào" />
              <ButtonField
                type="login"
                className="rounded-full w-50 px-10 mt-6 h-11 uppercase text-[11px] font-bold tracking-widest"
              >
                Viết đánh giá
              </ButtonField>
            </div>
          ) : (
            productReviews.map((review, idx) => (
              <ReviewItem
                key={review.id}
                review={review}
                onImageClick={setSelectedImage}
                resolveMediaUrl={resolveReviewMediaUrl}
              />
            ))
          )}
        </div>

        {reviewsLoading && (
          <div className="flex justify-center py-10">
            <CustomSpinner />
          </div>
        )}

        {reviewHasMore && !reviewsLoading && (
          <div className="flex justify-center pt-8">
            <CustomButton
              onClick={loadMoreReviews}
              className="px-10 rounded-full border-gray-200 text-gray-500 hover:bg-gray-800 hover:text-white font-bold h-12 transition-all flex items-center gap-2 group"
            >
              Xem thêm đánh giá
              <ChevronDown
                size={16}
                className="group-hover:trangray-y-0.5 transition-transform"
              />
            </CustomButton>
          </div>
        )}
      </div>

      <PortalModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        width="max-w-4xl"
        className="bg-transparent shadow-none border-none"
      >
        <div className="relative w-full aspect-square md:aspect-video flex items-center justify-center">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Review Full"
              fill
              className="object-contain"
            />
          )}
        </div>
      </PortalModal>
    </CardComponents>
  );
};
