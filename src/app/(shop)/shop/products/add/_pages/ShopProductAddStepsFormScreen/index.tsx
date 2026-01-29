"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// Hooks
import {
  useProductForm,
  useFileUpload,
  useCategoryManagement,
  useOptionManagement,
} from "../../../../_hooks";
import { useProductContext } from "../../../../_contexts";

import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import { useProductStore } from "../../../../_stores/product.store";

import { ButtonField, CustomVideoModal, ImagePreviewModal } from "@/components";
import { Button } from "@/components/button";
import {
  AddOptionGroupModal,
  CategorySelectionModal,
} from "../../../../_components/Modal";
import { BasePriceSection } from "../../../../_components/Products/BasePriceSection";
import { ProductClassificationSection } from "../../../../_components/Products/ProductClassificationSection";
import { ProductDescription } from "../../../../_components/Products/ProductDescription";
import { ProductPreviewSidebar } from "../../../../_components/Products/ProductPreviewSidebar";
import { ProductVariantsSection } from "../../../../_components/Products/ProductVariantsSection";
import { ProductVariantsTable } from "../../../../_components/Products/ProductVariantsTable";
import {
  ProductBasicTabs,
  ProductDetailsTabs,
  ProductFormTabs,
  ProductShippingTabs,
  TabType,
} from "../../_components";

import { userProductService } from "@/services/products/product.service";
import { UploadContext } from "@/types/storage/storage.types";
import type {
  CreateUserProductBulkDTO,
  CreateUserProductOptionDTO,
} from "@/types/product/user-product.dto";

