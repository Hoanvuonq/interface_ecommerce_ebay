/**
 * Category Management DTOs
 * Base URL: /api/v1/categories
 */

// ==================== RESPONSE DTO ====================

export interface CategoryResponse {
  // Basic Information
  id: string; // Snowflake ID
  name: string; // Tên danh mục (max 255 ký tự)
  slug: string; // URL-friendly name
  description?: string; // Mô tả (max 5000 ký tự)
  active: boolean; // Trạng thái hoạt động

  // Relationships
  parent?: CategoryResponse; // Danh mục cha (null nếu là root)
  children?: CategoryResponse[]; // Danh mục con

  // Audit Fields
  createdBy?: string; // User tạo
  createdDate?: string; // ISO 8601 datetime
  lastModifiedBy?: string; // User sửa cuối
  lastModifiedDate?: string; // ISO 8601 datetime
  version: number; // Version cho ETag (bắt đầu từ 1)
}

// ==================== REQUEST DTOs ====================

export interface CreateCategoryRequest {
  name: string; // Bắt buộc, max 255 ký tự
  // slug không còn cho phép nhập từ FE - sẽ được BE tự sinh từ name
  description?: string; // Tùy chọn, max 5000 ký tự
  parentId?: string; // Tùy chọn (null = root category)
  active?: boolean; // Tùy chọn, default = true
}

export interface UpdateCategoryRequest {
  name: string; // Bắt buộc, max 255 ký tự
  slug: string; // Bắt buộc, max 255 ký tự, unique
  description?: string; // Tùy chọn, max 5000 ký tự
  active: boolean; // Bắt buộc
  parentId?: string; // Tùy chọn (dùng để move category)
}

// ==================== PAGINATION DTO ====================

export interface PageDto<T> {
  content: T[]; // Danh sách items
  pageable: {
    pageNumber: number; // Page hiện tại (0-based)
    pageSize: number; // Số items per page
    sort?: {
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number; // Tổng số items
  totalPages: number; // Tổng số pages
  last: boolean; // Page cuối?
  first: boolean; // Page đầu?
  size: number;
  number: number;
  numberOfElements: number; // Số items trong page hiện tại
}

// ==================== API RESPONSE WRAPPER ====================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

// ==================== TREE NODE (cho UI) ====================

export interface CategoryTreeNode extends CategoryResponse {
  key: string; // Ant Design Tree cần key
  title: string; // Ant Design Tree cần title
  value: string; // Ant Design TreeSelect cần value
  label?: string; // Ant Design TreeSelect label
}
