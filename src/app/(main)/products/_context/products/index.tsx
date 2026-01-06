"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { createConversation } from "@/app/(chat)/_services";
import { publicProductService } from "@/services/products/product.service";
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
} from "@/types/reviews/review.types";

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
  fetchProductReviews: (productId: string, page?: number, reset?: boolean) => Promise<void>;
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

// --- HÀM TÍNH GIÁ VOUCHER (Tách ra để dùng lại) ---
const calculatePriceWithVoucher = (price: number, voucher: any) => {
  if (!voucher) return price;

  let discount = 0;
  if (voucher.discountType === "PERCENTAGE") {
    discount = (price * (voucher.discountValue || 0)) / 100;
    if (voucher.maxDiscount && voucher.maxDiscount > 0) {
      discount = Math.min(discount, voucher.maxDiscount);
    }
  } else {
    discount = voucher.discountAmount || 0;
  }

  return Math.max(0, price - discount);
};

export const ProductDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams() as { id: string };
  const { warning, error: toastError } = useToast();

  // State
  const [product, setProduct] = useState<PublicProductDetailDTO | null>(null);
  const [featured, setFeatured] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] =
    useState<PublicProductVariantDTO | null>(null);

  // Review State
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewHasMore, setReviewHasMore] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Chat & UI State
  const [creatingShopChat, setCreatingShopChat] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState<string | null>(null);

  // 1. Identify if ID is slug or UUID/ID
  const isSlug = useMemo(() => {
    const id = params.id;
    if (!id) return false;
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(id)) return false;
    if (/^\d+$/.test(id)) return false;
    return /[a-zA-Z-]/.test(id);
  }, [params.id]);

  // 2. Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = isSlug
        ? await publicProductService.getBySlug(params.id)
        : await publicProductService.getById(params.id);

      const data = "data" in res ? (res as any).data : res;
      setProduct(data);

      // --- LOGIC CHỌN BIẾN THỂ GIÁ TỐT NHẤT ---
      if (data?.variants && data.variants.length > 0) {
        const bestVoucher = data.bestShopVoucher ?? data.bestPlatformVoucher;

        const bestVariant = data.variants.reduce((prev: any, curr: any) => {
          const prevPrice = prev.price ?? 0;
          const currPrice = curr.price ?? 0;

          const prevFinal =
            prev.priceAfterDiscount ??
            calculatePriceWithVoucher(prevPrice, bestVoucher);
          const currFinal =
            curr.priceAfterDiscount ??
            calculatePriceWithVoucher(currPrice, bestVoucher);

          return currFinal < prevFinal ? curr : prev;
        });

        setSelectedVariant(bestVariant);
      } else {
        setSelectedVariant(null);
      }

      if (data?.id) {
        const [rev, featRes] = await Promise.all([
          getProductReviewComments(data.id, { page: 0, size: 3 }),
          publicProductService.getFeatured(0, 6),
        ]);

        setProductReviews(rev.content || []);
        setReviewHasMore(!rev.last);

        const featList = featRes?.data?.content || [];
        setFeatured(featList.filter((p: any) => p.id !== data.id));
      }
    } catch (e) {
      console.error("Failed to fetch product data", e);
    } finally {
      setLoading(false);
    }
  }, [params.id, isSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Review Functions
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
        size: 3, // Khớp với size bạn test
      });

      const content = res?.content ?? [];

      setProductReviews((prev) => {
        if (reset) return content;
        const existingIds = new Set(prev.map((item) => item.id));
        const merged = content.filter((item) => !existingIds.has(item.id));
        return [...prev, ...merged];
      });

      setReviewPage(res?.page ?? page);
      setReviewHasMore(!res?.last); // res.last là true nếu là trang cuối
    } catch (error) {
      console.error("Failed to load product reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };
  // 4. Shop Chat Logic
  const handleOpenShopChat = async (): Promise<void> => {
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
      if (!response?.success) {
        toastError(response?.message || "Lỗi khởi tạo chat");
      }
    } catch (error) {
      toastError("Không thể kết nối server chat");
    } finally {
      setCreatingShopChat(false);
    }
  };

  // 5. Price Info
  const priceInfo = useMemo(() => {
    const vPrice = selectedVariant?.price ?? product?.priceMin ?? 0;
    const bestVoucher =
      product?.bestShopVoucher ?? product?.bestPlatformVoucher;

    let pAfterVoucher: number | null =
      (selectedVariant as any)?.priceAfterDiscount ?? null;

    if (pAfterVoucher === null && bestVoucher) {
      pAfterVoucher = calculatePriceWithVoucher(vPrice, bestVoucher);
    }

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

  // 6. Gallery Logic
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
        if (url) {
          addImage(
            `media-${m.id}`,
            resolveMediaUrlHelper(m as any, "_thumb") || url,
            url
          );
        }
      });

    product.variants?.forEach((v) => {
      const url = resolveVariantImageUrlHelper(v as any, "_large");
      if (url) {
        addImage(
          `variant-${v.id}`,
          resolveVariantImageUrlHelper(v as any, "_thumb") || url,
          url
        );
      }
    });

    return items;
  }, [product]);

  const primaryImage = useMemo(() => {
    if (activeThumbnail) return activeThumbnail;
    const vImg = resolveVariantImageUrlHelper(selectedVariant as any, "_large");
    if (vImg && vImg !== "/placeholder-product.png") return vImg;
    return galleryImages[0]?.preview || PLACEHOLDER_IMAGE;
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
    fetchProductReviews, // Added to context value
    creatingShopChat,
    handleOpenShopChat,
    activeThumbnail,
    setActiveThumbnail,
    galleryImages,
    primaryImage,
    priceInfo,
    soldCount: (product as any)?.soldCount ?? (product as any)?.totalSold ?? 0,
    followerCount: (product?.shop as any)?.followerCount ?? 0,
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
    throw new Error(
      "useProductDetail must be used within ProductDetailProvider"
    );
  return context;
};
