/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { CategoryResponse } from "@/types/categories/category.detail";
import { useCategoryLogic } from "../../_hooks/useCategoryLogic";
import { UploadFile } from "@/app/(main)/orders/_types/review";

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
    handleNameChange,
    submitForm,
    parentCategories,
    loadingParents,
    errorParents,
    isCreating,
  } = useCategoryLogic(onSuccess);
  const { uploadFile: uploadPresigned } = usePresignedUpload();

  // 🟢 localPreview giữ ảnh luôn hiển thị bất kể publicPath từ server là null
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormField("name", category.name);
        setSlug(category.slug);
        setFormField("description", category.description || "");
        setFormField("active", category.active);
        setFormField("imageAssetId", category.imageAssetId || "");
        setFormField("imagePath", category.imagePath || "");

        const pId = (category as any).parentId || category.parent?.id || null;
        setFormField("parentId", pId);

        if (category.defaultShippingRestrictions) {
          setFormField("defaultShippingRestrictions", {
            ...category.defaultShippingRestrictions,
          });
        }

        if (category.imagePath) {
          setLocalPreview(toPublicUrl(category.imagePath));
        }
      } else {
        resetForm();
        setLocalPreview(null);
      }
    }
  }, [isOpen, category, setFormField, setSlug, resetForm]);

  const handleCancel = useCallback(() => {
    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    resetForm();
    setLocalPreview(null);
    onClose();
  }, [localPreview, resetForm, onClose]);

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={category ? "Cập nhật danh mục" : "Thiết lập danh mục mới"}
      width="max-w-5xl"
    >
      <div className="p-1 space-y-8 animate-in fade-in duration-500">
        {/* NỘI DUNG Tên/Mô tả */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
          <SectionHeader icon={Info} title="Thông tin hiển thị" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Tên danh mục"
              required
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
            />
            <FormInput
              label="Đường dẫn (Slug)"
              value={slug}
              onChange={(e: any) => setSlug(e.target.value)}
            />
          </div>
          <FormInput
            isTextArea
            label="Mô tả chi tiết"
            value={formData.description}
            onChange={(e: any) => setFormField("description", e.target.value)}
            rows={3}
          />
        </div>

        {/* SECTION HÌNH ẢNH - Fix hiển thị tức thì */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="shrink-0 space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Ảnh đại diện *
              </div>
              <div
                className={cn(
                  "p-2 rounded-[2.2rem] border transition-all bg-gray-50/50",
                  errors?.imageAssetId
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-100",
                )}
              >
                <MediaUploadField
                  mode="public"
                  maxCount={1}
                  size="md"
                  // 🟢 FIX: Luôn ưu tiên localPreview để ảnh "lên luôn"
                  value={
                    localPreview || formData.imageAssetId
                      ? [
                          {
                            uid: formData.imageAssetId || "-1",
                            name: "category-image",
                            status: "done",
                            url:
                              localPreview ||
                              (formData.imagePath
                                ? toPublicUrl(formData.imagePath)
                                : ""),
                          },
                        ]
                      : []
                  }
                  onUploadApi={async (file, onProgress) => {
                    const blobUrl = URL.createObjectURL(file);
                    setLocalPreview(blobUrl);

                    try {
                      const res = (await uploadPresigned(
                        file,
                        UploadContext.CATEGORY_IMAGE,
                        false,
                        { onUploadProgress: onProgress },
                      )) as any;

                      setFormField("imageAssetId", res.assetId);
                      setFormField("imagePath", res.path);

                      return {
                        url: blobUrl,
                        assetId: res.assetId,
                        path: res.path,
                      };
                    } catch (error) {
                      setLocalPreview(null);
                      throw error;
                    }
                  }}
                  onChange={(files) => {
                    if (files.length === 0) {
                      setFormField("imageAssetId", undefined);
                      setFormField("imagePath", undefined);
                      setLocalPreview(null);
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
          onSubmit={() => submitForm(category?.id, (category as any)?.etag)}
          submitText={category ? "Cập nhật thay đổi" : "Kích hoạt danh mục"}
          containerClassName="pt-8 border-t border-gray-100"
        />
      </div>
    </PortalModal>
  );
};
