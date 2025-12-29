"use client";

import { useToast } from "@/hooks/useToast";
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
  ReviewResponse,
  ReviewStatisticsResponse,
} from "@/types/reviews/review.types";
import { getStoredUserDetail } from "@/utils/jwt";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";
import { useParams } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bfbfbf" font-size="16">No image</text></svg>`
  );

interface ProductDetailContextType {
  product: PublicProductDetailDTO | null;
  loading: boolean;
  featured: PublicProductListItemDTO[];
  selectedVariant: PublicProductVariantDTO | null;
  setSelectedVariant: (v: PublicProductVariantDTO | null) => void;
  productReviews: ReviewResponse[];
  reviewSummary: ReviewStatisticsResponse | null;
  reviewsLoading: boolean;
  reviewHasMore: boolean;
  loadMoreReviews: () => Promise<void>;
  creatingShopChat: boolean;
  handleOpenShopChat: () => Promise<void>;
  galleryImages: any[];
  primaryImage: string;
  activeThumbnail: string | null;
  setActiveThumbnail: (url: string | null) => void;
  bestPlatformVoucher?: any;
  priceInfo: {
    variantPrice: number;
    priceAfterVoucher: number | null;
    primaryPrice: number;
    comparePrice: number | undefined;
    discountPercentage: number | null;
    priceRangeLabel: string | null;
  };
  soldCount: number | string;
  followerCount: number | string;
}

const ProductDetailContext = createContext<
  ProductDetailContextType | undefined
>(undefined);

