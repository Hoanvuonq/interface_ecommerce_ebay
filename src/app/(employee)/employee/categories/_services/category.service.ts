/**
 * Category Service
 * API Base URL: /api/v1/categories
 */

import request from "@/utils/axios.customize";
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PageDto,
  ApiResponse,
}  from "../_types/dto/category.dto";

const CATEGORY_API_BASE = "/v1/categories";

class CategoryService {
  // ==================== CREATE ====================

  /**
   * Tạo danh mục mới (root hoặc subcategory)
   * POST /api/v1/categories
   */
  async create(
    data: CreateCategoryRequest
  ): Promise<ApiResponse<CategoryResponse>> {
    return request({
      url: CATEGORY_API_BASE,
      method: "POST",
      data,
    });
  }

  // ==================== READ ====================

  /**
   * Lấy danh mục theo ID
   * GET /api/v1/categories/{id}
   * Response có ETag header
   */
  async getById(id: string): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> = await request({
      url: `${CATEGORY_API_BASE}/${id}`,
      method: "GET",
    });
    return response.data!;
  }

  /**
   * Lấy danh mục cha
   * GET /api/v1/categories/{id}/parent
   */
  async getParent(id: string): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> = await request({
      url: `${CATEGORY_API_BASE}/${id}/parent`,
      method: "GET",
    });
    return response.data!;
  }

  /**
   * Lấy danh sách danh mục con trực tiếp
   * GET /api/v1/categories/{id}/children
   */
  async getChildren(id: string): Promise<CategoryResponse[]> {
    const response: ApiResponse<CategoryResponse[]> = await request({
      url: `${CATEGORY_API_BASE}/${id}/children`,
      method: "GET",
    });
    return response.data || [];
  }

  /**
   * Lấy danh sách tất cả danh mục (phân trang)
   * GET /api/v1/categories?page=0&size=20
   */
  async getAll(
    page: number = 0,
    size: number = 20
  ): Promise<PageDto<CategoryResponse>> {
    const response: ApiResponse<PageDto<CategoryResponse>> = await request({
      url: CATEGORY_API_BASE,
      method: "GET",
      params: { page, size },
    });
    return response.data!;
  }

  /**
   * Lấy cây danh mục đầy đủ (recursive)
   * GET /api/v1/categories/tree
   */
  async getTree(): Promise<CategoryResponse[]> {
    const response: ApiResponse<CategoryResponse[]> = await request({
      url: `${CATEGORY_API_BASE}/tree`,
      method: "GET",
    });
    return response.data || [];
  }

  /**
   * Lấy danh sách danh mục root (không có parent)
   * GET /api/v1/categories/root
   */
  async getRootCategories(): Promise<CategoryResponse[]> {
    const response: ApiResponse<CategoryResponse[]> = await request({
      url: `${CATEGORY_API_BASE}/root`,
      method: "GET",
    });
    return response.data || [];
  }

  // ==================== UPDATE ====================

  /**
   * Cập nhật danh mục (cần ETag)
   * PUT /api/v1/categories/{id}
   * Requires If-Match header with ETag value
   */
  async update(
    id: string,
    data: UpdateCategoryRequest,
    etag: string
  ): Promise<ApiResponse<CategoryResponse>> {
    return request({
      url: `${CATEGORY_API_BASE}/${id}`,
      method: "PUT",
      data,
      headers: {
        "If-Match": `"${etag}"`,
      },
    });
  }

  // ==================== DELETE ====================

  /**
   * Xóa danh mục (soft delete)
   * DELETE /api/v1/categories/{id}
   * Requires If-Match header
   * Không thể xóa nếu có children hoặc products
   */
  async delete(id: string, etag: string): Promise<ApiResponse<void>> {
    return request({
      url: `${CATEGORY_API_BASE}/${id}`,
      method: "DELETE",
      headers: {
        "If-Match": `"${etag}"`,
      },
    });
  }

  // ==================== VALIDATION CHECKS ====================

  /**
   * Kiểm tra danh mục có children không
   * GET /api/v1/categories/{id}/has-children
   */
  async hasChildren(id: string): Promise<boolean> {
    const response: ApiResponse<boolean> = await request({
      url: `${CATEGORY_API_BASE}/${id}/has-children`,
      method: "GET",
    });
    return response.data || false;
  }

  /**
   * Kiểm tra danh mục có products không
   * GET /api/v1/categories/{id}/has-products
   */
  async hasProducts(id: string): Promise<boolean> {
    const response: ApiResponse<boolean> = await request({
      url: `${CATEGORY_API_BASE}/${id}/has-products`,
      method: "GET",
    });
    return response.data || false;
  }

  // ==================== HELPER METHODS ====================

  /**
   * Helper: Build category tree từ flat list
   * Frontend utility để chuyển đổi flat list thành tree structure
   */
  buildTree(categories: CategoryResponse[]): CategoryResponse[] {
    const map: { [key: string]: CategoryResponse } = {};
    const roots: CategoryResponse[] = [];

    // Create map
    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    // Build tree
    categories.forEach((cat) => {
      if (cat.parent?.id && map[cat.parent.id]) {
        if (!map[cat.parent.id].children) {
          map[cat.parent.id].children = [];
        }
        map[cat.parent.id].children!.push(map[cat.id]);
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  }

  /**
   * Helper: Flatten tree thành list
   */
  flattenTree(tree: CategoryResponse[]): CategoryResponse[] {
    const result: CategoryResponse[] = [];

    const traverse = (nodes: CategoryResponse[]) => {
      nodes.forEach((node) => {
        result.push(node);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(tree);
    return result;
  }

  /**
   * Helper: Find category trong tree
   */
  findInTree(
    tree: CategoryResponse[],
    predicate: (cat: CategoryResponse) => boolean
  ): CategoryResponse | null {
    for (const node of tree) {
      if (predicate(node)) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findInTree(node.children, predicate);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}

export default new CategoryService();
