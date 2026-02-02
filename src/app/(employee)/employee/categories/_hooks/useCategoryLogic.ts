/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useCategoryFormStore } from "../_store/categoryStore";
import categoryService from "../_services/category.service";
import { useToast } from "@/hooks/useToast";

export const useCategoryLogic = (onSuccess?: () => void) => {
  const {
    formData,
    setFormField,
    slug,
    setSlug,
    setErrors,
    resetForm,
    setLocalPreview,
  } = useCategoryFormStore();
  const { success: toastSuccess, error: toastError } = useToast();

  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [errorParents, setErrorParents] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // 🟢 FIX TS ERROR: Chấp nhận cả Input và TextArea
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.value;
    setFormField("name", name);
    setSlug(generateSlug(name));
    setErrors({ name: "" });
  };

  const fetchParentCategories = useCallback(async () => {
    setLoadingParents(true);
    try {
      const data = await categoryService.getTree();
      setParentCategories(data || []);
    } catch (err: any) {
      setErrorParents(err.message || "Lỗi tải danh mục");
    } finally {
      setLoadingParents(false);
    }
  }, []);

  useEffect(() => {
    fetchParentCategories();
  }, [fetchParentCategories]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name?.trim()) newErrors.name = "Tên bắt buộc";
    if (!formData.imageAssetId) newErrors.imageAssetId = "Cần ảnh đại diện";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (categoryId?: string, etag?: string) => {
    if (!validate()) return;
    setIsCreating(true);
    try {
      const payload: any = {
        name: formData.name,
        slug: slug,
        description: formData.description,
        parentId: formData.parentId || null,
        active: formData.active,
        imageAssetId: formData.imageAssetId,
        defaultShippingRestrictions: {
          restrictionType:
            formData.defaultShippingRestrictions?.restrictionType || "NONE",
          maxShippingRadiusKm:
            formData.defaultShippingRestrictions?.maxShippingRadiusKm || null,
          countryRestrictionType:
            formData.defaultShippingRestrictions?.countryRestrictionType ||
            "ALLOW_ONLY",
          restrictedCountries:
            formData.defaultShippingRestrictions?.restrictedCountries || [],
          restrictedRegions:
            formData.defaultShippingRestrictions?.restrictedRegions || [],
        },
      };

      if (categoryId) {
        if (categoryId && !etag) {
          toastError(
            "Không tìm thấy phiên bản dữ liệu (ETag). Hãy thử F5 lại trang.",
          );
          return; // Chặn lại không cho chạy tiếp
        }
       await categoryService.update(categoryId, payload, etag!);
        toastSuccess("Cập nhật thành công");
      } else {
        await categoryService.create(payload);
        toastSuccess("Tạo danh mục thành công");
      }

      resetForm();
      // localPreview được quản lý bởi store nên gọi từ đây là chuẩn xác
      setLocalPreview(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Nếu Backend trả về lỗi liên quan đến ETag (412 Precondition Failed)
      const msg =
        err.status === 412
          ? "Dữ liệu đã bị thay đổi bởi người khác, vui lòng tải lại."
          : err.message;
      toastError(msg || "Lỗi hệ thống");
    } finally {
      setIsCreating(false);
    }
  };

  return {
    parentCategories,
    loadingParents,
    errorParents,
    isCreating,
    handleNameChange,
    submitForm,
  };
};
