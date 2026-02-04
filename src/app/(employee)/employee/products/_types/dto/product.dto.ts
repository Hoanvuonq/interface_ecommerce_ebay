import { ApprovalStatus, MediaType } from "../product.type";

export interface GetAllProductsAdmin {
  keyword?: string;
  categoryId?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  approvalStatus?: ApprovalStatus;
  userId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface RejectProductRequest {
  reason: string;
}

export interface ParamRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  active: boolean;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  category: CategoryResponse;
  variants: ProductVariantResponse[];
  media: ProductMediaResponse[];
  options: ProductOptionResponse[];
  totalReviews: number;
  averageRating: number;
  shop?: {
    id: string;
    name: string;
    logo?: string;
  };

  // Audit fields
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}

export interface ProductVariantResponse {
  id: string;
  sku: string;
  imagePath: string;
  corePrice: number;
  price: number;
  optionValues: ProductOptionValueResponse[];
  inventory: InventoryResponse;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightGrams: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}

export interface ProductOptionResponse {
  id: string;
  name: string;
  values: ProductOptionValueResponse[];

  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}

export interface ProductOptionValueResponse {
  id: string;
  name: string;
  displayOrder: number;

  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}

export interface ProductMediaResponse {
  id: string;
  url: string;
  type: MediaType;
  title: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  productId: string;

  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}

export interface InventoryResponse {
  id?: string;
  stock?: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  parent?: CategoryResponse | null;
  children: CategoryResponse[];

  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}

// Statistics DTOs
export interface ProductStatisticsResponse {
  // Basic product counts
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  deletedProducts: number;

  // Approval status counts
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;

  // Time-based statistics
  productsCreatedToday: number;
  productsApprovedToday: number;
  productsRejectedToday: number;
  productsCreatedThisWeek: number;
  productsCreatedThisMonth: number;

  // User-specific statistics (for user dashboard)
  userTotalProducts: number;
  userActiveProducts: number;
  userPendingProducts: number;
  userApprovedProducts: number;
  userRejectedProducts: number;

  // Category distribution
  productsByCategory: Record<string, number>;

  // Price range statistics
  averagePrice: number;
  minPrice: number;
  maxPrice: number;

  // Metadata
  generatedAt: string;
  generatedBy: string;
}
