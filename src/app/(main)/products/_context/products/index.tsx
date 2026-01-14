"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { createConversation } from "@/app/(chat)/_services";
import {
  publicProductService,
  userProductService,
} from "@/services/products/product.service";
import { getProductReviewComments } from "@/services/review/review.service";
import { ConversationType } from "@/app/(chat)/_types/chat.dto";
import { getStoredUserDetail } from "@/utils/jwt";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";

// Types
import type {
  PublicProductDetailDTO,
  PublicProductListItemDTO,
  PublicProductVariantDTO,
} from "@/types/product/public-product.dto";
import type {
  ReviewResponse,
  ReviewStatisticsResponse,
} from "@/app/(shop)/shop/reviews/_types/review.types";

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
  fetchProductReviews: (
    productId: string,
    page?: number,
    reset?: boolean
  ) => Promise<void>;
  creatingShopChat: boolean;
  handleOpenShopChat: () => Promise<void>;
  galleryImages: { key: string; thumb: string; preview: string }[];
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

const calculatePriceWithVoucher = (price: number, voucher: any) => {
  if (!voucher) return price;
  let discount = 0;
  if (voucher.discountType === "PERCENTAGE") {
    discount = (price * (voucher.discountValue || 0)) / 100;
    if (voucher.maxDiscount && voucher.maxDiscount > 0)
      discount = Math.min(discount, voucher.maxDiscount);
  } else {
    discount = voucher.discountAmount || 0;
  }
  return Math.max(0, price - discount);
};

