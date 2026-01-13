import { request } from "@/utils/axios.customize";
import { ApiResponseDTO, PageDTO, PageableDTO } from "@/types/pagination.dto";
import {
  PublicProductDetailDTO,
  PublicProductListItemDTO,
  PublicProductSearchQueryDTO,
} from "@/types/product/public-product.dto";
import {
  ProductVariantDTO,
  SyncProductVariantsDTO,
  UpdateProductVariantDTO,
  UpsertProductVariantsDTO,
} from "@/types/product/product-variant.dto";
import {
  CreateProductOptionDTO,
  ProductOptionDTO,
  SyncProductOptionsDTO,
  UpdateProductOptionDTO,
} from "@/types/product/product-option.dto";
import {
  BulkUpdateProductMediaDTO,
  ProductMediaDTO,
} from "@/types/product/product-media.dto";
import {
  AdminApproveResponseDTO,
  AdminProductListItemDTO,
  AdminProductStatisticsDTO,
  AdminRejectRequestDTO,
  AdminRejectResponseDTO,
  AdminToggleActiveRequestDTO,
  AdminToggleActiveResponseDTO,
  AdminApprovalStatsDTO,
} from "@/types/product/admin-product.dto";
import {
  CreateUserProductBulkDTO,
  UpdateUserProductDTO,
  UpdateUserProductBulkDTO,
  UserProductDTO,
  ProductBulkResponseDTO,
  UserProductStatisticsDTO,
  UserProductSearchQueryDTO,
} from "@/types/product/user-product.dto";

// Helpers
const withIfMatch = (version?: number) =>
  version !== undefined
    ? { headers: { "If-Match": String(version) } }
    : undefined;

const API_ENDPOINT_PUBLIC_PRODUCTS = "v1/public/products";