export const ProductDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams() as { id: string };
  const [product, setProduct] = useState<PublicProductDetailDTO | null>(null);
  const [featured, setFeatured] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] =
    useState<PublicProductVariantDTO | null>(null);
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewHasMore, setReviewHasMore] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [creatingShopChat, setCreatingShopChat] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState<string | null>(null);

  const { success, error: Error, warning } = useToast();
  const isSlug = useMemo(() => {
    const id = params.id;
    if (!id) return false;
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(id)) return false;
    if (/^\d+$/.test(id)) return false;
    return /[a-zA-Z-]/.test(id);
  }, [params.id]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = isSlug
        ? await publicProductService.getBySlug(params.id)
        : await publicProductService.getById(params.id);

      const data = (res as any)?.data || res;
      setProduct(data);

      const defaultV =
        data?.variants?.find(
          (v: any) => v.imageUrl || (v.imageBasePath && v.imageExtension)
        ) ??
        data?.variants?.[0] ??
        null;
      setSelectedVariant(defaultV);

      if (data?.id) {
        const rev = await getProductReviewComments(data.id, {
          page: 0,
          size: 3,
        });
        setProductReviews(rev.content || []);
        setReviewHasMore(!rev.last);

        const featRes = await publicProductService.getFeatured(0, 6);
        const featList = featRes?.data?.content || [];
        setFeatured(featList.filter((p: any) => p.id !== data.id));
      }
    } catch (e) {
      // Error("Không tìm thấy sản phẩm");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params.id, isSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Logic Shop Chat (Copy từ code cũ sang)
  const handleOpenShopChat = async (): Promise<void> => {
    const userDetail = getStoredUserDetail();
    if (!userDetail?.userId) {
      warning("Vui lòng đăng nhập để chat với Shop");
      return;
    }
    const shopUserId = product?.shop?.userId;
    if (!shopUserId) {
      Error("Không xác định được Shop");
      return;
    }

    setCreatingShopChat(true);
    try {
      const response = await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [shopUserId],
        name: product?.shop?.shopName,
      });
      if (!response?.success) {
        Error(response?.message || "Lỗi khởi tạo chat");
      }
    } catch (error) {
      Error("Không thể kết nối server chat");
    } finally {
      setCreatingShopChat(false);
    }
  };

  // 4. Logic Load More Reviews
  const loadMoreReviews = async (): Promise<void> => {
    if (!product?.id || reviewsLoading) return;
    const nextPage = reviewPage + 1;
    setReviewsLoading(true);
    try {
      const res = await getProductReviewComments(product.id, {
        page: nextPage,
        size: 3,
      });
      setProductReviews((prev) => [...prev, ...res.content]);
      setReviewPage(nextPage);
      setReviewHasMore(!res.last);
    } finally {
      setReviewsLoading(false);
    }
  };

  const priceInfo = useMemo(() => {
    const vPrice = selectedVariant?.price ?? product?.priceMin ?? 0;
    const calculateVoucherPrice = () => {
      if (!selectedVariant) return product?.priceAfterBestVoucher ?? null;
      const bestVoucher =
        product?.bestShopVoucher ?? product?.bestPlatformVoucher;
      if (!bestVoucher) return null;
      if (bestVoucher.discountType === "PERCENTAGE")
        return Math.max(
          0,
          vPrice - (vPrice * bestVoucher.discountValue!) / 100
        );
      return Math.max(0, vPrice - (bestVoucher.discountAmount ?? 0));
    };
    const pAfterVoucher = calculateVoucherPrice();
    const pPrice = pAfterVoucher ?? vPrice;
    const cPrice = selectedVariant?.corePrice ?? product?.comparePrice;

    return {
      variantPrice: vPrice,
      priceAfterVoucher: pAfterVoucher,
      primaryPrice: pPrice,
      comparePrice: cPrice,
      discountPercentage:
        cPrice && cPrice > pPrice
          ? Math.round(((cPrice - pPrice) / cPrice) * 100)
          : null,
      priceRangeLabel:
        product?.priceMin !== product?.priceMax
          ? `₫${product?.priceMin} - ₫${product?.priceMax}`
          : null,
    };
  }, [selectedVariant, product]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const items: any[] = [];
    product.media
      ?.filter((m) => m.type === "IMAGE")
      .forEach((m) => {
        const url = resolveMediaUrlHelper(m as any, "_large");
        items.push({
          key: `media-${m.id}`,
          thumb: resolveMediaUrlHelper(m as any, "_thumb") || url,
          preview: url,
        });
      });
    product.variants?.forEach((v) => {
      const url = resolveVariantImageUrlHelper(v as any, "_large");
      if (url)
        items.push({
          key: `variant-${v.id}`,
          thumb: resolveVariantImageUrlHelper(v as any, "_thumb") || url,
          preview: url,
        });
    });
    return items.filter(
      (v, i, a) => a.findIndex((t) => t.preview === v.preview) === i
    );
  }, [product]);

  const primaryImage = useMemo(() => {
    if (activeThumbnail) return activeThumbnail;
    const vImg = resolveVariantImageUrlHelper(selectedVariant as any, "_large");
    return vImg && vImg !== "/placeholder-product.png"
      ? vImg
      : galleryImages[0]?.preview || PLACEHOLDER_IMAGE;
  }, [activeThumbnail, selectedVariant, galleryImages]);

  useEffect(() => {
    setActiveThumbnail(null);
  }, [selectedVariant]);

  const value = {
    product,
    loading,
    featured,
    selectedVariant,
    setSelectedVariant,
    productReviews,
    reviewSummary: product?.reviewStatistics || null,
    reviewsLoading,
    reviewHasMore,
    loadMoreReviews,
    creatingShopChat,
    handleOpenShopChat,
    activeThumbnail,
    setActiveThumbnail,
    galleryImages,
    primaryImage,
    priceInfo,
    soldCount: (product as any)?.soldCount ?? (product as any)?.totalSold ?? 0,
    followerCount: (product as any)?.shop?.followerCount ?? 0,
    bestPlatformVoucher: product?.bestPlatformVoucher,
  };

  return (
    <ProductDetailContext.Provider value={value}>
      {children}
    </ProductDetailContext.Provider>
  );
};

export const useProductDetail = () => {
  const context = useContext(ProductDetailContext);
  if (!context)
    throw new Error("useProductDetail must be used within Provider");
  return context;
};