export const ProductDetailProvider = ({
  children,
  productId: propProductId,
  mode = "public",
}: {
  children: React.ReactNode;
  productId?: string;
  mode?: "public" | "admin";
}) => {
  const params = useParams() as { id: string };
  const { warning, error: toastError } = useToast();

  const isInitialMount = useRef(true);
  const targetId = propProductId || params.id;

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

  const isSlug = useMemo(() => {
    if (mode === "admin" || !targetId) return false;
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return (
      !uuidPattern.test(targetId) &&
      !/^\d+$/.test(targetId) &&
      /[a-zA-Z-]/.test(targetId)
    );
  }, [targetId, mode]);

  const fetchData = useCallback(async () => {
    if (!targetId) return;
    try {
      if (isInitialMount.current) setLoading(true);

      let res;
      if (mode === "admin") {
        res = await userProductService.getById(targetId);
      } else {
        res = isSlug
          ? await publicProductService.getBySlug(targetId)
          : await publicProductService.getById(targetId);
      }

      const data = res?.data || res;
      setProduct(data);

      // FIX: Chỉ setSelectedVariant lần đầu tiên khi data trả về
      if (data?.variants?.length > 0 && isInitialMount.current) {
        const bestVoucher = data.bestShopVoucher ?? data.bestPlatformVoucher;
        const bestVariant = data.variants.reduce((prev: any, curr: any) => {
          const prevFinal =
            prev.priceAfterDiscount ??
            calculatePriceWithVoucher(prev.price || 0, bestVoucher);
          const currFinal =
            curr.priceAfterDiscount ??
            calculatePriceWithVoucher(curr.price || 0, bestVoucher);
          return currFinal < prevFinal ? curr : prev;
        });
        setSelectedVariant(bestVariant);
      }

      if (data?.id && isInitialMount.current) {
        const [revRes, featRes] = await Promise.all([
          getProductReviewComments(data.id, { page: 0, size: 3 }),
          publicProductService.getFeatured(0, 6),
        ]);
        if (revRes) {
          setProductReviews(revRes.content || []);
          setReviewHasMore(!revRes.last);
        }
        if (featRes?.data?.content) {
          setFeatured(
            featRes.data.content.filter((p: any) => p.id !== data.id)
          );
        }
      }
      isInitialMount.current = false;
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
    // QUAN TRỌNG: Loại bỏ setSelectedVariant khỏi deps để tránh loop
  }, [targetId, isSlug, mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchProductReviews = useCallback(
    async (productId: string, page = 0, reset = false) => {
      if (!productId) return;
      setReviewsLoading(true);
      try {
        const res = await getProductReviewComments(productId, {
          page,
          size: 3,
        });
        const content = res?.content ?? [];
        setProductReviews((prev) => {
          if (reset) return content;
          const existingIds = new Set(prev.map((item) => item.id));
          return [
            ...prev,
            ...content.filter((item) => !existingIds.has(item.id)),
          ];
        });
        setReviewPage(res?.page ?? page);
        setReviewHasMore(!res?.last);
      } catch (error) {
        console.error(error);
      } finally {
        setReviewsLoading(false);
      }
    },
    []
  );

  const loadMoreReviews = useCallback(async () => {
    if (!product?.id || reviewsLoading) return;
    await fetchProductReviews(product.id, reviewPage + 1);
  }, [product?.id, reviewsLoading, reviewPage, fetchProductReviews]);

  const handleOpenShopChat = useCallback(async () => {
    const userDetail = getStoredUserDetail();
    if (!userDetail?.userId) {
      warning("Vui lòng đăng nhập để chat với Shop");
      return;
    }
    const shopUserId = product?.shop?.userId;
    if (!shopUserId) {
      toastError("Không xác định được Shop");
      return;
    }
    setCreatingShopChat(true);
    try {
      const response = await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [shopUserId],
        name: product?.shop?.shopName,
      });
      if (!response?.success)
        toastError(response?.message || "Lỗi khởi tạo chat");
    } catch (error) {
      toastError("Không thể kết nối server chat");
    } finally {
      setCreatingShopChat(false);
    }
  }, [product, warning, toastError]);

  const priceInfo = useMemo(() => {
    const vPrice = selectedVariant?.price ?? product?.priceMin ?? 0;
    const bestVoucher =
      product?.bestShopVoucher ?? product?.bestPlatformVoucher;
    let pAfterVoucher = (selectedVariant as any)?.priceAfterDiscount ?? null;
    if (pAfterVoucher === null && bestVoucher)
      pAfterVoucher = calculatePriceWithVoucher(vPrice, bestVoucher);
    const pPrice = pAfterVoucher ?? vPrice;
    const cPrice =
      pAfterVoucher && pAfterVoucher < vPrice
        ? vPrice
        : selectedVariant?.corePrice ?? product?.comparePrice;

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
    const items: { key: string; thumb: string; preview: string }[] = [];
    const seenUrls = new Set<string>();
    const addImage = (key: string, thumb: string, preview: string) => {
      if (!seenUrls.has(preview)) {
        seenUrls.add(preview);
        items.push({ key, thumb, preview });
      }
    };
    product.media
      ?.filter((m) => m.type === "IMAGE")
      .forEach((m) => {
        const url = resolveMediaUrlHelper(m as any, "_large");
        if (url)
          addImage(
            `media-${m.id}`,
            resolveMediaUrlHelper(m as any, "_thumb") || url,
            url
          );
      });
    product.variants?.forEach((v) => {
      const url = resolveVariantImageUrlHelper(v as any, "_large");
      if (url)
        addImage(
          `variant-${v.id}`,
          resolveVariantImageUrlHelper(v as any, "_thumb") || url,
          url
        );
    });
    return items;
  }, [product]);

  const primaryImage = useMemo(() => {
    if (activeThumbnail) return activeThumbnail;
    const vImg = resolveVariantImageUrlHelper(selectedVariant as any, "_large");
    if (vImg && vImg !== "/placeholder-product.png") return vImg;
    return galleryImages[0]?.preview || PLACEHOLDER_IMAGE;
  }, [activeThumbnail, selectedVariant, galleryImages]);

  const value = useMemo(
    () => ({
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
      fetchProductReviews,
      creatingShopChat,
      handleOpenShopChat,
      activeThumbnail,
      setActiveThumbnail,
      galleryImages,
      primaryImage,
      priceInfo,
      soldCount:
        (product as any)?.soldCount ?? (product as any)?.totalSold ?? 0,
      followerCount: (product?.shop as any)?.followerCount ?? 0,
      bestPlatformVoucher: product?.bestPlatformVoucher,
    }),
    [
      product,
      loading,
      featured,
      selectedVariant,
      productReviews,
      reviewsLoading,
      reviewHasMore,
      loadMoreReviews,
      fetchProductReviews,
      creatingShopChat,
      handleOpenShopChat,
      activeThumbnail,
      galleryImages,
      primaryImage,
      priceInfo,
    ]
  );

  return (
    <ProductDetailContext.Provider value={value}>
      {children}
    </ProductDetailContext.Provider>
  );
};

export const useProductDetail = () => {
  const context = useContext(ProductDetailContext);
  if (!context)
    throw new Error(
      "useProductDetail must be used within ProductDetailProvider"
    );
  return context;
};
