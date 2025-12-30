"use client";

import { useProductDetail } from "@/app/(main)/products/_context/products";
import { CustomButton, CustomSpinner } from "@/components";
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
    Video
} from "lucide-react";

export const ProductReviews = () => {
    const { 
        reviewSummary, productReviews, reviewsLoading, 
        reviewHasMore, loadMoreReviews 
    } = useProductDetail();

    const ratingEntries = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviewSummary?.ratingDistribution?.[star] ?? 0,
        percentage: reviewSummary?.ratingPercentage?.[star] ?? 0,
    }));

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
                            <div className="text-6xl font-semibold text-orange-500 mb-2">
                                {Number(reviewSummary?.averageRating ?? 0).toFixed(1)}
                            </div>
                            <CustomRate value={Number(reviewSummary?.averageRating ?? 0)} size={28} disabled />
                            <div className="mt-4 flex gap-4 text-sm text-gray-500">
                                <span>{reviewSummary?.totalReviews ?? 0} đánh giá</span>
                                <span>•</span>
                                <span>{reviewSummary?.verifiedPurchaseCount ?? 0} xác thực</span>
                            </div>
                        </div>

                        <div className="md:col-span-8 space-y-3 px-0 md:px-6">
                            {ratingEntries.map((item) => (
                                <div key={item.star} className="flex items-center gap-4 text-sm">
                                    <span className="w-10 font-bold text-gray-600 flex items-center gap-1">
                                        {item.star}<Star size={14} className="fill-orange-400 text-orange-400" />
                                    </span>
                                    <CustomProgressBar percent={item.percentage} color="bg-orange-400" className="h-2.5" />
                                    <span className="w-24 text-gray-400 text-right">
                                        {item.count} ({Math.round(item.percentage)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                        <TagComponents colorClass="bg-blue-50 text-blue-600 border-blue-100">
                            <MessageSquareText size={14} className="mr-1" /> {reviewSummary?.commentCount ?? 0} Nhận xét
                        </TagComponents>
                        <TagComponents colorClass="bg-purple-50 text-purple-600 border-purple-100">
                            <Video size={14} className="mr-1" /> {reviewSummary?.mediaReviewCount ?? 0} Có media
                        </TagComponents>
                        <TagComponents colorClass="bg-cyan-50 text-cyan-600 border-cyan-100">
                            <ImageIcon size={14} className="mr-1" /> {reviewSummary?.imageReviewCount ?? 0} Ảnh
                        </TagComponents>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {productReviews.length === 0 && !reviewsLoading ? (
                        <div className="py-12 flex flex-col items-center text-center">
                            <CustomEmpty description="Chưa có đánh giá nào cho sản phẩm này." />
                            <CustomButton type="primary" className="py-3 px-6 rounded-full">
                                Viết đánh giá ngay
                            </CustomButton>
                        </div>
                    ) : (
                        productReviews.map((review) => (
                            <div key={review.id} className="py-6 first:pt-0">
                                <div className="flex gap-4">
                                    <CustomAvatar size={48} src={review.userAvatar || undefined} icon={<User />} className="bg-gray-100 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900">{review.username || review.buyerName}</span>
                                                <CustomRate value={Number(review.rating)} size={12} disabled />
                                            </div>
                                            <span className="text-xs text-gray-400 italic">
                                                {new Date(review.createdDate).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                        {review.verifiedPurchase && (
                                            <TagComponents colorClass="bg-green-50 text-green-600 border-green-100 text-[11px] px-2 py-0.5" icon={<CheckCircle size={12} />}>
                                                Đã mua hàng
                                            </TagComponents>
                                        )}
                                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {reviewsLoading && <div className="text-center py-4"><CustomSpinner /></div>}
                
                {reviewHasMore && (
                    <div className="text-center pt-4">
                        <CustomButton loading={reviewsLoading} onClick={loadMoreReviews} className="px-10 rounded-full border-gray-200">
                            Xem thêm đánh giá
                        </CustomButton>
                    </div>
                )}
            </div>
        </CardComponents>
    );
};