import { PublicProductDetailDTO, PublicProductVariantDTO } from "@/types/product/public-product.dto";

export interface ProductPurchaseActionsProps {
    product: PublicProductDetailDTO;
    selectedVariant: PublicProductVariantDTO | null;
    setSelectedVariant: (variant: PublicProductVariantDTO | null) => void;
    reviewSummary: any;
    soldCount: any;
    formatCompactNumber: any;
    discountInfo: any;
    priceRangeLabel: string | null;
    primaryPrice: number;
    comparePrice: number | undefined;
    discountPercentage: number | null;
    priceAfterVoucher: number | null;
    formatPrice: (price: number) => string;
    bestPlatformVoucher: any;
}