import type {
  PublicProductDetailDTO,
  PublicProductVariantDTO,
} from "@/types/product/public-product.dto";

export type BreadcrumbItem = {
  title: string;
  href: string;
};

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export interface PricingProps {
  discountInfo?: any;
  priceRangeLabel?: string | null;
  primaryPrice: number;
  comparePrice?: number | null;
  discountPercentage?: number | null;
  priceAfterVoucher?: number | null;
  formatPrice: (price: number) => string;
}

export interface ProductInfoProps {
  product: PublicProductDetailDTO;
  selectedVariant: PublicProductVariantDTO | null;
}

export interface SpecEntry {
  key: string;
  label: string;
  value: string | number | undefined;
}
