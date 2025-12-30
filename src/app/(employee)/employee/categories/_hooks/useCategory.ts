"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import categoryService from "../_services/category.service";
import _ from "lodash";
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../_types/dto/category.dto";
import { useMemo } from "react";

export function useCategory(page: number = 0, size: number = 20) {
  const queryClient = useQueryClient();
  const { error: toastError, success: toastSuccess } = useToast();

  const categoriesQuery = useQuery({
    queryKey: ["categories", page, size],
    queryFn: () => categoryService.getAll(page, size),
    placeholderData: (previousData) => previousData,
  });

  const categoryTreeQuery = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      const data = await categoryService.getTree();
      return _.sortBy(data, ["name"]);
    },
  });

  // Logic Statistics gom vào hook
  const stats = useMemo(() => {
    const flatten = (nodes: CategoryResponse[]): CategoryResponse[] => {
      return nodes.reduce((acc: CategoryResponse[], node) => {
        return acc.concat(node, node.children ? flatten(node.children) : []);
      }, []);
    };
    const all = flatten(categoryTreeQuery.data || []);
    return {
      total: all.length,
      active: all.filter(c => c.active).length,
      inactive: all.filter(c => !c.active).length,
    };
  }, [categoryTreeQuery.data]);

  // Mutations logic
  const handleConcurrencyError = (err: any) => {
    if (err.response?.status === 409) {
      toastError("Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại!");
    } else {
      toastError(err.message || "Đã có lỗi xảy ra");
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: () => {
      toastSuccess("Tạo danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: handleConcurrencyError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data, etag }: { id: string; data: UpdateCategoryRequest; etag: string }) =>
      categoryService.update(id, data, etag),
    onSuccess: () => {
      toastSuccess("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: handleConcurrencyError,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, etag }: { id: string; etag: string }) => {
      const [hasChildren, hasProducts] = await Promise.all([
        categoryService.hasChildren(id),
        categoryService.hasProducts(id),
      ]);
      if (hasChildren) throw new Error("Danh mục có danh mục con, không thể xóa!");
      if (hasProducts) throw new Error("Danh mục có sản phẩm, không thể xóa!");
      return categoryService.delete(id, etag);
    },
    onSuccess: () => {
      toastSuccess("Xóa danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) => toastError(err.message),
  });

  return {
    categories: categoriesQuery.data?.content || [],
    categoryTree: categoryTreeQuery.data || [],
    stats,
    isLoading: categoriesQuery.isLoading || categoryTreeQuery.isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isSubmitting: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
}