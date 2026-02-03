import {
  PublicProductMediaDTO,
  PublicProductOptionDTO,
} from "./public-product.dto";

export interface CreateUserProductMediaDTO {
  mediaAssetId?: string; // preferred normalized ID
  url?: string; // legacy / fallback path
  type: "IMAGE" | "VIDEO" | "AUDIO";
  title?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface CreateUserProductOptionValueDTO {
  id?: string;
  name: string;
  displayOrder?: number;
}

export interface CreateUserProductOptionDTO {
  id?: string;
  name: string;
  values: CreateUserProductOptionValueDTO[];
}

export interface VariantOptionSelection {
  optionId?: string;
  optionName: string;
  value: string;
}

export interface CreateUserProductVariantDTO {
  sku: string;
  imageExtension?: string;
  imageUrl?: string;
  imageAssetId?: string; // New field for normalized ID
  corePrice: number;
  price: number;
  stockQuantity: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
  options?: VariantOptionSelection[];
}

export interface CreateUserProductBulkDTO {
  name: string;
  description?: string;
  basePrice?: number; // Add this field
  categoryId: string;
  active: boolean;
  variants?: CreateUserProductVariantDTO[];
  media?: CreateUserProductMediaDTO[];
  options?: CreateUserProductOptionDTO[];
  allowedShippingChannels?: string[];
  saveAsDraft?: boolean; // true = DRAFT status, false = PENDING status
  replaceAllEntities?: boolean; // true = replace all variants/media/options on update
}
// ================== NEW: Detailed types matching BE response ==================
export interface UserProductVariantOptionValueDTO {
  id: string;
  name: string;
  displayOrder?: number;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  version?: number;
}

export interface UserProductVariantInventoryDTO {
  id: string;
  stock: number;
}

export interface UserProductVariantDTO {
  id: string;
  sku: string;
  imageBasePath?: string | null;
  imageExtension?: string | null; // e.g. ".jpg"
  imageUrl?: string | null; // e.g. "public/..._orig.jpg"
  corePrice: number;
  price: number;
  optionValues?: UserProductVariantOptionValueDTO[];
  inventory?: UserProductVariantInventoryDTO;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
  dimensionsString?: string;
  weightString?: string;
  volumeCm3?: number;
  weightKg?: number;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  version: number;
}

export interface UserProductMediaDTO {
  id: string;
  mediaAssetId?: string | null;
  basePath?: string | null;
  extension?: string | null;
  url?: string | null; 
  type: "IMAGE" | "VIDEO" | "AUDIO";
  title?: string | null;
  altText?: string | null;
  sortOrder?: number | null;
  isPrimary?: boolean;
  productId?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  version?: number;
}

export interface UserProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  active: boolean;
  approvalStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  approvedAt?: string;
  category: { id: string; name: string; slug?: string } & Partial<{
    description: string;
    active: boolean;
    imageBasePath: string | null;
    imageExtension: string | null;
    parent: any;
    children: any[] | null;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    version: number;
  }>;
  media?: UserProductMediaDTO[];
  options?: PublicProductOptionDTO[];
  variants?: UserProductVariantDTO[];
  reviews?: any[];
  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  version: number;
}

// Update Product DTOs
export interface UpdateUserProductDTO {
  name?: string;
  slug?: string;
  description?: string;

  categoryId?: string;
  active?: boolean;
}

export interface UpdateUserProductBulkDTO {
  name: string;
  // slug is auto-generated from name by backend
  description?: string;
  basePrice?: number; // Add this field
  categoryId: string;
  active: boolean;
  variants?: CreateUserProductVariantDTO[];
  media?: CreateUserProductMediaDTO[];
  options?: CreateUserProductOptionDTO[];

  saveAsDraft?: boolean; // true = DRAFT status, false = PENDING status
  replaceAllEntities?: boolean; // true = replace all variants/media/options on update
}

// Response DTOs
export interface ProductBulkResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  active: boolean;
  approvalStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  approvedAt?: string;
  category: { id: string; name: string; slug?: string } & Partial<{
    description: string;
    active: boolean;
    imageBasePath: string | null;
    imageExtension: string | null;
    parent: any;
    children: any[] | null;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    version: number;
  }>;
  media?: UserProductMediaDTO[];
  options?: PublicProductOptionDTO[];
  variants?: UserProductVariantDTO[];
  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  version: number;
}

// Statistics DTO
export interface UserProductStatisticsDTO {
  totalProducts: number;
  draftProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}
// Search Query DTO
export interface UserProductSearchQueryDTO {
  keyword?: string;
  categoryId?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  status?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  page?: number;
  size?: number;
}
