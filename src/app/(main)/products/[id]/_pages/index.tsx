"use client";

import { CustomSpinner, ImageWithPreview } from "@/components";
import { CardComponents } from "@/components/card";
import { CustomVideoModal } from "@/components/custom/components/customVideoModal";
import { formatCompactNumber } from "@/hooks/format";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import type { PublicProductVariantDTO } from "@/types/product/public-product.dto";
import type { ReviewMediaResponse } from "@/types/reviews/review.types";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { PlayCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { FeaturedProductsSidebar } from "../../_components/FeaturedProductsSidebar";
import { ProductInfo } from "../../_components/ProductInfo/ProductInfo";
import { useProductDetail } from "../../_context/products";
import { ProductPurchaseActions } from "../_components";
import { InfomationShop } from "../_components/InfomationShop";
import { ProductReviews } from "../_components/ProductReviews";
import Image from "next/image";
import { SectionPageComponents } from "@/features/SectionPageComponents";
import { PortalModal } from "@/features/PortalModal";

interface ProductDetailPageProps {
  productId?: string;
  isPreview?: boolean;
}
const RelatedProducts = dynamic(
  () =>
    import("../../_components/RelatedProducts").then(
      (mod) => mod.RelatedProducts
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <CustomSpinner />
      </div>
    ),
  }
);

