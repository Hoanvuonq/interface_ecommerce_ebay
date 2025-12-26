import { useState } from "react";
import { CreateCategoryRequest } from "@/types/categories/category.create";
import { UpdateCategoryRequest } from "@/types/categories/category.update";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CategoryService,GetCategoriesParams  } from "@/services/categories/category.service";

interface CacheEntry<T> {
    data: T | null;
    timestamp: number;
    loading: boolean;
}

let parentCategoriesCache: CacheEntry<CategoryResponse[]> = {
    data: null,
    timestamp: 0,
    loading: false,
};

const CACHE_TTL = 30000; 

const isCacheFresh = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_TTL;
};

export const invalidateParentCategoriesCache = () => {
    console.log('🗑️  [Cache] Invalidating parent categories cache');
    parentCategoriesCache = {
        data: null,
        timestamp: 0,
        loading: false,
    };
};

export const useContentTable = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleGetCategories = async (params?: GetCategoriesParams): Promise<any> => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.getCategories(params);
            return res;
        } catch (err: any) {
            setError(err?.message || "Lấy danh mục thất bại");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleGetCategories, loading, error };
};


export const useCreateCategory = (data: CreateCategoryRequest) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateCategory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.createCategory(data);
            return res;
        } catch (err: any) {
            setError(err?.message || "Tạo danh mục thất bại");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateCategory, loading, error };
};

export const useUpdateCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateCategory = async (id: string, data: UpdateCategoryRequest, etag: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.updateCategory(id, data, etag);
            return res;
        } catch (err: any) {
            setError(err?.message || "Cập nhật danh mục thất bại");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdateCategory, loading, error };
};

export const useDeleteCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteCategory = async (id: string, etag: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.deleteCategory(id, etag);
            return res;
        } catch (err: any) {
            setError(err?.message || "Xóa danh mục thất bại");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleDeleteCategory, loading, error };
};

export const useGetAllParents = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetAllParents = async (): Promise<CategoryResponse[] | null> => {
        // Kiểm tra cache còn fresh không
        if (isCacheFresh(parentCategoriesCache.timestamp) && parentCategoriesCache.data) {
            console.log('📦 [useGetAllParents] Using cached data');
            return parentCategoriesCache.data;
        }

        // Nếu đang loading (request khác đang chạy), đợi
        if (parentCategoriesCache.loading) {
            console.log('⏳ [useGetAllParents] Already loading, waiting...');
            // Polling wait cho đến khi loading xong
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!parentCategoriesCache.loading) {
                        clearInterval(checkInterval);
                        resolve(parentCategoriesCache.data);
                    }
                }, 100);

                // Timeout sau 5s
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve(null);
                }, 5000);
            });
        }

        // Bắt đầu loading - set flag để các request khác biết
        parentCategoriesCache.loading = true;
        setLoading(true);
        setError(null);

        console.log('🚀 [useGetAllParents] Fetching fresh data from API...');

        try {
            const res = await CategoryService.getAllParents();
            const data = res.data;

            // Update cache
            parentCategoriesCache = {
                data: data,
                timestamp: Date.now(),
                loading: false,
            };

            console.log('✅ [useGetAllParents] Data fetched and cached', data?.length || 0, 'items');

            return data;
        } catch (err: any) {
            parentCategoriesCache.loading = false;
            const errorMessage = err?.message || "không thành công";
            setError(errorMessage);
            console.error('❌ [useGetAllParents] Error:', errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }
    return { handleGetAllParents, loading, error };
}


export const useGetCategoryById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetCategoryById = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.getCategoryById(id);
            return res;
        } catch (err: any) {
            setError(err?.message || "không thành công");
            return null;
        } finally {
            setLoading(false);
        }
    }
    return { handleGetCategoryById, loading, error };
}

export const useGetAllChildren = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetAllChildren = async (parentId: string): Promise<CategoryResponse[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.getAllChildren(parentId);
            return res.data;
        } catch (err: any) {
            setError(err?.message || "Lấy danh sách con thất bại");
            return null;
        } finally {
            setLoading(false);
        }
    }
    return { handleGetAllChildren, loading, error };
}
