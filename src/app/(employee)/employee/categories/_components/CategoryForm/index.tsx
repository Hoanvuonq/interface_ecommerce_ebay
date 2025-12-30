"use client";

import { SelectComponent } from "@/components/SelectComponent";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { Info, Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCategory } from "../../_hooks/useCategory";
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../_types/dto/category.dto";

interface CategoryFormProps {
  category?: CategoryResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const isEditMode = !!category;
  
  const { 
    createCategory, 
    updateCategory, 
    categoryTree, 
    isLoading, // Lấy isLoading từ hook để xử lý trạng thái tree
    isSubmitting
  } = useCategory();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      parentId: category?.parent?.id || "",
      active: category?.active ?? true,
    },
  });

  const selectOptions = useMemo(() => {
    const options: { label: string; value: string }[] = [];
    
    const generateOptions = (nodes: CategoryResponse[], level = 0) => {
      nodes.forEach((node) => {
        if (node.id !== category?.id) {
          const prefix = "\u00A0".repeat(level * 4) + (level > 0 ? "└─ " : "");
          options.push({ 
            label: prefix + node.name, 
            value: node.id 
          });
          if (node.children && node.children.length > 0) {
            generateOptions(node.children, level + 1);
          }
        }
      });
    };
    
    generateOptions(categoryTree || []);
    return options;
  }, [categoryTree, category?.id]);

  const onSubmit = async (values: any) => {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      parentId: values.parentId || undefined,
      active: values.active,
    };

    let result;
    if (isEditMode && category) {
      result = await updateCategory({
        id: category.id,
        data: { ...payload, slug: category.slug } as UpdateCategoryRequest,
        etag: category.version.toString(),
      });
    } else {
      result = await createCategory(payload as CreateCategoryRequest);
    }

    if (result) {
      reset();
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Tên danh mục */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 ml-1">
          Tên danh mục <span className="text-orange-500">*</span>
        </label>
        <input
          {...register("name", { required: "Tên danh mục không được để trống", maxLength: 255 })}
          className={cn(
            "w-full h-11 px-4 rounded-xl border bg-white outline-none transition-all text-sm shadow-sm",
            errors.name 
              ? "border-red-500 focus:ring-4 focus:ring-red-50" 
              : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
          )}
          placeholder="Nhập tên danh mục..."
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-[11px] font-medium text-red-500 ml-1">{errors.name.message}</p>}
      </div>

      {/* Danh mục cha */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 ml-1">Danh mục cha</label>
        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <SelectComponent
              options={selectOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder={isLoading ? "Đang tải dữ liệu..." : "Chọn danh mục cha (Gốc)"}
              disabled={isSubmitting || isLoading}
              className="w-full"
            />
          )}
        />
      </div>

      {/* Mô tả */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 ml-1">Mô tả</label>
        <textarea
          {...register("description", { maxLength: 5000 })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm resize-none shadow-sm"
          placeholder="Nhập mô tả chi tiết..."
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between py-2 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer group">
            <input type="checkbox" {...register("active")} className="sr-only peer" disabled={isSubmitting} />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 shadow-inner" />
          </label>
          <span className="text-sm font-bold text-slate-600">Hoạt động</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEditMode ? "Lưu thay đổi" : "Tạo danh mục"}
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in fade-in duration-300">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            Hệ thống đang bảo vệ dữ liệu bằng <strong>ETag (v{category?.version})</strong>. 
            Nếu dữ liệu đã bị thay đổi bởi người khác, vui lòng làm mới trang trước khi lưu.
          </p>
        </div>
      )}
    </form>
  );
}