const SimilarProducts = dynamic(
  () =>
    import("../../_components/SimilarProducts").then(
      (mod) => mod.SimilarProducts
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <CustomSpinner />
      </div>
    ),
  }
);

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bfbfbf" font-size="16">No image</text>
    </svg>`);

const resolveReviewMediaUrl = (media?: ReviewMediaResponse) => {
  if (!media) return "";
  const raw = media.url
    ? media.url
    : media.basePath && media.extension
    ? `${media.basePath}${media.extension}`
    : "";
  return toPublicUrl(raw || "");
};

export const ProductDetailPage = ({ productId, isPreview = false }: ProductDetailPageProps) => {
  const {
    product,
    loading,
    featured,
    selectedVariant,
    setSelectedVariant,
    primaryImage,
    galleryImages,
    setActiveThumbnail,
    productReviews,
    reviewSummary,
    reviewsLoading,
    reviewHasMore,
    loadMoreReviews,
    creatingShopChat,
    handleOpenShopChat,
    soldCount,
    followerCount,
  } = useProductDetail();
  const params = useParams() as { id: string };
  const [shopChatOpen, setShopChatOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [reviewPage, setReviewPage] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const REVIEWS_PAGE_SIZE = 3;

  const purchaseActionsRef = useRef<HTMLDivElement>(null);
  const hasAutoSelectedRef = useRef(false);
  useEffect(() => {
    if (
      !loading &&
      product &&
      product.variants &&
      product.variants.length > 0
    ) {
      if (!selectedVariant && !hasAutoSelectedRef.current) {
        const lowestPriceVariant = product.variants.reduce((prev, curr) => {
          return prev.price < curr.price ? prev : curr;
        });

        setSelectedVariant(lowestPriceVariant);
        hasAutoSelectedRef.current = true;
      }

      if (purchaseActionsRef.current) {
        const timer = setTimeout(() => {
          purchaseActionsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, product, selectedVariant, setSelectedVariant]);

  const hasVariantImage = (variant?: PublicProductVariantDTO | null) => {
    if (!variant) return false;
    return Boolean(
      variant.imageUrl || (variant.imageBasePath && variant.imageExtension)
    );
  };

  const STAR_LEVELS = [5, 4, 3, 2, 1];

  const ratingDistributionEntries = reviewSummary
    ? STAR_LEVELS.map((star) => ({
        star,
        count: reviewSummary.ratingDistribution?.[star] ?? 0,
        percentage: reviewSummary.ratingPercentage?.[star] ?? 0,
      }))
    : [];

  const { variantPrice, priceAfterVoucher, primaryPrice, comparePrice } =
    useMemo(() => {
      const currentVariant = selectedVariant || product;
      const vPrice =
        selectedVariant?.price !== undefined && selectedVariant?.price !== null
          ? selectedVariant.price
          : product?.priceMin ?? product?.basePrice ?? 0;
      const calculatePriceAfterVoucher = () => {
        if (!selectedVariant) {
          return (
            product?.priceAfterBestVoucher ??
            product?.priceAfterBestShopVoucher ??
            product?.priceAfterBestPlatformVoucher ??
            null
          );
        }

        if (selectedVariant && vPrice && vPrice > 0) {
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

          const { discountType, discountValue, discountAmount, maxDiscount } =
            bestVoucher;

          if (discountType === "PERCENTAGE" && discountValue) {
            let discount = (vPrice * discountValue) / 100;

            if (maxDiscount && maxDiscount > 0) {
              discount = Math.min(discount, maxDiscount);
            }

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
        (selectedVariant ? vPrice : product?.comparePrice) ??
        (product?.basePrice && product?.basePrice > pPrice
          ? product.basePrice
          : undefined);

      const finalComparePrice =
        pAfterVoucher && pAfterVoucher < vPrice ? vPrice : cPrice;

      return {
        variantPrice: vPrice,
        priceAfterVoucher: pAfterVoucher,
        primaryPrice: pPrice,
        comparePrice: finalComparePrice,
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
      maxDiscount,
    } = bestVoucher;

    const originalPrice = comparePrice ?? variantPrice;
    const finalPrice = priceAfterVoucher ?? variantPrice;
    const actualDiscount = originalPrice - finalPrice;

    let discountText = "";
    if (discountType === "PERCENTAGE" && discountValue) {
      discountText = `Giảm ${discountValue}%`;
      if (maxDiscount && maxDiscount > 0) {
        discountText += ` (Tối đa ${formatCompactNumber(maxDiscount)})`;
      }
    } else if (discountType === "FIXED_AMOUNT" && discountAmount) {
      if (discountAmount >= 1000) {
        discountText = `Giảm ${Math.round(discountAmount / 1000)}k`;
      } else {
        discountText = `Giảm ${formatPriceFull(discountAmount)}`;
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
    ? `${formatPriceFull(product!.priceMin!)} - ${formatPriceFull(
        product!.priceMax!
      )}`
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
                  img.onerror = null;
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

  useEffect(() => {
    setActiveThumbnail(null);
  }, [selectedVariant]);

  const breadcrumbItems = product
    ? [
        { title: "Trang chủ", href: "/" },
        { title: "Sản phẩm", href: "/products" },
        { title: product.name, href: `/products/${product.id}` },
      ]
    : [];

  return (
    <SectionPageComponents
      loading={loading || !product}
      loadingMessage="Đang tải chi tiết sản phẩm..."
      breadcrumbItems={breadcrumbItems}
      className="space-y-3"
    >
      {isPreview && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-4">
          <p className="text-amber-800 font-bold text-xs uppercase tracking-widest">
             👁️ Chế độ xem trước (Sản phẩm: {product?.approvalStatus})
          </p>
        </div>
      )}
      {product && (
        <>
          <CardComponents className="overflow-visible pt-2 shadow-custom transition-shadow">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
              <section className="space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
                  <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50">
                    <ImageWithPreview
                      src={primaryImage}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105"
                      onClick={() => setImagePreview(primaryImage)}
                    />
                  </div>
                </div>
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {galleryImages.slice(0, 5).map((img) => (
                      <div
                        key={img.key}
                        className={cn(
                          "relative aspect-square w-full rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-gray-50",
                          primaryImage === img.preview
                            ? "border-orange-500 scale-105 shadow-md z-10"
                            : "border-gray-200 hover:border-orange-300"
                        )}
                        onClick={() => {
                          setActiveThumbnail(img.preview);
                          if (img.key.startsWith("variant-")) {
                            const vId = img.key.replace("variant-", "");
                            const targetV = product.variants?.find(
                              (v) => v.id === vId
                            );
                            if (targetV) setSelectedVariant(targetV);
                          }
                        }}
                      >
                       <Image
                          src={img.thumb}
                          alt="thumbnail"
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div ref={purchaseActionsRef}>
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
                  formatPrice={formatPriceFull}
                  bestPlatformVoucher={bestPlatformVoucher}
                />
              </div>
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
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <ProductInfo product={product} selectedVariant={selectedVariant} />
            <FeaturedProductsSidebar products={featured} loading={loading} />
          </div>
          <div className="border-t border-gray-300 my-6" />
          <ProductReviews />
          <RelatedProducts
            shopId={product.shop?.shopId!}
            excludeProductId={product.id}
          />
          <SimilarProducts productId={product.id} />
        </>
      )}

      <CustomVideoModal
        open={Boolean(videoPreview)}
        videoUrl={videoPreview}
        onCancel={() => setVideoPreview(null)}
      />
      {imagePreview && (
       <PortalModal
        isOpen={Boolean(imagePreview)}
        onClose={() => setImagePreview(null)}
        width="max-w-4xl"
        className="bg-transparent shadow-none border-none"
      >
        <div className="flex items-center justify-center p-0 min-h-[50vh]">
          {imagePreview && (
            <div className="relative w-full aspect-square md:aspect-video">
              <Image
                src={imagePreview}
                alt="Product preview"
                fill
                className="object-contain"
                sizes="80vw"
              />
            </div>
          )}
        </div>
      </PortalModal>
      )}
    </SectionPageComponents>
  );
};
