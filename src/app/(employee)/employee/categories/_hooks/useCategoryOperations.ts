/**
 * useCategory Hook
 * Custom hook for Category Management
 */
"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import CategoryServiceManager from "../_services/category.service";
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../_types/dto/category.dto";

export function useCategoryManager() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { success: messageSuccess, error: messageError } = useToast();
  // ==================== FETCH ALL ====================

  const fetchCategories = useCallback(
    async (page: number = 0, size: number = 20) => {
      setLoading(true);
      try {
        const data = await CategoryServiceManager.getAll(page, size);
        setCategories(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        messageError(error.message || "Lỗi khi tải danh sách danh mục");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== FETCH TREE ====================

  const fetchCategoryTree = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CategoryServiceManager.getTree();
      setCategoryTree(data);
      return data;
    } catch (error: any) {
      messageError(error.message || "Lỗi khi tải cây danh mục");
      setCategoryTree([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH ROOT ====================

  const fetchRootCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CategoryServiceManager.getRootCategories();
      setCategories(data);
      return data;
    } catch (error: any) {
      messageError(error.message || "Lỗi khi tải danh mục gốc");
      setCategories([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH BY ID ====================

  const fetchCategoryById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await CategoryServiceManager.getById(id);
      return data;
    } catch (error: any) {
      messageError(error.message || "Lỗi khi tải thông tin danh mục");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH CHILDREN ====================

  const fetchChildren = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await CategoryServiceManager.getChildren(id);
      return data;
    } catch (error: any) {
      messageError(error.message || "Lỗi khi tải danh mục con");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== CREATE ====================

  const createCategory = useCallback(
    async (data: CreateCategoryRequest): Promise<boolean> => {
      setLoading(true);
      try {
        await CategoryServiceManager.create(data);
        messageSuccess("Tạo danh mục thành công!");
        return true;
      } catch (error: any) {
        messageError(error.message || "Lỗi khi tạo danh mục");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== UPDATE ====================

  const updateCategory = useCallback(
    async (
      id: string,
      data: UpdateCategoryRequest,
      etag: string,
    ): Promise<boolean> => {
      setLoading(true);
      try {
        await CategoryServiceManager.update(id, data, etag);
        messageSuccess("Cập nhật danh mục thành công!");
        return true;
      } catch (error: any) {
        if (error.response?.status === 409) {
          messageError(
            "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang!",
          );
        } else {
          messageError(error.message || "Lỗi khi cập nhật danh mục");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== DELETE ====================

  const deleteCategory = useCallback(
    async (id: string, etag: string): Promise<boolean> => {
      setLoading(true);
      try {
        // Check có children không
        const hasChildren = await CategoryServiceManager.hasChildren(id);
        if (hasChildren) {
          messageError(
            "Không thể xóa danh mục có danh mục con. Vui lòng xóa các danh mục con trước!",
          );
          return false;
        }

        // Check có products không
        const hasProducts = await CategoryServiceManager.hasProducts(id);
        if (hasProducts) {
          messageError(
            "Không thể xóa danh mục có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước!",
          );
          return false;
        }

        await CategoryServiceManager.delete(id, etag);
        messageSuccess("Xóa danh mục thành công!");
        return true;
      } catch (error: any) {
        if (error.response?.status === 409) {
          messageError(
            "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang!",
          );
        } else {
          messageError(error.message || "Lỗi khi xóa danh mục");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== VALIDATION ====================

  const checkHasChildren = useCallback(async (id: string): Promise<boolean> => {
    try {
      return await CategoryServiceManager.hasChildren(id);
    } catch (error: any) {
      messageError("Lỗi khi kiểm tra danh mục con");
      return false;
    }
  }, []);

  const checkHasProducts = useCallback(async (id: string): Promise<boolean> => {
    try {
      return await CategoryServiceManager.hasProducts(id);
    } catch (error: any) {
      messageError("Lỗi khi kiểm tra sản phẩm");
      return false;
    }
  }, []);

  return {
    // State
    loading,
    categories,
    categoryTree,
    totalElements,
    totalPages,

    // Methods
    fetchCategories,
    fetchCategoryTree,
    fetchRootCategories,
    fetchCategoryById,
    fetchChildren,
    createCategory,
    updateCategory,
    deleteCategory,
    checkHasChildren,
    checkHasProducts,
  };
}