export const publicProductService = {
  getById(id: string) {
    return request<ApiResponseDTO<PublicProductDetailDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/${id}`,
    });
  },

  getBySlug(slug: string) {
    return request<ApiResponseDTO<PublicProductDetailDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/slug/${encodeURIComponent(slug)}`,
    });
  },

  search(params: PublicProductSearchQueryDTO) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/search`,
      params,
    });
  },

  getFeatured(page = 0, size = 10) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/featured`,
      params: { page, size },
    });
  },

  getByCategory(categoryId: string, page = 0, size = 20) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/category/${categoryId}`,
      params: { page, size },
    });
  },

  getByCategorySlug(slug: string, page = 0, size = 20) {
    // Normalize: decode first (handles already-encoded like %20), then encode once
    const decoded = (() => {
      try {
        return decodeURIComponent((slug || "").trim());
      } catch {
        return (slug || "").trim();
      }
    })();
    const clean = encodeURIComponent(decoded);
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/category/slug/${clean}`,
      params: { page, size },
    });
  },

  getByShop(shopId: string, page = 0, size = 20) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/shop/${shopId}`,
      params: { page, size },
    });
  },

  getRelated(productId: string, page = 0, size = 8) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/${productId}/related`,
      params: { page, size },
    });
  },

  getSale(page = 0, size = 20) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/sale`,
      params: { page, size },
    });
  },

  getNew(page = 0, size = 20) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/new`,
      params: { page, size },
    });
  },

  getPromoted(page = 0, size = 20) {
    return request<ApiResponseDTO<PageDTO<PublicProductListItemDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PUBLIC_PRODUCTS}/promoted`,
      params: { page, size },
    });
  },
};

// =========================
// Variants APIs (auth required)
// Base on BE: /api/v1/products/{productId}/variants → with axios baseURL, prefix is /products
// =========================
const API_ENDPOINT_PRODUCTS = "v1/products";
export const productVariantService = {
  list(productId: string, pageable?: Partial<PageableDTO>) {
    return request<ApiResponseDTO<PageDTO<ProductVariantDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/variants`,
      params: pageable,
    });
  },

  upsert(productId: string, payload: UpsertProductVariantsDTO) {
    return request<ApiResponseDTO<ProductVariantDTO[]>>({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/variants`,
      data: payload,
    });
  },

  get(productId: string, variantId: string) {
    return request<ApiResponseDTO<ProductVariantDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/variants/${variantId}`,
    });
  },

  update(
    productId: string,
    variantId: string,
    body: UpdateProductVariantDTO,
    version: number
  ) {
    return request<ApiResponseDTO<ProductVariantDTO>>({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/variants/${variantId}`,
      data: body,
      ...(withIfMatch(version) as object),
    });
  },

  remove(productId: string, variantId: string) {
    return request<ApiResponseDTO<{ message: string }>>({
      method: "DELETE",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/variants/${variantId}`,
    });
  },

  sync(productId: string, payload: SyncProductVariantsDTO, version: number) {
    return request<
      ApiResponseDTO<{
        addedVariants: Array<
          Pick<
            ProductVariantDTO,
            "id" | "sku" | "name" | "price" | "stock" | "version"
          >
        >;
        updatedVariants: Array<
          Pick<
            ProductVariantDTO,
            "id" | "sku" | "name" | "price" | "stock" | "version"
          >
        >;
        deletedVariants: string[];
        version: number;
      }>
    >({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/variants`,
      data: payload,
      ...(withIfMatch(version) as object),
    });
  },
};

// =========================
// Options APIs (auth required)
// =========================
export const productOptionService = {
  list(productId: string, pageable?: Partial<PageableDTO>) {
    return request<ApiResponseDTO<PageDTO<ProductOptionDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/options`,
      params: pageable,
    });
  },

  create(productId: string, payload: CreateProductOptionDTO) {
    return request<ApiResponseDTO<ProductOptionDTO>>({
      method: "POST",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/options`,
      data: payload,
    });
  },

  get(productId: string, optionId: string) {
    return request<ApiResponseDTO<ProductOptionDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/options/${optionId}`,
    });
  },

  update(
    productId: string,
    optionId: string,
    body: UpdateProductOptionDTO,
    version: number
  ) {
    return request<ApiResponseDTO<ProductOptionDTO>>({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/options/${optionId}`,
      data: body,
      ...(withIfMatch(version) as object),
    });
  },

  remove(productId: string, optionId: string) {
    return request<ApiResponseDTO<{ message: string }>>({
      method: "DELETE",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/options/${optionId}`,
    });
  },

  sync(productId: string, payload: SyncProductOptionsDTO, version: number) {
    return request<
      ApiResponseDTO<{
        addedOptions: Array<
          Pick<
            ProductOptionDTO,
            "id" | "name" | "type" | "required" | "order" | "version"
          >
        >;
        updatedOptions: Array<
          Pick<
            ProductOptionDTO,
            "id" | "name" | "type" | "required" | "order" | "version"
          >
        >;
        deletedOptions: string[];
        version: number;
      }>
    >({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/options`,
      data: payload,
      ...(withIfMatch(version) as object),
    });
  },
};

// =========================
// Media APIs (auth required)
// =========================
export const productMediaService = {
  list(productId: string, pageable?: Partial<PageableDTO>) {
    return request<ApiResponseDTO<PageDTO<ProductMediaDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/media`,
      params: pageable,
    });
  },

  bulkUpdate(
    productId: string,
    body: Omit<BulkUpdateProductMediaDTO, "productId">,
    version: number
  ) {
    return request<
      ApiResponseDTO<{
        addedImages: ProductMediaDTO[];
        addedVideos: ProductMediaDTO[];
        deletedMediaIds: string[];
        totalAdded: number;
        totalDeleted: number;
        version: number;
        status: string;
        message: string;
      }>
    >({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/media`,
      data: { productId, ...body },
      ...(withIfMatch(version) as object),
    });
  },

  get(productId: string, mediaId: string) {
    return request<ApiResponseDTO<ProductMediaDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/media/${mediaId}`,
    });
  },

  remove(productId: string, mediaId: string) {
    return request<ApiResponseDTO<{ message: string }>>({
      method: "DELETE",
      url: `/${API_ENDPOINT_PRODUCTS}/${productId}/media/${mediaId}`,
    });
  },
};

