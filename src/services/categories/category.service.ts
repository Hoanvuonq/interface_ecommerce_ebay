import axios from "@/utils/axios.customize";
import { CreateCategoryRequest } from "@/types/categories/category.create";
import { UpdateCategoryRequest } from "@/types/categories/category.update";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CategorySummaryResponse } from "@/types/categories/category.summary";
import { CreateCategoryFeeRequest } from "@/types/categories/category-fee.create";
import { UpdateCategoryFeeRequest } from "@/types/categories/category-fee.update";
import { CategoryFeeResponse } from "@/types/categories/category-fee.detail";
import { CreateShopCategoryFeeRequest } from "@/types/categories/shop-category-fee.create";
import { UpdateShopCategoryFeeRequest } from "@/types/categories/shop-category-fee.update";
import { ShopCategoryFeeResponse } from "@/types/categories/shop-category-fee.detail";
import type { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT = 'v1/categories';
const CATEGORY_FEE_ENDPOINT = 'v1/category-fees';
const SHOP_CATEGORY_FEE_ENDPOINT = 'v1/shop-category-fees';

export interface GetCategoriesParams {
    page?: number;
    size?: number;
    sort?: string[];
}

export class CategoryService {
    static async getCategories(params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const baseEndpoint = `${API_ENDPOINT}/with-restrictions`;
        const url = `/${baseEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        return await axios.get(url);
    }

    /**
     * Tạo category mới
     */
    static async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<any>> {
        return await axios.post(`/${API_ENDPOINT}`, data);
    }

    /**
     * Cập nhật category
     */
    static async updateCategory(id: string, data: UpdateCategoryRequest, etag: string): Promise<ApiResponse<any>> {
        return await axios.put(`/${API_ENDPOINT}/${id}`, data, {
            headers: {
                'If-Match': etag
            }
        });
    }

    /**
     * Xóa category
     */
    static async deleteCategory(id: string, etag: string): Promise<ApiResponse<void>> {
        return await axios.delete(`/${API_ENDPOINT}/${id}`, {
            headers: {
                'If-Match': etag
            }
        });
    }

    /**
     * Lấy tất cả parent categories (cây danh mục)
     */
    static async getAllParents(): Promise<ApiResponse<CategoryResponse[]>> {
        return await axios.get(`/${API_ENDPOINT}/tree`);
    }

    /**
     * Lấy category theo ID
     */
    static async getCategoryById(id: string): Promise<ApiResponse<any>> {
        return await axios.get(`/${API_ENDPOINT}/${id}`);
    }

    /**
     * Lấy tất cả children của một parent category
     */
    static async getAllChildren(parentId: string): Promise<ApiResponse<CategoryResponse[]>> {
        return await axios.get(`/${API_ENDPOINT}/${parentId}/children`);
    }

    /**
     * Lấy lightweight category summaries (không có shipping restrictions)
     * GET /api/v1/categories/summary
     */
    static async getCategorySummaries(params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${API_ENDPOINT}/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy category tree với root categories và children
     * GET /api/v1/categories/tree
     */
    static async getCategoryTree(): Promise<ApiResponse<CategorySummaryResponse[]>> {
        return await axios.get(`/${API_ENDPOINT}/tree`);
    }

    /**
     * Lấy tất cả root categories (categories không có parent)
     * GET /api/v1/categories/root
     */
    static async getRootCategories(): Promise<ApiResponse<CategoryResponse[]>> {
        return await axios.get(`/${API_ENDPOINT}/root`);
    }

    /**
     * Lấy category theo slug
     * GET /api/v1/categories/slug/{slug}
     */
    static async getCategoryBySlug(slug: string): Promise<ApiResponse<CategoryResponse>> {
        return await axios.get(`/${API_ENDPOINT}/slug/${encodeURIComponent(slug)}`);
    }

    /**
     * Kiểm tra xem slug có tồn tại không
     * GET /api/v1/categories/check-slug/{slug}
     */
    static async checkSlugExists(slug: string): Promise<ApiResponse<boolean>> {
        return await axios.get(`/${API_ENDPOINT}/check-slug/${encodeURIComponent(slug)}`);
    }

    /**
     * Kiểm tra xem category có children không
     * GET /api/v1/categories/{id}/has-children
     */
    static async hasChildren(id: string): Promise<ApiResponse<boolean>> {
        return await axios.get(`/${API_ENDPOINT}/${id}/has-children`);
    }

    /**
     * Kiểm tra xem category có products không
     * GET /api/v1/categories/{id}/has-products
     */
    static async hasProducts(id: string): Promise<ApiResponse<boolean>> {
        return await axios.get(`/${API_ENDPOINT}/${id}/has-products`);
    }

    /**
     * Lấy parent của một category
     * GET /api/v1/categories/{id}/parent
     */
    static async getCategoryParent(id: string): Promise<ApiResponse<CategoryResponse>> {
        return await axios.get(`/${API_ENDPOINT}/${id}/parent`);
    }

    // ==================== CATEGORY FEE METHODS ====================

    /**
     * Tạo category fee mới
     */
    static async createCategoryFee(data: CreateCategoryFeeRequest): Promise<ApiResponse<CategoryFeeResponse>> {
        return await axios.post(`/${CATEGORY_FEE_ENDPOINT}`, data);
    }

    /**
     * Lấy category fee theo ID
     */
    static async getCategoryFeeById(id: string): Promise<ApiResponse<CategoryFeeResponse>> {
        return await axios.get(`/${CATEGORY_FEE_ENDPOINT}/${id}`);
    }

    /**
     * Cập nhật category fee
     */
    static async updateCategoryFee(id: string, data: UpdateCategoryFeeRequest, etag: string): Promise<ApiResponse<CategoryFeeResponse>> {
        return await axios.put(`/${CATEGORY_FEE_ENDPOINT}/${id}`, data, {
            headers: {
                'If-Match': etag
            }
        });
    }

    /**
     * Xóa category fee
     */
    static async deleteCategoryFee(id: string, etag: string): Promise<ApiResponse<void>> {
        return await axios.delete(`/${CATEGORY_FEE_ENDPOINT}/${id}`, {
            headers: {
                'If-Match': etag
            }
        });
    }

    /**
     * Lấy tất cả category fees với pagination
     */
    static async getCategoryFees(params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${CATEGORY_FEE_ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy category fees theo category ID
     */
    static async getCategoryFeesByCategoryId(categoryId: string, params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${CATEGORY_FEE_ENDPOINT}/category/${categoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy active category fees theo category ID
     */
    static async getActiveCategoryFees(categoryId: string): Promise<ApiResponse<CategoryFeeResponse[]>> {
        return await axios.get(`/${CATEGORY_FEE_ENDPOINT}/category/${categoryId}/active`);
    }

    /**
     * Lấy current active fee theo category ID
     */
    static async getCurrentActiveFee(categoryId: string): Promise<ApiResponse<CategoryFeeResponse>> {
        return await axios.get(`/${CATEGORY_FEE_ENDPOINT}/category/${categoryId}/current`);
    }

    // ==================== SHOP CATEGORY FEE METHODS ====================

    /**
     * Tạo shop category fee mới
     */
    static async createShopCategoryFee(data: CreateShopCategoryFeeRequest): Promise<ApiResponse<ShopCategoryFeeResponse>> {
        return await axios.post(`/${SHOP_CATEGORY_FEE_ENDPOINT}`, data);
    }

    /**
     * Lấy shop category fee theo ID
     */
    static async getShopCategoryFeeById(id: string): Promise<ApiResponse<ShopCategoryFeeResponse>> {
        return await axios.get(`/${SHOP_CATEGORY_FEE_ENDPOINT}/${id}`);
    }

    /**
     * Cập nhật shop category fee
     */
    static async updateShopCategoryFee(id: string, data: UpdateShopCategoryFeeRequest, etag: string): Promise<ApiResponse<ShopCategoryFeeResponse>> {
        return await axios.put(`/${SHOP_CATEGORY_FEE_ENDPOINT}/${id}`, data, {
            headers: {
                'If-Match': etag
            }
        });
    }

    /**
     * Xóa shop category fee
     */
    static async deleteShopCategoryFee(id: string, etag: string): Promise<ApiResponse<void>> {
        return await axios.delete(`/${SHOP_CATEGORY_FEE_ENDPOINT}/${id}`, {
            headers: {
                'If-Match': etag
            }
        });
    }

    /**
     * Lấy tất cả shop category fees với pagination
     */
    static async getShopCategoryFees(params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${SHOP_CATEGORY_FEE_ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy shop category fees theo shop ID
     */
    static async getShopCategoryFeesByShopId(shopId: string, params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${SHOP_CATEGORY_FEE_ENDPOINT}/shop/${shopId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy shop category fees theo category ID
     */
    static async getShopCategoryFeesByCategoryId(categoryId: string, params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${SHOP_CATEGORY_FEE_ENDPOINT}/category/${categoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy shop category fees theo shop ID và category ID
     */
    static async getShopCategoryFeesByShopAndCategory(shopId: string, categoryId: string, params?: GetCategoriesParams): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        if (params?.sort && params.sort.length > 0) {
            params.sort.forEach(sortField => {
                queryParams.append('sort', sortField);
            });
        }

        const url = `/${SHOP_CATEGORY_FEE_ENDPOINT}/shop/${shopId}/category/${categoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await axios.get(url);
    }

    /**
     * Lấy active shop category fees theo shop ID và category ID
     */
    static async getActiveShopCategoryFees(shopId: string, categoryId: string): Promise<ApiResponse<ShopCategoryFeeResponse[]>> {
        return await axios.get(`/${SHOP_CATEGORY_FEE_ENDPOINT}/shop/${shopId}/category/${categoryId}/active`);
    }

    /**
     * Lấy current active fee theo shop ID và category ID
     */
    static async getCurrentActiveShopFee(shopId: string, categoryId: string): Promise<ApiResponse<ShopCategoryFeeResponse>> {
        return await axios.get(`/${SHOP_CATEGORY_FEE_ENDPOINT}/shop/${shopId}/category/${categoryId}/current`);
    }

    // ==================== EXCEL EXPORT/IMPORT METHODS ====================

    /**
     * Export Category Fees to Excel
     * GET /api/v1/category-fees/export
     */
    static async exportCategoryFees(categoryId?: string): Promise<Blob> {
        const params: any = {};
        if (categoryId) {
            params.categoryId = categoryId;
        }
        const response = await axios.get(`/${CATEGORY_FEE_ENDPOINT}/export`, {
            params,
            responseType: 'blob',
        });
        // Axios interceptor already returns the blob directly when responseType is 'blob'
        // So response is already a Blob, not an AxiosResponse
        if (response instanceof Blob) {
            return response;
        }
        return response.data;
    }

    /**
     * Import Category Fees from Excel
     * Strict mode bắt buộc: chỉ import khi TẤT CẢ rows đều OK
     * POST /api/v1/category-fees/import
     */
    static async importCategoryFees(file: File): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('file', file);
        const response: ApiResponse<any> = await axios.post(`/${CATEGORY_FEE_ENDPOINT}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response ;
    }

    /**
     * Export Shop Category Fees to Excel
     * GET /api/v1/shop-category-fees/export
     */
    static async exportShopCategoryFees(shopId?: string, categoryId?: string): Promise<Blob> {
        const params: any = {};
        if (shopId) params.shopId = shopId;
        if (categoryId) params.categoryId = categoryId;
        const response = await axios.get(`/${SHOP_CATEGORY_FEE_ENDPOINT}/export`, {
            params,
            responseType: 'blob',
        });
        // Axios interceptor already returns the blob directly when responseType is 'blob'
        // So response is already a Blob, not an AxiosResponse
        if (response instanceof Blob) {
            return response;
        }
        return response.data;
    }

    /**
     * Import Shop Category Fees from Excel
     * POST /api/v1/shop-category-fees/import
     */
    static async importShopCategoryFees(file: File): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`/${SHOP_CATEGORY_FEE_ENDPOINT}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response as unknown as ApiResponse<any>;
    }

    /**
     * Export Categories to Excel
     * GET /api/v1/categories/export
     */
    static async exportCategories(): Promise<Blob> {
        const response = await axios.get(`/${API_ENDPOINT}/export`, {
            responseType: 'blob',
        });
        return response.data;
    }
}
