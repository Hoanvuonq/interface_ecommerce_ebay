import { PublicProductDetailDTO, PublicProductListItemDTO } from "@/types/product/public-product.dto";

export type ProductWithVariants =
  | PublicProductDetailDTO
  | (PublicProductListItemDTO & { variants?: Array<{ id: string }> });

export interface ProductSectionProps {
  type: "featured" | "sale" | "new";
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badgeType?: "new" | "hot" | "sale" | "featured";
  showBadge?: boolean;
  columns?: { mobile?: number; tablet?: number; desktop?: number };
  rows?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  sidebar?: React.ReactNode;
}