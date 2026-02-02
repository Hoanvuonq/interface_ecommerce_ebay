/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CustomButtonActions,
  FormInput,
  MediaUploadField,
  SectionHeader,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { Info, Layers, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCategoryLogic } from "../../_hooks/useCategoryLogic";
import { useCategoryFormStore } from "../../_store/categoryStore";
import { CategoryStructureSection } from "../CategoryStructureSection";
import { ShippingRestrictionsSection } from "../ShippingRestrictionsSection";
import { CreatCategoriesModalProps } from "./type";
import { useGetCategoryById } from "@/app/manager/_hooks/useCategoryController";

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

  const { handleGetCategoryById, loading: loadingDetail } =
    useGetCategoryById();
  const { uploadFile: uploadPresigned } = usePresignedUpload();

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [currentEtag, setCurrentEtag] = useState<string>("");
  const isFetchingDetail = useRef(false);

  // Khởi tạo dữ liệu khi mở Modal
  useEffect(() => {
    if (!isOpen) return;

    const initData = async () => {
      if (category?.id) {
        // TRƯỜNG HỢP UPDATE: Lấy data mới nhất để có ETag/Version chuẩn
        isFetchingDetail.current = true;
        const res = await handleGetCategoryById(category.id);

        if (res?.data) {
          const latest = res.data;
          setFormField("name", latest.name);
          setSlug(latest.slug);
          setFormField("description", latest.description || "");
          setFormField("active", latest.active);
          setFormField("imageAssetId", latest.imageAssetId || "");
          setFormField("imagePath", latest.imagePath || "");
          setFormField(
            "parentId",
            latest.parentId || latest.parent?.id || null,
          );

          if (latest.defaultShippingRestrictions) {
            setFormField("defaultShippingRestrictions", {
              ...latest.defaultShippingRestrictions,
            });
          }

          // Xử lý ETag từ version (hoặc header nếu API trả về)
          setCurrentEtag(String(latest.version));

          if (latest.imagePath) {
            setLocalPreview(toPublicUrl(latest.imagePath.replace("*", "orig")));
          }
        }
        isFetchingDetail.current = false;
      } else {
        // TRƯỜNG HỢP CREATE
        resetForm();
        setLocalPreview(null);
        setCurrentEtag("");
      }
    };

    initData();
  }, [isOpen, category?.id]); // Chỉ chạy khi mở modal hoặc đổi ID category

  const handleCancel = useCallback(() => {
    if (localPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }
    resetForm();
    setLocalPreview(null);
    onClose();
  }, [localPreview, resetForm, onClose]);

  const onFormSubmit = async () => {
    // Nếu đang update, dùng currentEtag vừa fetch được
    await submitForm(category?.id, currentEtag);
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={category ? "Cập nhật danh mục" : "Thiết lập danh mục mới"}
      width="max-w-5xl"
    >
      {loadingDetail ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Đang tải dữ liệu mới nhất...
          </p>
        </div>
      ) : (
        <div className="p-1 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Section: Thông tin cơ bản */}
          <div className="bg-white p-8 rounded-4xl border border-gray-100 space-y-6 shadow-sm">
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
                placeholder="ten-danh-muc"
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

          {/* Section: Ảnh đại diện */}
          <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="shrink-0 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Ảnh đại diện *
                </div>
                <div
                  className={cn(
                    "p-2 rounded-3xl border transition-all bg-gray-50/50",
                    errors?.imageAssetId
                      ? "border-red-200 bg-red-50/30"
                      : "border-gray-100",
                  )}
                >
                  <MediaUploadField
                    mode="public"
                    maxCount={1}
                    size="md"
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
                        const res: any = await uploadPresigned(
                          file,
                          UploadContext.CATEGORY_IMAGE,
                          false,
                          { onUploadProgress: onProgress },
                        );
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
                <div className="h-full flex gap-6 items-center p-8 bg-indigo-50/40 rounded-4xl border border-indigo-100/50 relative overflow-hidden">
                  <Layers className="absolute -right-4 -bottom-4 text-indigo-500/10 w-32 h-32 rotate-12" />
                  <div className="p-3 bg-white rounded-2xl shadow-sm z-10">
                    <Info className="text-indigo-500" size={24} />
                  </div>
                  <div className="space-y-1.5 uppercase tracking-tighter text-[10px] font-bold text-indigo-700/70 z-10">
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

          {/* Section: Cấu trúc & Vận chuyển */}
          <CategoryStructureSection
            parentId={formData.parentId}
            active={formData.active ?? false}
            parentCategories={parentCategories}
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

          {/* Nút hành động */}
          <CustomButtonActions
            isLoading={isCreating}
            onCancel={handleCancel}
            onSubmit={onFormSubmit}
            submitText={category ? "Cập nhật thay đổi" : "Kích hoạt danh mục"}
            containerClassName="pt-8 border-t border-gray-100"
          />
        </div>
      )}
    </PortalModal>
  );
};