export default function ShopProductAddStepsFormScreen() {
  const router = useRouter();
  const { uploadFile: uploadPresigned } = usePresignedUpload();
  const {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();

  const {
    variants,
    setVariants,
    addOptionGroup,
    setCategoryId,
    description,
    setBasicInfo,
    updateVariantByKey,
  } = useProductStore();

  const {
    formData,
    setFormData,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    mediaModal,
    setMediaModal,
    loading,
    setLoading,
  } = useProductContext();

  // Custom hooks
  const {
    formFields,
    getFieldValue,
    getFieldsValue,
    setFieldValue,
    setFieldsValue,
    validateFields,
  } = useProductForm(toastError);

  const {
    uploading,
    fileList,
    setFileList,
    videoList,
    setVideoList,
    uploadingVideo,
    handleUpload: uploadImage,
    handleVideoUpload: uploadVideo,
    handleRemoveVideo,
  } = useFileUpload(uploadPresigned);

  const {
    categories,
    categoryTree,
    categoryModalOpen,
    selectedCategoryPath,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedLevel4,
    secondLevelCategories,
    thirdLevelCategories,
    fourthLevelCategories,
    loadingCategoryTree,
    setCategoryModalOpen,
    setSelectedCategoryPath,
    loadCategoryTree,
    fetchCategories,
    handleSelectLevel1,
    handleSelectLevel2,
    handleSelectLevel3,
    setSelectedLevel4,
    handleConfirmCategory,
    handleOpenCategoryModal,
    updateCategoryPath,
  } = useCategoryManagement(toastError, toastSuccess);

  const {
    optionGroups,
    setOptionGroups,
    addOptionModalOpen,
    setAddOptionModalOpen,
    handleOptionNameChange,
    handleOptionValueChange,
    handleAddOptionValue,
    handleRemoveOptionValue,
    handleAddOptionColumn,
    handleRemoveOptionColumn,
    confirmAddOption,
    getOptionNames,
  } = useOptionManagement(toastWarning, toastSuccess, (groups) => {
    // Sử dụng store thay vì hook để regenerate variants
    const store = useProductStore.getState();
    store.setOptionGroups(groups);
    store.regenerateVariants();
  });

  // Không cần useVariantManagement nữa, chỉ cần wrapper functions
  const handleUpdateVariant = useCallback(
    (index: number, field: string, value: any) => {
      const store = useProductStore.getState();
      store.updateVariant(index, field as any, value);
    },
    [],
  );

  const handleUpdateVariants = useCallback(
    (newVariants: any[]) => {
      setVariants(newVariants);
    },
    [setVariants],
  );

  const validateVariantStructure = useCallback(
    (variantList: any[]): string[] => {
      const errors: string[] = [];
      if (!variantList || variantList.length === 0) {
        errors.push("Cần tạo ít nhất 1 biến thể trước khi tiếp tục.");
      }
      return errors;
    },
    [],
  );

  const optionNames = getOptionNames();

  // Initialize data
  useEffect(() => {
    fetchCategories();
    loadCategoryTree();
  }, []);

  useEffect(() => {
    updateCategoryPath(String(getFieldValue("categoryId")));
  }, [formFields.categoryId, categoryTree, categories]);

  useEffect(() => {
    const values = getFieldsValue();
    const hasData =
      values.name ||
      values.description ||
      values.basePrice > 0 ||
      fileList.length > 0 ||
      videoList.length > 0 ||
      variants.length > 0 ||
      optionGroups.some((group) => {
        const nameHasValue = (group.name || "").trim().length > 0;
        const valueHasValue = group.values.some(
          (value) => (value || "").trim().length > 0,
        );
        return nameHasValue || valueHasValue;
      });

    setHasUnsavedChanges(Boolean(hasData));
  }, [formFields, fileList, videoList, variants, optionGroups]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Bạn có chắc muốn thoát? Dữ liệu chưa được lưu sẽ bị mất.";
        return "Bạn có chắc muốn thoát? Dữ liệu chưa được lưu sẽ bị mất.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleConfirmCategoryWrapper = () => {
    handleConfirmCategory((categoryId, path) => {
      setFieldValue("categoryId", categoryId);
      setSelectedCategoryPath(path);
      setCategoryId(categoryId, path);
    });
  };

  const handleUploadWrapper = async (file: File) => {
    await uploadImage(file, toastError);
  };

  const handleVideoUploadWrapper = async (file: File) => {
    await uploadVideo(file, toastError);
  };

  const showVariantErrors = (errors: string[]) => {
    toastError("Thông tin biến thể chưa hợp lệ: " + errors.join("; "));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values = await validateFields();

      const optionsForAPI: CreateUserProductOptionDTO[] = optionGroups
        .map((group) => {
          const name = group.name.trim();
          const groupValues = group.values
            .map((value) => value.trim())
            .filter((value) => value.length > 0);

          if (!name || groupValues.length === 0) {
            return null;
          }

          return {
            name,
            values: groupValues.map((value, order) => ({
              name: value,
              displayOrder: order + 1,
            })),
          } as CreateUserProductOptionDTO;
        })
        .filter(
          (option): option is CreateUserProductOptionDTO => option !== null,
        );

      const variantsToSubmit =
        variants.length > 0 ? variants : values.variants || [];

      // Debug: Show all variant keys and their image status
      variantsToSubmit.forEach((v, idx) => {
        const variantKey = v.optionValueNames?.join("|") || "no-key";
        
      });


      const structuralErrors = validateVariantStructure(variantsToSubmit);
      if (structuralErrors.length > 0) {
        showVariantErrors(structuralErrors);
        return;
      }

      const mediaArray = [
        ...fileList
          .filter((file) => file.status === "done" && (file as any).assetId)
          .map(
            (file, index) =>
              ({
                mediaAssetId: (file as any).assetId as string,
                type: "IMAGE" as const,
                displayOrder: index + 1,
                sortOrder: index + 1,
                isPrimary: index === 0,
              }) as any,
          ),
        ...videoList
          .filter((file) => file.status === "done" && (file as any).assetId)
          .map(
            (file, index) =>
              ({
                mediaAssetId: (file as any).assetId as string,
                type: "VIDEO" as const,
                displayOrder: fileList.length + index + 1,
                sortOrder: fileList.length + index + 1,
                isPrimary: false,
              }) as any,
          ),
      ];


      // Warning if no media
      if (mediaArray.length === 0) {
        console.warn(
          "⚠️ No product media! fileList:",
          fileList.length,
          "videoList:",
          videoList.length,
        );
      }

      const finalData: CreateUserProductBulkDTO = {
        ...formData,
        ...values,
        active: values.active ?? false,
        media: mediaArray,
        options: optionsForAPI,
        variants: variantsToSubmit.map((v: any, index: number) => {
          const variantOptionValues = (v.optionValueNames || []).filter(
            (val: string) => val && val.trim(),
          );
          const options: Array<{
            optionId?: string;
            optionName: string;
            value: string;
          }> = [];

          if (optionNames.length > 0 && variantOptionValues.length > 0) {
            optionNames.forEach((optionName, idx) => {
              const value = variantOptionValues[idx];
              if (value && value.trim()) {
                options.push({
                  optionName: optionName,
                  value: value.trim(),
                });
              }
            });
          }

          // Prepare variant data
          const variantData: any = {
            sku: v.sku,
            corePrice: v.corePrice,
            price: v.price,
            stockQuantity: v.stockQuantity,
            lengthCm: v.lengthCm,
            widthCm: v.widthCm,
            heightCm: v.heightCm,
            weightGrams: v.weightGrams,
            options: options.length > 0 ? options : undefined,
          };

          // Add image data if exists
          if (v.imageAssetId) {
            variantData.imageAssetId = v.imageAssetId;
            console.log(
              `✅ Variant ${index + 1} (${v.sku}) has imageAssetId: ${v.imageAssetId}`,
            );
          } else {
            console.log(
              `⚠️ Variant ${index + 1} (${v.sku}) missing imageAssetId`,
            );
          }

          if (v.imageUrl) {
            variantData.imageUrl = v.imageUrl;
          }
          if (v.imageExtension) {
            variantData.imageExtension = v.imageExtension;
          }

          return variantData;
        }),
      };

      const result: any = await userProductService.createBulk(finalData);

      setHasUnsavedChanges(false);

      const createdProduct = result?.data?.product || result?.product || result;
      const productName = createdProduct?.name || values.name || "sản phẩm";
      const productId = createdProduct?.id;

      if (!productId) {
        toastError("Không thể lấy ID sản phẩm. Vui lòng kiểm tra lại.");
        return;
      }

      toastSuccess(
        `✅ Tạo sản phẩm thành công! "${productName}" - Đang chuyển hướng...`,
      );

      setTimeout(() => {
        router.push(`/shop/products/${productId}`);
      }, 2000);
    } catch (err: any) {
      toastError(err?.message || "Tạo sản phẩm thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadVariantImageWrapper = useCallback(
    async (
      file: File,
      index: number,
      applyToSameFirstOption: boolean = true,
    ) => {
      const { variants, updateVariantByKey } = useProductStore.getState();
      const currentVariant = variants[index];


      if (!currentVariant) {
        console.error(`Variant at index ${index} not found`);
        toastError("Không tìm thấy biến thể để upload hình");
        return;
      }

      const variantKey = currentVariant.optionValueNames.join("|");
      const localUrl = URL.createObjectURL(file);
      const firstOptionValue = currentVariant.optionValueNames[0];


      try {
        updateVariantByKey(variantKey, "imageUrl", localUrl);
        updateVariantByKey(variantKey, "imageProcessing", true);

        const res = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);

        if (res?.assetId && res?.finalUrl) {
          const extension = file.name.split(".").pop();
          const imageExtension = extension ? `.${extension.toLowerCase()}` : "";

          // Get fresh state from store for related variants
          const freshState = useProductStore.getState();
          const freshVariants = freshState.variants;
          const freshUpdateVariantByKey = freshState.updateVariantByKey;

          // Update current variant
          freshUpdateVariantByKey(variantKey, "imageAssetId", res.assetId);
          freshUpdateVariantByKey(variantKey, "imageUrl", res.finalUrl);
          if (imageExtension) {
            freshUpdateVariantByKey(
              variantKey,
              "imageExtension",
              imageExtension,
            );
          }
          freshUpdateVariantByKey(variantKey, "imageProcessing", false);

          if (applyToSameFirstOption && firstOptionValue) {
            const relatedVariants = freshVariants.filter(
              (v) =>
                v.optionValueNames[0] === firstOptionValue &&
                v.optionValueNames.join("|") !== variantKey,
            );

            relatedVariants.forEach((v) => {
              const relatedKey = v.optionValueNames.join("|");
              freshUpdateVariantByKey(relatedKey, "imageAssetId", res.assetId);
              freshUpdateVariantByKey(relatedKey, "imageUrl", res.finalUrl);
              if (imageExtension) {
                freshUpdateVariantByKey(
                  relatedKey,
                  "imageExtension",
                  imageExtension,
                );
              }
            });
          }

          // Verify the update worked
          setTimeout(() => {
            const updatedState = useProductStore.getState();
            const allVariantsWithImage = updatedState.variants.filter(
              (v) => v.imageAssetId,
            );
          }, 100);

          const appliedCount = applyToSameFirstOption
            ? freshVariants.filter(
                (v) => v.optionValueNames[0] === firstOptionValue,
              ).length
            : 1;

          if (appliedCount > 1) {
            toastSuccess(
              `Upload thành công! Đã áp dụng cho ${appliedCount} biến thể cùng "${firstOptionValue}"`,
            );
          } else {
            toastSuccess(`Upload thành công cho ${currentVariant.sku}`);
          }
        } else {
          throw new Error("Upload response không hợp lệ");
        }
      } catch (error) {
        console.error(`❌ Upload failed for ${variantKey}:`, error);
        toastError(`Upload lỗi: ${currentVariant.sku}`);

        // Reset image data on error
        updateVariantByKey(variantKey, "imageUrl", undefined);
        updateVariantByKey(variantKey, "imageAssetId", undefined);
        updateVariantByKey(variantKey, "imageExtension", undefined);
        updateVariantByKey(variantKey, "imageProcessing", false);
      }
    },
    [uploadPresigned, toastSuccess, toastError],
  );
  const renderBasicTab = () => (
    <ProductBasicTabs
      form={{ getFieldValue, setFieldValue, validateFields }}
      onOpenCategoryModal={handleOpenCategoryModal}
      onUploadImage={handleUploadWrapper}
      onUploadVideo={handleVideoUploadWrapper}
      fileList={fileList}
      setFileList={setFileList}
      videoList={videoList}
      setVideoList={setVideoList}
      onShowImageModal={(file) => {
        setMediaModal({ type: "image", file });
      }}
      onShowVideoModal={(file) => {
        setMediaModal({ type: "video", file });
      }}
    />
  );

  const renderDetailsTab = () => <ProductDetailsTabs />;

  const renderDescriptionTab = () => (
    <ProductDescription
      value={description}
      onChange={(val) => {
        setBasicInfo("description", val);
        setFieldValue("description", val);
      }}
    />
  );

  const renderSalesTab = () => (
    <div className="flex flex-col gap-4 w-full">
      <BasePriceSection
        value={Number(getFieldValue("basePrice")) || undefined}
        onChange={(val) => setFieldsValue({ basePrice: val })}
      />

      <ProductClassificationSection
        optionGroups={optionGroups}
        onAddGroup={handleAddOptionColumn}
        onRemoveGroup={handleRemoveOptionColumn}
        onUpdateGroupName={handleOptionNameChange}
        onAddValue={handleAddOptionValue}
        onRemoveValue={handleRemoveOptionValue}
        onUpdateValue={handleOptionValueChange}
      />
    </div>
  );

  const renderShippingTab = () => (
    <ProductShippingTabs
      variants={variants}
      optionNames={optionNames}
      onUpdateVariant={handleUpdateVariant}
    />
  );

  const previewImage = fileList.find((f) => f.status === "done")?.url;
  const totalStock = variants.reduce(
    (acc, curr) => acc + (curr.stockQuantity || 0),
    0,
  );

  const [activeTab, setActiveTab] = useState<TabType>("basic");

  return (
    <div className="min-h-screen space-y-2">
      <div className="flex justify-between items-center py-2 w-full">
        <h1 className="text-3xl font-semibold text-gray-900 italic uppercase">
          Thêm sản phẩm mới
        </h1>
        <div className="flex gap-3 pt-2">
          <Button
            variant="edit"
            className="w-30! h-10!"
            onClick={() => {
              const currentData = getFieldsValue();
              setFormData({
                ...formData,
                ...currentData,
                variants: variants,
                saveAsDraft: true,
              });
              handleSubmit();
            }}
            loading={loading}
          >
            Lưu nháp
          </Button>
          <ButtonField
            form="primary"
            className="w-40! h-10! text-sm!"
            htmlType="submit"
            type="login"
            onClick={handleSubmit}
            loading={loading}
          >
            Lưu & đăng bán
          </ButtonField>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div
          className="flex gap-6 items-start"
          style={{ position: "relative" }}
        >
          <div className="flex-1 w-full lg:w-[65%] min-w-0">
            <ProductFormTabs activeTab={activeTab} setActiveTab={setActiveTab}>
              <div className={activeTab === "basic" ? "block" : "hidden"}>
                {renderBasicTab()}
              </div>
              <div className={activeTab === "details" ? "block" : "hidden"}>
                {renderDetailsTab()}
              </div>
              <div className={activeTab === "description" ? "block" : "hidden"}>
                {renderDescriptionTab()}
              </div>
              <div className={activeTab === "sales" ? "block" : "hidden"}>
                {renderSalesTab()}
              </div>
              <div className={activeTab === "shipping" ? "block" : "hidden"}>
                {renderShippingTab()}
              </div>
            </ProductFormTabs>
          </div>

          <div className="w-full lg:w-[30%] lg:min-w-[320px]">
            <ProductPreviewSidebar
              fileList={fileList}
              videoList={videoList}
              variants={variants}
              name={formFields.name}
              basePrice={formFields.basePrice}
              description={formFields.description}
              totalStock={totalStock}
            />
          </div>
        </div>
      </form>

      {optionGroups.length > 0 && (
        <ProductVariantsSection hasOptions={true}>
          <ProductVariantsTable
            variants={variants}
            optionNames={optionNames}
            onUpdateVariants={setVariants}
            onUploadImage={handleUploadVariantImageWrapper}
          />
        </ProductVariantsSection>
      )}

      <ImagePreviewModal
        isOpen={mediaModal?.type === "image"}
        onClose={() => setMediaModal(null)}
        file={mediaModal?.file || null}
      />

      <CustomVideoModal
        open={mediaModal?.type === "video"}
        videoUrl={mediaModal?.file?.url}
        onCancel={() => setMediaModal(null)}
      />

      <AddOptionGroupModal
        isOpen={addOptionModalOpen}
        onClose={() => setAddOptionModalOpen(false)}
        onConfirm={confirmAddOption}
        existingGroups={optionNames}
      />

      <CategorySelectionModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onConfirm={handleConfirmCategoryWrapper}
        categoryTree={categoryTree}
        loading={loadingCategoryTree}
        selectedLevel1={selectedLevel1}
        selectedLevel2={selectedLevel2}
        selectedLevel3={selectedLevel3}
        selectedLevel4={selectedLevel4}
        onSelectLevel1={handleSelectLevel1}
        onSelectLevel2={handleSelectLevel2}
        onSelectLevel3={handleSelectLevel3}
        onSelectLevel4={setSelectedLevel4}
      />
    </div>
  );
}