// =========================
// Admin Product APIs (auth ADMIN)
// Note: Admin base path is not under /api/v1, so we pass absolute "/api/admin/products"
// =========================
const API_ENDPOINT_ADMIN_PRODUCTS = "v1/admin/products";
export const adminProductService = {
  getPending(page = 0, size = 20) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/pending`,
      params: { page, size },
    });
  },

  approve(id: string, version: number) {
    return request<AdminApproveResponseDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/${id}/approve`,
      ...(withIfMatch(version) as object),
    });
  },

  reject(id: string, version: number, body: AdminRejectRequestDTO) {
    return request<AdminRejectResponseDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/${id}/reject`,
      data: body,
      ...(withIfMatch(version) as object),
    });
  },

  setActive(id: string, version: number, body: AdminToggleActiveRequestDTO) {
    return request<AdminToggleActiveResponseDTO>({
      method: "PUT",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/${id}/active`,
      data: body,
      ...(withIfMatch(version) as object),
    });
  },

  getAll(page = 0, size = 20) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}`,
      params: { page, size },
    });
  },

  getDeleted(page = 0, size = 20) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/deleted`,
      params: { page, size },
    });
  },

  restore(id: string) {
    return request<AdminApproveResponseDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/${id}/restore`,
    });
  },

  remove(id: string) {
    return request<void>({
      method: "DELETE",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/${id}`,
    });
  },

  search(params: {
    keyword?: string;
    categoryId?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    active?: boolean;
    approvalStatus?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
    userId?: string;
    page?: number;
    size?: number;
  }) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "POST",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/search`,
      data: params,
    });
  },

  getByUser(userId: string, page = 0, size = 20) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/user/${userId}`,
      params: { page, size },
    });
  },

  getByShop(shopId: string, page = 0, size = 20) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/shop/${shopId}`,
      params: { page, size },
    });
  },

  getStatistics() {
    return request<AdminProductStatisticsDTO>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/counts`,
    });
  },

  getApprovalStatistics() {
    return request<AdminApprovalStatsDTO>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/statistics/approval`,
    });
  },

  getAttention(page = 0, size = 20) {
    return request<PageDTO<AdminProductListItemDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/attention`,
      params: { page, size },
    });
  },
};

// =========================
// User Product APIs (seller)
// Base: /api/v1/user/products → with axios baseURL, prefix is /user/products
// =========================
const API_ENDPOINT_USER_PRODUCTS = "v1/user/products";
const API_ENDPOINT_PRODUCTS_VARIANTS = "v1/products";

