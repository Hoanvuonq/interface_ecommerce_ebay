"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { publicProductService } from "@/services/products/product.service";
import { getProductReviewComments } from "@/services/review/review.service";
import { createConversation } from "@/services/chat";
import { ConversationType } from "@/types/chat/dto";
import { getStoredUserDetail } from "@/utils/jwt";
import { toast } from "sonner";
import type { 
  PublicProductDetailDTO, 
  PublicProductVariantDTO, 
  PublicProductListItemDTO 
} from "@/types/product/public-product.dto";
import type { 
  ReviewResponse, 
  ReviewStatisticsResponse 
} from "@/types/reviews/review.types";

interface ProductDetailContextType {
  product: PublicProductDetailDTO | null;
  loading: boolean;
  selectedVariant: PublicProductVariantDTO | null;
  setSelectedVariant: (v: PublicProductVariantDTO | null) => void;
  featured: PublicProductListItemDTO[];
  productReviews: ReviewResponse[];
  reviewSummary: ReviewStatisticsResponse | null;
  reviewsLoading: boolean;
  reviewHasMore: boolean;
  // Actions
  // handleOpenShopChat: () => Promise<void>;
  loadMoreReviews: () => void;
  creatingShopChat: boolean;
  // Computed values
  priceInfo: any; 
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined);

export const ProductDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams() as { id: string };
  const [product, setProduct] = useState<PublicProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<PublicProductListItemDTO[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<PublicProductVariantDTO | null>(null);
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewStatisticsResponse | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewHasMore, setReviewHasMore] = useState(false);
  const [creatingShopChat, setCreatingShopChat] = useState(false);

  // Logic xác định slug/ID
  const isSlug = useMemo(() => {
    const id = params.id;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return !uuidPattern.test(id) && !/^\d+$/.test(id) && /[a-zA-Z-]/.test(id);
  }, [params.id]);

  // Fetch Product & Reviews
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const p = isSlug 
        ? await publicProductService.getBySlug(params.id) 
        : await publicProductService.getById(params.id);
      
      const productData = (p as any)?.data || p;
      setProduct(productData);
      setReviewSummary(productData?.reviewStatistics ?? null);
      
      // Set default variant
      const defaultVariant = productData?.variants?.[0] || null;
      setSelectedVariant(defaultVariant);

      if (productData?.id) {
        fetchReviews(productData.id, 0, true);
        const feat = await publicProductService.getFeatured(0, 6);
        setFeatured(feat?.data?.content?.filter((x: any) => x.id !== productData.id) || []);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [params.id, isSlug]);

  const fetchReviews = async (id: string, page: number, reset: boolean) => {
    setReviewsLoading(true);
    try {
      const res = await getProductReviewComments(id, { page, size: 3 });
      setProductReviews(prev => reset ? res.content : [...prev, ...res.content]);
      setReviewHasMore(!res.last);
      setReviewPage(page);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  // Logic tính toán giá (Price Logic)
  const priceInfo = useMemo(() => {
    const vPrice = selectedVariant?.price ?? product?.priceMin ?? 0;
    const pAfterVoucher = product?.priceAfterBestVoucher ?? null; // Simplified for example
    return {
      primaryPrice: pAfterVoucher ?? vPrice,
      comparePrice: selectedVariant?.corePrice ?? product?.comparePrice,
      variantPrice: vPrice
    };
  }, [selectedVariant, product]);

  const handleOpenShopChat = async () => {
    const userDetail = getStoredUserDetail();
    if (!userDetail) return toast.warning("Vui lòng đăng nhập");
    
    setCreatingShopChat(true);
    try {
      await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [product?.shop?.userId!],
        name: product?.shop?.shopName,
      });
      // logic mở chat drawer
    } catch (e) {
      toast.error("Lỗi khởi tạo chat");
    } finally {
      setCreatingShopChat(false);
    }
  };

  return (
    <ProductDetailContext.Provider value={{
      product, loading, selectedVariant, setSelectedVariant,
      featured, productReviews, reviewSummary, reviewsLoading, reviewHasMore,
      creatingShopChat, priceInfo,
      loadMoreReviews: () => product && fetchReviews(product.id, reviewPage + 1, false)
    }}>
      {children}
    </ProductDetailContext.Provider>
  );
};

export const useProductDetail = () => {
  const context = useContext(ProductDetailContext);
  if (!context) throw new Error("useProductDetail must be used within ProductDetailProvider");
  return context;
};