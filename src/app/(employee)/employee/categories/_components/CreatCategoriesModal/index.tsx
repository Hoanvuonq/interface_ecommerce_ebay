"use client";

import React, { useEffect } from "react";
import _ from "lodash";
import { Info, Layers } from "lucide-react";
import { cn } from "@/utils/cn";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";

import {
  CustomButtonActions,
  SectionHeader,
  MediaUploadField,
  FormInput,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { CategoryStructureSection } from "../CategoryStructureSection";
import { ShippingRestrictionsSection } from "../ShippingRestrictionsSection";
import { useCategoryFormStore } from "../../_store/categoryStore";
import { useCategoryLogic } from "../../_hooks/useCategoryLogic";
import { CategoryResponse } from "@/app/(employee)/employee/categories/_types/dto/category.dto";

interface CreatCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryResponse | null;
}
export const CreatCategoriesModal: React.FC<CreatCategoriesModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const { formData, setFormField, slug, setSlug, errors, resetForm } =
    useCategoryFormStore();
  const {
    parentCategories,
    loadingParents,
    errorParents,
    isCreating,
    handleNameChange,
    submitForm,
  } = useCategoryLogic(onSuccess);
  const { uploadFile: uploadPresigned } = usePresignedUpload();

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormField("name", category.name);
        setSlug(category.slug);
        setFormField("description", category.description);
        setFormField("parentId", category.parent?.id);
        setFormField("imageAssetId", (category as any).imageAssetId);
        setFormField("imagePath", (category as any).imagePath);
      } else {
        resetForm();
      }
    }
  }, [isOpen, category, setFormField, setSlug, resetForm]);

  const handleCancel = () => {
    resetForm();
    onClose();
  };
  return (
    <PortalModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={category ? "Cập nhật danh mục" : "Thiết lập danh mục mới"}
      width="max-w-5xl"
    >
      <div className="p-1 space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
          <SectionHeader icon={Info} title="Thông tin hiển thị" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Tên danh mục"
              required
              value={formData.name}
              onChange={(e) =>
                handleNameChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              error={errors.name}
              placeholder="Nhập tên..."
            />
            <FormInput
              label="Đường dẫn (Slug)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
            />
          </div>
          <FormInput
            isTextArea
            label="Mô tả chi tiết"
            value={formData.description}
            onChange={(e) => setFormField("description", e.target.value)}
            rows={3}
            placeholder="Mô tả ngắn gọn về danh mục này..."
          />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="shrink-0 space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Ảnh đại diện <span className="text-red-500">*</span>
              </div>
              <div
                className={cn(
                  "p-2 rounded-[2.2rem] border transition-all bg-gray-50/50",
                  errors?.imageAssetId
                    ? "border-red-200 bg-red-50/30 animate-shake"
                    : "border-gray-100",
                )}
              >
                <MediaUploadField
                  mode="public"
                  maxCount={1}
                  size="md"
                  // Dùng logic chọn URL thông minh hơn
                  value={
                    formData.imageAssetId
                      ? [
                          {
                            uid: "-1",
                            name: "category-image",
                            status: "done",
                            // Ưu tiên dùng path từ formData, nếu chưa có thì dùng tạm preview (nếu bro có lưu)
                            url: toPublicUrl(formData.imagePath || ""),
                          },
                        ]
                      : []
                  }
                  onUploadApi={async (file) => {
                    try {
                      const res = await uploadPresigned(
                        file,
                        UploadContext.CATEGORY_IMAGE,
                        true,
                      );

                      setFormField("imageAssetId", res.assetId);
                      setFormField("imagePath", res.path);

                      const previewUrl =
                        res.finalUrl || res.path || URL.createObjectURL(file);
                      return previewUrl;
                    } catch (error) {
                      console.error("Upload failed:", error);
                      throw error;
                    }
                  }}
                  onChange={(files) => {
                    if (files.length === 0) {
                      setFormField("imageAssetId", undefined);
                      setFormField("imagePath", undefined);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex-1 self-stretch">
              <div className="h-full flex gap-6 items-center p-8 bg-indigo-50/40 rounded-[2.5rem] border border-indigo-100/50 relative overflow-hidden">
                <Layers className="absolute -right-4 -bottom-4 text-indigo-500/10 w-32 h-32 rotate-12" />
                <div className="p-3 bg-white rounded-2xl shadow-sm z-10">
                  <Info className="text-indigo-500" size={24} />
                </div>
                <div className="space-y-1.5 uppercase tracking-tighter text-[10px] font-black text-indigo-700/70 z-10">
                  <p className="text-indigo-900 text-[11px] mb-1 italic">
                    Yêu cầu tài nguyên:
                  </p>
                  <p>• Định dạng: JPG, PNG, WEBP (Max 5MB)</p>
                  <p>• Tỉ lệ khuyến nghị: 1:1 (Vuông)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CategoryStructureSection
          parentId={formData.parentId}
          active={formData.active ?? false}
          parentCategories={parentCategories as any[]}
          loadingParents={loadingParents}
          errorParents={errorParents}
          onParentChange={(val) => setFormField("parentId", val)}
          onActiveChange={(val) => setFormField("active", val)}
        />
        <ShippingRestrictionsSection
          value={formData.defaultShippingRestrictions}
          onChange={(newVal) =>
            setFormField("defaultShippingRestrictions", newVal)
          }
          errors={errors}
          loading={isCreating}
        />

        <CustomButtonActions
          isLoading={isCreating}
          onCancel={handleCancel}
          onSubmit={submitForm}
          submitText={category ? "Cập nhật thay đổi" : "Kích hoạt danh mục"}
          containerClassName="pt-8 border-t border-gray-100"
        />
      </div>
    </PortalModal>
  );
};