export const userProductService = {
  // ============================== CRUD OPERATIONS ==============================

  /**
   * Create product in bulk with all related data
   * POST /api/v1/user/products/bulk
   */
  createBulk(payload: CreateUserProductBulkDTO) {
    return request<ProductBulkResponseDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/bulk`,
      data: payload,
    });
  },

  /**
   * Get user's product by ID
   * GET /api/v1/user/products/{id}
   */
  getById(id: string) {
    return request<ApiResponseDTO<UserProductDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}`,
    }).then((res: any) => {
      // Handle response structure: { code, success, message, data: { ... } }
      if (res && typeof res === "object" && "data" in res) {
        return res.data;
      }
      // Fallback: if response is already the data object
      return res;
    });
  },

  /**
   * Get all products of current user
   * GET /api/v1/user/products
   */
  getAllProducts(page = 0, size = 20) {
    return request<ApiResponseDTO<PageDTO<UserProductDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/search`,

      data: {
        page: page,
        size: size,
      },
    });
  },

  /**
   * Get user's products by status
   * GET /api/v1/user/products/status/{status}
   */
  getByStatusAdmin(
    status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED",
    page = 0,
    size = 20
  ) {
    return request<ApiResponseDTO<PageDTO<UserProductDTO>>>({
      method: "GET",
      url: `/${API_ENDPOINT_ADMIN_PRODUCTS}/status/${status}`,
      params: { page, size },
    });
  },

  /**
   * Update product basic information
   * PUT /api/v1/user/products/{id}
   */
  update(id: string, payload: UpdateUserProductDTO, version: number) {
    return request<UserProductDTO>({
      method: "PUT",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}`,
      data: payload,
      ...(withIfMatch(version) as object),
    });
  },

  /**
   * Update product in bulk with all related data
   * PUT /api/v1/user/products/{id}/bulk
   */
  updateBulk(id: string, payload: UpdateUserProductBulkDTO, version: number) {
    return request<ProductBulkResponseDTO>({
      method: "PUT",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}/bulk`,
      data: payload,
      ...(withIfMatch(version) as object),
    });
  },

  /**
   * Delete product (soft delete)
   * DELETE /api/v1/user/products/{id}
   */
  delete(id: string, version: number) {
    return request<void>({
      method: "DELETE",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}`,
      ...(withIfMatch(version) as object),
    });
  },

  // ============================== PRODUCT MANAGEMENT ==============================

  /**
   * Submit product for admin approval
   * POST /api/v1/user/products/{id}/submit
   */
  submitForApproval(id: string, version: number) {
    return request<UserProductDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}/submit`,
      ...(withIfMatch(version) as object),
    });
  },

  /**
   * Publish/activate approved product
   * POST /api/v1/user/products/{id}/publish
   */
  publish(id: string, version: number) {
    return request<UserProductDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}/publish`,
      ...(withIfMatch(version) as object),
    });
  },

  /**
   * Unpublish/deactivate product
   * POST /api/v1/user/products/{id}/unpublish
   */
  unpublish(id: string, version: number) {
    return request<UserProductDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}/unpublish`,
      ...(withIfMatch(version) as object),
    });
  },

  /**
   * Duplicate/copy existing product
   * POST /api/v1/user/products/{id}/duplicate
   */
  duplicate(id: string) {
    return request<UserProductDTO>({
      method: "POST",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/${id}/duplicate`,
    });
  },

  // ============================== SEARCH & STATISTICS ==============================

  /**
   * Search within user's own products
   * GET /api/v1/user/products/search
   * @deprecated Use getAll or getByStatus instead
   */
  search(params: UserProductSearchQueryDTO) {
    return request<PageDTO<UserProductDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/search`,
      params,
    });
  },

  /**
   * Get product counts for current user
   * GET /api/v1/user/products/counts
   */
  getStatistics() {
    return request<UserProductStatisticsDTO>({
      method: "GET",
      url: `/${API_ENDPOINT_USER_PRODUCTS}/counts`,
    });
  },

  // ============================== VARIANT OPERATIONS ==============================

  /**
   * Update a specific variant
   * PUT /api/v1/products/{productId}/variants/{variantId}
   */

  updateVariant(
    productId: string,
    variantId: string,
    payload: UpdateProductVariantDTO,
    version: number
  ) {
    return request<ProductVariantDTO>({
      method: "PUT",
      url: `/${API_ENDPOINT_PRODUCTS_VARIANTS}/${productId}/variants/${variantId}`,
      data: payload,
      ...(withIfMatch(version) as object),
    });
  },
};

// =========================
// Rich Text Paragraph APIs (seller)
// Base: /api/v1/user/products/{productId}/rich-text-paragraphs
// =========================
import {
  CreateRichTextParagraphDTO,
  OrderItemDTO,
  ReorderParagraphsDTO,
  RichTextParagraphDTO,
  UpdateRichTextParagraphDTO,
} from "@/types/product/rich-text-paragraph.dto";

export const richTextParagraphService = {
  /**
   * Get all paragraphs for a product (ordered by displayOrder)
   * GET /api/v1/user/products/{productId}/rich-text-paragraphs
   */
  list(productId: string) {
    return request<ApiResponseDTO<RichTextParagraphDTO[]>>({
      method: "GET",
      url: `/v1/user/products/${productId}/rich-text-paragraphs`,
    });
  },

  /**
   * Create a new paragraph
   * POST /api/v1/user/products/{productId}/rich-text-paragraphs
   */
  create(productId: string, payload: CreateRichTextParagraphDTO) {
    return request<ApiResponseDTO<RichTextParagraphDTO>>({
      method: "POST",
      url: `/v1/user/products/${productId}/rich-text-paragraphs`,
      data: payload,
    });
  },

  /**
   * Update an existing paragraph
   * PUT /api/v1/user/products/{productId}/rich-text-paragraphs/{id}
   */
  update(
    productId: string,
    paragraphId: string,
    payload: UpdateRichTextParagraphDTO
  ) {
    return request<ApiResponseDTO<RichTextParagraphDTO>>({
      method: "PUT",
      url: `/v1/user/products/${productId}/rich-text-paragraphs/${paragraphId}`,
      data: payload,
    });
  },

  /**
   * Delete a paragraph
   * DELETE /api/v1/user/products/{productId}/rich-text-paragraphs/{id}
   */
  delete(productId: string, paragraphId: string) {
    return request<ApiResponseDTO<void>>({
      method: "DELETE",
      url: `/v1/user/products/${productId}/rich-text-paragraphs/${paragraphId}`,
    });
  },

  /**
   * Reorder paragraphs
   * POST /api/v1/user/products/{productId}/rich-text-paragraphs/reorder
   */
  reorder(productId: string, items: OrderItemDTO[]) {
    return request<ApiResponseDTO<RichTextParagraphDTO[]>>({
      method: "POST",
      url: `/v1/user/products/${productId}/rich-text-paragraphs/reorder`,
      data: { items },
    });
  },

  /**
   * Batch create paragraphs
   * POST /api/v1/user/products/{productId}/rich-text-paragraphs/batch
   */
  batchCreate(productId: string, paragraphs: CreateRichTextParagraphDTO[]) {
    return request<ApiResponseDTO<RichTextParagraphDTO[]>>({
      method: "POST",
      url: `/v1/user/products/${productId}/rich-text-paragraphs/batch`,
      data: paragraphs,
    });
  },

  /**
   * Delete all paragraphs for a product
   * DELETE /api/v1/user/products/{productId}/rich-text-paragraphs
   */
  deleteAll(productId: string) {
    return request<ApiResponseDTO<void>>({
      method: "DELETE",
      url: `/v1/user/products/${productId}/rich-text-paragraphs`,
    });
  },
};
