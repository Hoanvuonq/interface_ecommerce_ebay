import request from "@/utils/axios.customize";
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PageDto,
  ApiResponse,
} from "../_types/dto/category.dto";

const CATEGORY_API_BASE = "/v1/categories";

class CategoryService {

  private getIfMatchHeader(etag?: string) {
    if (!etag) return "";
    return `"${etag.replace(/"/g, "")}"`;
  }
  async create(
    data: CreateCategoryRequest,
  ): Promise<ApiResponse<CategoryResponse>> {
    return request({ url: CATEGORY_API_BASE, method: "POST", data });
  }

  async getById(id: string): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> = await request({
      url: `${CATEGORY_API_BASE}/${id}`,
      method: "GET",
    });
    return response.data!;
  }

  async getParent(id: string): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> = await request({
      url: `${CATEGORY_API_BASE}/${id}/parent`,
      method: "GET",
    });
    return response.data!;
  }

  async getChildren(id: string): Promise<CategoryResponse[]> {
    const response: ApiResponse<CategoryResponse[]> = await request({
      url: `${CATEGORY_API_BASE}/${id}/children`,
      method: "GET",
    });
    return response.data || [];
  }

  async getAll(
    page: number = 0,
    size: number = 20,
  ): Promise<PageDto<CategoryResponse>> {
    const response: ApiResponse<PageDto<CategoryResponse>> = await request({
      url: CATEGORY_API_BASE,
      method: "GET",
      params: {
        page,
        size,
      },
    });
    return response.data!;
  }

  async getTree(): Promise<CategoryResponse[]> {
    const response: ApiResponse<CategoryResponse[]> = await request({
      url: `${CATEGORY_API_BASE}/tree`,
      method: "GET",
    });
    return response.data || [];
  }

  async getRootCategories(): Promise<CategoryResponse[]> {
    const response: ApiResponse<CategoryResponse[]> = await request({
      url: `${CATEGORY_API_BASE}/root`,
      method: "GET",
    });
    return response.data || [];
  }

 async update(id: string, data: UpdateCategoryRequest, etag: string) {
    const ifMatch = this.getIfMatchHeader(etag);
    if (ifMatch === '""' || !ifMatch) {
      throw new Error("Mã phiên bản (ETag) bị thiếu hoặc không hợp lệ");
    }

    return request({
      url: `${CATEGORY_API_BASE}/${id}`,
      method: "PUT",
      data,
      headers: {
        "If-Match": ifMatch,
      },
    });
  }

  async delete(id: string, etag: string) {
    return request({
      url: `${CATEGORY_API_BASE}/${id}`,
      method: "DELETE",
      headers: {
        "If-Match": this.getIfMatchHeader(etag),
      },
    });
  }
  async hasChildren(id: string): Promise<boolean> {
    const response: ApiResponse<boolean> = await request({
      url: `${CATEGORY_API_BASE}/${id}/has-children`,
      method: "GET",
    });
    return response.data || false;
  }

  async hasProducts(id: string): Promise<boolean> {
    const response: ApiResponse<boolean> = await request({
      url: `${CATEGORY_API_BASE}/${id}/has-products`,
      method: "GET",
    });
    return response.data || false;
  }

  buildTree(categories: CategoryResponse[]): CategoryResponse[] {
    const map: {
      [key: string]: CategoryResponse;
    } = {};
    const roots: CategoryResponse[] = [];

    categories.forEach((cat) => {
      map[cat.id] = {
        ...cat,
        children: [],
      };
    });

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

  findInTree(
    tree: CategoryResponse[],
    predicate: (cat: CategoryResponse) => boolean,
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
