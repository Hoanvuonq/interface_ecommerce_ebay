"use client";

import PageContentTransition from "@/features/PageContentTransition";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CustomBreadcrumb,
  CustomButton,
  CustomSpinner,
  ImageWithPreview,
} from "@/components";
import { CardComponents } from "@/components/card";
import { CustomAvatar } from "@/components/customAvatar";
import { CustomRate } from "@/components/rating";
import { TagComponents } from "@/components/tags";
import { formatTimeSince, formatCompactNumber } from "@/hooks/format";
import { createConversation } from "@/services/chat";
import { publicProductService } from "@/services/products/product.service";
import { getProductReviewComments } from "@/services/review/review.service";
import { ConversationType } from "@/types/chat/dto";
import type {
  PublicProductDetailDTO,
  PublicProductListItemDTO,
  PublicProductVariantDTO,
} from "@/types/product/public-product.dto";
import type {
  ReviewMediaResponse,
  ReviewResponse,
  ReviewStatisticsResponse,
} from "@/types/reviews/review.types";
import { cn } from "@/utils/cn";
import { getStoredUserDetail } from "@/utils/jwt";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import {
  CheckCircle,
  Image as ImageIcon,
  MessageSquare,
  MessageSquareText,
  Package,
  PlayCircle,
  Star,
  User,
  Video,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "sonner";
import { FeaturedProductsSidebar } from "../_components/FeaturedProductsSidebar";
import { ProductInfo } from "../_components/ProductInfo/ProductInfo";
import { ProductPurchaseActions } from "./_components";
import { useProductDetail } from "../_context";
import {CustomProgressBar} from "@/components/CustomProgressBar";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CustomVideoModal } from "@/components/CustomVideoModal";
import { InfomationShop } from "./_components/InfomationShop";



const RelatedProducts = dynamic(
  () =>
    import("../_components/RelatedProducts").then((mod) => ({
      default: mod.RelatedProducts,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <CustomSpinner />
        <p className="mt-2 text-gray-500">Đang tải sản phẩm của shop...</p>
      </div>
    ),
  }
);

const SimilarProducts = dynamic(
  () =>
    import("../_components/SimilarProducts").then((mod) => ({
      default: mod.SimilarProducts,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <CustomSpinner />
        <p className="mt-2 text-gray-500">Đang tải sản phẩm liên quan...</p>
      </div>
    ),
  }
);

// Customer Shop Chat (Giữ nguyên dynamic import)
// const CustomerShopChat = dynamic(
//     () =>
//         import("@/components/FloatingChatButtons/CustomerShopChat").then(
//             (m) => m.default
//         ),
//     { ssr: false }
// );


const resolveMediaUrl = (
  media:
    | {
        url?: string | null;
        basePath?: string | null;
        extension?: string | null;
      }
    | null
    | undefined,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_orig"
) => {
  if (!media) return "";
  return resolveMediaUrlHelper(media as any, size);
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bfbfbf" font-size="16">No image</text>
    </svg>`
  );

const resolveReviewMediaUrl = (media?: ReviewMediaResponse) => {
  if (!media) return "";
  const raw = media.url
    ? media.url
    : media.basePath && media.extension
    ? `${media.basePath}${media.extension}`
    : "";
  return toPublicUrl(raw || "");
};

export default function ProductDetailPage() {
  const params = useParams() as { id: string };
  const [product, setProduct] = useState<PublicProductDetailDTO | null>(null);
  const [featured, setFeatured] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<PublicProductVariantDTO | null>(null);
  const [shopChatOpen, setShopChatOpen] = useState(false);
  const [creatingShopChat, setCreatingShopChat] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Detect if param is slug (contains letters/dashes) or ID (numeric/UUID)
  // Slug thường chứa chữ cái, dấu gạch ngang, không phải UUID format
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (với hex)
  const isSlug = useMemo(() => {
    const identifier = params.id;
    if (!identifier) return false;
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(identifier)) return false;
    if (/^\d+$/.test(identifier)) return false;
    return /[a-zA-Z-]/.test(identifier);
  }, [params.id]);

  // const CustomerShopChat = useMemo( 
  //   () =>
  //     dynamic(
  //       () =>
  //         import("@/components/FloatingChatButtons/CustomerShopChat").then(
  //           (m) => m.default
  //         ),
  //       { ssr: false }
  //     ),
  //   []
  // );

 

  const handleOpenShopChat = useCallback(async () => {
    if (creatingShopChat) {
      return;
    }

    const userDetail = getStoredUserDetail();
    if (!userDetail?.userId) {
      toast.warning("Vui lòng đăng nhập để chat với Shop");
      return;
    }

    const shopUserId = product?.shop?.userId;

    console.log("shopUserId", shopUserId);
    if (!shopUserId) {
      toast.error("Không xác định được Shop để bắt đầu cuộc trò chuyện"); // ✅ Thay thế message.error
      return;
    }

    try {
      setCreatingShopChat(true);
      const response = await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [shopUserId],
        name: product?.shop?.shopName,
      });

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Không thể khởi tạo cuộc trò chuyện. Vui lòng thử lại."
        );
        return;
      }

      setShopChatOpen(true);
    } catch (error) {
      toast.error(
        "Không thể khởi tạo cuộc trò chuyện. Vui lòng thử lại sau."
      );
    } finally {
      setCreatingShopChat(false);
    }
  }, [creatingShopChat, product]);

  const [reviewSummary, setReviewSummary] =
    useState<ReviewStatisticsResponse | null>(null);
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewHasMore, setReviewHasMore] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const REVIEWS_PAGE_SIZE = 3;

  const loadFeaturedProducts = async (
    excludeProductId?: string,
    page = 0,
    size = 6
  ) => {
    try {
      const r = await publicProductService.getFeatured(page, size);
      const featuredList = r?.data?.content || [];
      const filtered = excludeProductId
        ? featuredList.filter((p) => p.id !== excludeProductId)
        : featuredList;
      setFeatured(filtered);
    } catch (error) {
      console.error("Failed to load featured products:", error);
      setFeatured([]);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const fetchProductReviews = async (
    productId: string,
    page = 0,
    reset = false
  ) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await getProductReviewComments(productId, {
        page,
        size: REVIEWS_PAGE_SIZE,
      });

      const content = res?.content ?? [];
      setProductReviews((prev) => {
        if (reset) return content;
        const existingIds = new Set(prev.map((item) => item.id));
        const merged = content.filter((item) => !existingIds.has(item.id));
        return [...prev, ...merged];
      });

      const currentPage = res?.page ?? page;
      const totalPages = res?.totalPages ?? 0;
      const hasMore =
        typeof res?.last === "boolean"
          ? !res.last
          : currentPage + 1 < totalPages;

      setReviewPage(currentPage);
      setReviewHasMore(hasMore);
    } catch (error) {
      console.error("Failed to load product reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const p = isSlug
          ? await publicProductService.getBySlug(params.id)
          : await publicProductService.getById(params.id);
        if (!mounted) return;
        const productData = (p as any)?.data || p;
        setProduct(productData);
        setReviewSummary(productData?.reviewStatistics ?? null);
        const defaultVariant =
          productData?.variants?.find((variant: PublicProductVariantDTO) =>
            hasVariantImage(variant)
          ) ??
          productData?.variants?.[0] ??
          null;
        setSelectedVariant(defaultVariant);
        setProductReviews([]);
        setReviewPage(0);
        setReviewHasMore(false);
        if (productData?.id) {
          void fetchProductReviews(productData.id, 0, true);
          void loadFeaturedProducts(productData.id);
        } else {
          setFeatured([]);
        }
      } catch (error) {
        console.error("Failed to load product detail:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params.id, isSlug]);

  const hasVariantImage = (variant?: PublicProductVariantDTO | null) => {
    if (!variant) return false;
    return Boolean(
      variant.imageUrl || (variant.imageBasePath && variant.imageExtension)
    );
  };

  const resolveVariantImage = (
    variant?: PublicProductVariantDTO | null,
    size: "_thumb" | "_medium" | "_large" | "_orig" = "_orig"
  ) => {
    if (!variant) return "";
    // Use helper from media.helpers.ts
    return resolveVariantImageUrlHelper(variant as any, size);
  };

  // Resolve primary image URL
  const galleryImages = useMemo(() => {
    const items: Array<{
      key: string;
      thumb: string;
      preview: string;
      alt: string;
    }> = [];

    product?.media
      ?.filter((m) => m.type === "IMAGE")
      .forEach((media) => {
        const preview = resolveMediaUrl(media, "_large");
        const thumb = resolveMediaUrl(media, "_thumb") || preview;
        if (preview && preview !== "/placeholder-product.png") {
          items.push({
            key: `media-${media.id}`,
            thumb:
              thumb && thumb !== "/placeholder-product.png"
                ? thumb
                : PLACEHOLDER_IMAGE,
            preview,
            alt: product?.name || "Product image",
          });
        }
      });

    product?.variants?.forEach((variant) => {
      const preview = resolveVariantImage(variant, "_large");
      if (preview && preview !== "/placeholder-product.png") {
        const thumb = resolveVariantImage(variant, "_thumb");
        items.push({
          key: `variant-${variant.id}`,
          thumb:
            thumb && thumb !== "/placeholder-product.png" ? thumb : preview,
          preview,
          alt: `${product?.name || "Variant"} - ${variant.sku}`,
        });
      }
    });

    const unique: typeof items = [];
    const seen = new Set<string>();
    for (const img of items) {
      if (!img.preview) continue;
      if (seen.has(img.preview)) continue;
      seen.add(img.preview);
      unique.push({
        ...img,
        thumb: img.thumb || img.preview,
      });
    }

    return unique;
  }, [product]);

  const getPrimaryImage = () => {
    const variantImage = resolveVariantImage(selectedVariant, "_large");
    if (variantImage && variantImage !== "/placeholder-product.png") {
      return variantImage;
    }
    const preview = galleryImages[0]?.preview;
    if (preview && preview !== "/placeholder-product.png") {
      return preview;
    }
    return PLACEHOLDER_IMAGE;
  };

  const primaryImage = getPrimaryImage();
  const STAR_LEVELS = [5, 4, 3, 2, 1];

  const ratingDistributionEntries = reviewSummary
    ? STAR_LEVELS.map((star) => ({
        star,
        count: reviewSummary.ratingDistribution?.[star] ?? 0,
        percentage: reviewSummary.ratingPercentage?.[star] ?? 0,
      }))
    : [];


  const soldCount =
    (product as any)?.soldCount ??
    (product as any)?.totalSold ??
    (product as any)?.totalOrders ??
    reviewSummary?.totalReviews;

  const followerCount = (product as any)?.shop?.followerCount;

  // Tính giá dựa trên variant được chọn - sử dụng useMemo để cập nhật khi variant thay đổi
  const { variantPrice, priceAfterVoucher, primaryPrice, comparePrice } =
    useMemo(() => {
      // Giá bán hiện tại của variant (đã trừ discount, chưa áp dụng voucher)
      // Ưu tiên giá của variant được chọn, chỉ fallback về priceMin khi chưa chọn variant
      const vPrice =
        selectedVariant?.price !== undefined && selectedVariant?.price !== null
          ? selectedVariant.price
          : product?.priceMin ?? product?.basePrice ?? 0;

      // Tính giá sau voucher
      const calculatePriceAfterVoucher = () => {
        // Lần đầu tiên (chưa chọn variant): ưu tiên priceAfterDiscount từ product
        if (!selectedVariant) {
          return (
            product?.priceAfterBestVoucher ??
            product?.priceAfterBestShopVoucher ??
            product?.priceAfterBestPlatformVoucher ??
            null
          );
        }

        // Nếu đã chọn variant: phải tính lại từ giá của variant đó
        if (selectedVariant && vPrice && vPrice > 0) {
          // Nếu variant có priceAfterDiscount sẵn thì dùng luôn (backend đã tính)
          if (
            (selectedVariant as any)?.priceAfterDiscount !== undefined &&
            (selectedVariant as any)?.priceAfterDiscount !== null
          ) {
            return (selectedVariant as any).priceAfterDiscount;
          }

          const bestVoucher =
            product?.bestShopVoucher ?? product?.bestPlatformVoucher;
          if (!bestVoucher) {
            return null;
          }

          const { discountType, discountValue, discountAmount } = bestVoucher;

          if (discountType === "PERCENTAGE" && discountValue) {
            const discount = (vPrice * discountValue) / 100;
            return Math.max(0, vPrice - discount);
          } else if (discountType === "FIXED_AMOUNT" && discountAmount) {
            return Math.max(0, vPrice - discountAmount);
          }
        }

        return null;
      };

      const pAfterVoucher = calculatePriceAfterVoucher();

      const pPrice = pAfterVoucher ?? vPrice;

      const cPrice =
        selectedVariant?.corePrice ??
        product?.comparePrice ??
        (product?.basePrice && product?.basePrice > pPrice
          ? product.basePrice
          : undefined);

      return {
        variantPrice: vPrice,
        priceAfterVoucher: pAfterVoucher,
        primaryPrice: pPrice,
        comparePrice: cPrice,
      };
    }, [selectedVariant, product]);

  const discountPercentage =
    comparePrice && comparePrice > primaryPrice
      ? Math.round(((comparePrice - primaryPrice) / comparePrice) * 100)
      : null;

  const discountInfo = useMemo(() => {
    const bestVoucher =
      product?.bestShopVoucher ?? product?.bestPlatformVoucher;
    if (!bestVoucher) return null;

    const {
      discountType,
      discountValue,
      discountAmount,
      name,
      code,
      description,
    } = bestVoucher;

    const originalPrice = comparePrice ?? variantPrice;
    const finalPrice = priceAfterVoucher ?? variantPrice;
    const actualDiscount = originalPrice - finalPrice;

    let discountText = "";
    if (discountType === "PERCENTAGE" && discountValue) {
      discountText = `Giảm ${discountValue}%`;
    } else if (discountType === "FIXED_AMOUNT" && discountAmount) {
      if (discountAmount >= 1000) {
        discountText = `Giảm ${Math.round(discountAmount / 1000)}k`;
      } else {
        discountText = `Giảm ${formatPrice(discountAmount)}`;
      }
    }

    return {
      voucherName: name || code,
      voucherCode: code,
      description,
      discountType,
      discountText,
      originalPrice,
      variantPrice,
      finalPrice,
      actualDiscount,
    };
  }, [product, variantPrice, priceAfterVoucher, comparePrice]);

  const hasPriceRange =
    product?.priceMin !== undefined &&
    product?.priceMax !== undefined &&
    product?.priceMin !== null &&
    product?.priceMax !== null &&
    product.priceMin !== product.priceMax;

  const priceRangeLabel = hasPriceRange
    ? `${formatPrice(product!.priceMin!)} - ${formatPrice(product!.priceMax!)}`
    : null;

  const bestPlatformVoucher = product?.bestPlatformVoucher;

  const renderReviewMedia = (media?: ReviewMediaResponse[]) => {
    if (!media || media.length === 0) {
      return null;
    }

    const imageMedia = media.filter((m) => m.type === "IMAGE");
    const videoMedia = media.filter((m) => m.type === "VIDEO");
    const THUMB_SIZE = 80;

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {imageMedia.map((img) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          >
            <ImageWithPreview
              src={
                resolveReviewMediaUrl(img) &&
                resolveReviewMediaUrl(img) !== "/placeholder-product.png"
                  ? resolveReviewMediaUrl(img)
                  : PLACEHOLDER_IMAGE
              }
              alt="Review media"
              width={THUMB_SIZE}
              height={THUMB_SIZE}
              className="w-full h-full object-cover cursor-pointer"
              onError={(e: any) => {
                const img = e.target as HTMLImageElement;
                if (!img.src.includes("data:image/svg")) {
                  img.src = PLACEHOLDER_IMAGE;
                  img.onerror = null; // Remove error handler to prevent further retries
                }
              }}
            />
          </div>
        ))}
        {videoMedia.map((vid) => {
          const videoUrl = resolveReviewMediaUrl(vid);
          if (!videoUrl) return null;
          return (
            <div
              key={vid.id}
              className="flex cursor-pointer items-center justify-center rounded-lg bg-black/80"
              style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
              onClick={() => setVideoPreview(videoUrl)}
            >
              <PlayCircle className="w-8 h-8 text-white/90" />
            </div>
          );
        })}
      </div>
    );
  };
  

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex-1">
        <PageContentTransition>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {loading || !product ? (
              <div className="py-24 text-center">
                <CustomSpinner />
              </div>
            ) : (
              <>
                <CustomBreadcrumb
                  items={[
                    { title: "Trang chủ", href: "/" },
                    { title: "Sản phẩm", href: "/products" },
                    { title: product.name, href: `/products/${product.id}` },
                  ]}
                />
                <CardComponents className="overflow-visible pt-2 shadow-2xl hover:shadow-3xl transition-shadow">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
                    <section className="space-y-4">
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
                        <ImageWithPreview
                          src={
                            primaryImage &&
                            primaryImage !== "/placeholder-product.png"
                              ? primaryImage
                              : PLACEHOLDER_IMAGE
                          }
                          alt={product.name}
                          width={500}
                          height={500}
                          className="w-full rounded-xl object-cover"
                          onClick={() => setImagePreview(primaryImage)}
                          onError={(e: any) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes("data:image/svg")) {
                              img.src = PLACEHOLDER_IMAGE;
                              img.onerror = null;
                            }
                          }}
                        />
                      </div>
                      {galleryImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                          {galleryImages.slice(0, 5).map((img) => {
                            const thumbSrc =
                              img.thumb &&
                              img.thumb !== "/placeholder-product.png"
                                ? img.thumb
                                : PLACEHOLDER_IMAGE;
                            return (
                              <div
                                key={img.key}
                                className="h-20 w-full rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                                onClick={() => setImagePreview(img.preview)}
                              >
                                <img
                                  src={thumbSrc}
                                  alt={img.alt}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                  onError={(e: any) => {
                                    const img = e.target as HTMLImageElement;
                                    if (!img.src.includes("data:image/svg")) {
                                      img.src = PLACEHOLDER_IMAGE;
                                      img.onerror = null;
                                    }
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>

                    <ProductPurchaseActions
                      product={product}
                      selectedVariant={selectedVariant}
                      setSelectedVariant={setSelectedVariant}
                      reviewSummary={reviewSummary}
                      soldCount={soldCount}
                      formatCompactNumber={formatCompactNumber}
                      discountInfo={discountInfo}
                      priceRangeLabel={priceRangeLabel}
                      primaryPrice={primaryPrice}
                      comparePrice={comparePrice}
                      discountPercentage={discountPercentage}
                      priceAfterVoucher={priceAfterVoucher}
                      formatPrice={formatPrice}
                      bestPlatformVoucher={bestPlatformVoucher}
                    />
                  </div>
                </CardComponents>
                <InfomationShop
  product={product}
  reviewSummary={reviewSummary}
  soldCount={soldCount}
  followerCount={followerCount}
  creatingShopChat={creatingShopChat}
  handleOpenShopChat={handleOpenShopChat}
/>
                {/* Product Info & Featured Sidebar */}
                <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
                  <ProductInfo
                    product={product}
                    selectedVariant={selectedVariant}
                  />
                  <FeaturedProductsSidebar
                    products={featured}
                    loading={loading}
                  />
                </div>
                {/* Divider */}
                <div className="border-t border-gray-300 my-6" />{" "}
                <CardComponents 
                  title={`Đánh giá (${reviewSummary?.totalReviews ?? 0})`}
                  bodyClassName="p-4 sm:p-6"
                >
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <div className="text-5xl font-extrabold text-yellow-500 leading-none">
                              {Number(
                                reviewSummary?.averageRating ?? 0
                              ).toFixed(1)}
                            </div>
                            <CustomRate 
                              value={Number(reviewSummary?.averageRating ?? 0)}
                              size={24}
                              disabled
                            />
                            <div className="text-sm text-gray-500 mt-1">
                              {reviewSummary?.totalReviews ?? 0} đánh giá
                            </div>
                            <div className="text-xs text-gray-500">
                              {reviewSummary?.verifiedPurchaseCount ?? 0} xác
                              thực
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          {ratingDistributionEntries.map(
                            ({ star, count, percentage }) => (
                              <div
                                key={star}
                                className="flex items-center gap-3 text-sm text-gray-600"
                              >
                                <span className="w-8 text-right font-semibold">
                                  {star}★
                                </span>
                                <CustomProgressBar 
                                  percent={Number(percentage ?? 0)}
                                  color="bg-yellow-500"
                                />
                                <span className="w-16 text-right font-medium">
                                  {count} ({Number(percentage ?? 0).toFixed(0)}
                                  %)
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-200 my-4" />{" "}
                      <div className="flex flex-wrap gap-3">
                        <TagComponents colorClass="bg-blue-100 text-blue-700">
                          <MessageSquareText className="w-3 h-3" />
                          {reviewSummary?.commentCount ?? 0} nhận xét
                        </TagComponents>
                        <TagComponents colorClass="bg-purple-100 text-purple-700">
                          <Video className="w-3 h-3" />
                          {reviewSummary?.mediaReviewCount ?? 0} có media
                        </TagComponents>
                        <TagComponents colorClass="bg-cyan-100 text-cyan-700">
                          <ImageIcon className="w-3 h-3" />
                          {reviewSummary?.imageReviewCount ?? 0} ảnh
                        </TagComponents>
                        <TagComponents colorClass="bg-red-100 text-red-700">
                          <Video className="w-3 h-3" />
                          {reviewSummary?.videoReviewCount ?? 0} video
                        </TagComponents>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                      {productReviews.length === 0 && !reviewsLoading ? (
                        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                          <CustomEmpty description="Chưa có đánh giá nào cho sản phẩm này." />{" "}
                        </div>
                      ) : (
                        productReviews.map((review) => (
                          <div
                            key={review.id}
                            className="bg-white rounded-xl p-4 shadow-md border border-gray-200"
                          >
                            <div className="flex gap-4">
                              <CustomAvatar // ✅ Thay thế Antd Avatar
                                size={48}
                                src={review.userAvatar || undefined}
                                icon={<User className="text-gray-400" />} // ✅ Lucide Icon
                                className="bg-gray-100"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                  <span className="font-bold text-gray-900 text-base">
                                    {review.username || review.buyerName}
                                  </span>
                                  <CustomRate // ✅ Thay thế Antd Rate
                                    value={Number(review.rating ?? 0)}
                                    size={14}
                                    disabled
                                  />
                                  <span>
                                    {new Date(
                                      review.createdDate
                                    ).toLocaleString("vi-VN")}
                                  </span>
                                  {review.verifiedPurchase && (
                                    <TagComponents
                                      colorClass="bg-green-100 text-green-700"
                                      className="shadow-none"
                                      icon={<CheckCircle className="w-3 h-3" />} // ✅ Lucide Icon
                                    >
                                      Đã mua hàng
                                    </TagComponents>
                                  )}
                                </div>

                                {review.comment && (
                                  <div className="text-gray-700 whitespace-pre-line text-sm">
                                    {review.comment}
                                  </div>
                                )}

                                {renderReviewMedia(review.media)}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {reviewsLoading && (
                      <div className="text-center">
                        <CustomSpinner />
                      </div>
                    )}

                    {!reviewsLoading && reviewHasMore && product && (
                      <div className="text-center mt-4">
                        <CustomButton
                          type="default"
                          className="rounded-xl px-6 py-2 text-blue-600 hover:bg-blue-50 border-blue-300"
                          onClick={() =>
                            fetchProductReviews(product.id, reviewPage + 1)
                          }
                        >
                          Xem thêm đánh giá
                        </CustomButton>
                      </div>
                    )}
                  </div>
                </CardComponents>
                {product?.shop?.shopId && (
                  <RelatedProducts
                    shopId={product.shop.shopId}
                    excludeProductId={product.id}
                  />
                )}
                {product?.id && <SimilarProducts productId={product.id} />}
              </>
            )}
          </main>
        </PageContentTransition>
      </div>
      {/* <Footer /> */}
      {/* Shop Chat Drawer (dynamic import) */}
      {/* <CustomerShopChat
                open={shopChatOpen}
                onClose={() => setShopChatOpen(false)}
                targetShopId={product?.shop?.userId}
                targetShopName={product?.shop?.shopName}
            /> */}
      {/* Video Modal (Fixed, Custom Modal) */}
      <CustomVideoModal
        open={Boolean(videoPreview)}
        videoUrl={videoPreview}
        onCancel={() => setVideoPreview(null)}
      />
      {imagePreview && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
    onClick={() => setImagePreview(null)}
  >
    <button
      className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
      onClick={() => setImagePreview(null)}
    >
      <X size={32} />
    </button>
    <img
      src={imagePreview}
      alt="Preview"
      className="max-w-full max-h-full rounded-lg shadow-2xl"
    />
  </div>
)}
    </div>
  );
}
