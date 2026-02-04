"use client";

import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCategoryManagement, useFileUpload, useOptionManagement, useProductForm} from "../../../../_hooks";
import { useProductContext } from "../../../../_contexts";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useProductStore } from "../../../../_stores/product.store";

import {
  Button,
  ButtonField,
  CustomVideoModal,
  ImagePreviewModal,
} from "@/components";
import { AddOptionGroupModal,CategorySelectionModal } from "../../../../_components/Modal";

import {
  BasePriceSection,
  ProductClassificationSection,
  ProductDescription,
  ProductPreviewSidebar,
  ProductVariantsSection,
  ProductVariantsTable,
} from "@/app/(shop)/shop/_components";
import {
  ProductBasicTabs,
  ProductDetailsTabs,
  ProductFormTabs,
  ProductShippingTabs,
  TabType,
} from "../../_components";

import { userProductService } from "@/app/(shop)/shop/products/_services/product.service";
import { UploadContext } from "@/types/storage/storage.types";
import { mapCreateProductPayload } from "../../_utils/product.payload";
import { mapApiToFormState } from "../../_utils/update.product.payload";

export default function ShopProductAddStepsFormScreen({
  productId,
}: {
  productId?: string;
}) {
  const router = useRouter();
  const isEditMode = Boolean(productId);
  const { uploadFile: uploadPresigned } = usePresignedUpload();
  const [productVersion, setProductVersion] = useState<number>(0);
  const {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();

  const {
    variants,
    setVariants,
    setCategoryId,
    description,
    regions,
    setRegions,
    setBasicInfo,
    setAllowedShippingChannels,
    reset: resetStore,
    allowedShippingChannels,
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
    const store = useProductStore.getState();
    store.setOptionGroups(groups);
    store.regenerateVariants();
  });

  const handleUpdateVariant = useCallback(
    (index: number, field: string, value: any) => {
      const store = useProductStore.getState();
      store.updateVariant(index, field as any, value);
    },
    [],
  );

  const optionNames = getOptionNames();

  // useEffect(() => {
  //   const fetchDetail = async () => {
  //     if (isEditMode && productId) {
  //       try {
  //         setLoading(true);
  //         const res = await userProductService.getById(productId);
  //         const data = res.data; // Đây là cái object JSON bro vừa paste

  //         // 🟢 1. Đổ vào Form UI (Antd/Hook Form)
  //         setFieldsValue({
  //           name: data.name,
  //           description: data.description,
  //           categoryId: data.categoryId,
  //           active: data.active,
  //           basePrice: data.basePrice || 0,
  //         });

  //         // 🟢 2. Đổ vào Zustand Store (Dùng hàm Mapper vừa viết)
  //         const { optionGroups, variants } = mapApiToFormState(data);

  //         setBasicInfo("name", data.name);
  //         setBasicInfo("description", data.description);
  //         setOptionGroups(optionGroups);
  //         setVariants(variants);
  //         setAllowedShippingChannels(
  //           data.allowedShippingChannels || ["STANDARD"],
  //         );
  //         // Nếu có regions trong API thì set luôn
  //         if (data.regions) setRegions(data.regions);

  //         // 🟢 3. Xử lý Media (Quan trọng để hiện ảnh preview)
  //         // API này trả về imageIds, nhưng để hiện ảnh bro cần URL
  //         // Nếu API detail trả về đầy đủ object m trong data.media.items thì dùng:
  //         if (data.media?.images) {
  //           setFileList(
  //             data.media.images.map((img: any) => ({
  //               uid: img.id,
  //               url: img.url,
  //               status: "done",
  //               assetId: img.id,
  //             })),
  //           );
  //         }
  //       } catch (err) {
  //         toastError("Lỗi lấy chi tiết sản phẩm");
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   fetchDetail();
  // }, [productId, isEditMode]);

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

 useEffect(() => {
   const initData = async () => {
  resetStore();
  setFileList([]);
  setVideoList([]);

  if (isEditMode && productId) {
    try {
      setLoading(true);
      const res = await userProductService.getById(productId);
      const data = res?.data || res;

      if (!data) return;

      // 🟢 BƯỚC 1: Dùng Mapper để bốc dữ liệu sạch
      const { optionGroups, variants: mappedVariants, version } = mapApiToFormState(data);

      // 🟢 BƯỚC 2: Lưu Version (ETag) vào state ngay lập tức
      setProductVersion(version ?? 0);

      // Đổ vào Form Fields
      setFieldsValue({
        name: data.name,
        description: data.description,
        categoryId: data.category?.id || data.categoryId,
        basePrice: data.basePrice,
        active: data.active,
      });

      // Đổ vào Zustand Store
      setBasicInfo("name", data.name);
      setBasicInfo("description", data.description);
      setBasicInfo("basePrice", data.basePrice);
      setOptionGroups(optionGroups);
      setVariants(mappedVariants);
      
      // 🟢 BƯỚC 3: Xử lý Vận chuyển (Không để rỗng)
      const channels = data.allowedShippingChannels?.length > 0 
        ? data.allowedShippingChannels 
        : ["STANDARD"];
      setAllowedShippingChannels(channels);
      setRegions(data.regions || []);

      // Map Media (Ảnh/Video)
      if (data.media) {
        setFileList(data.media.filter((m: any) => m.type === "IMAGE").map((m: any) => ({
          uid: m.id, url: m.imagePath, status: "done", assetId: m.mediaAssetId,
        })));
        setVideoList(data.media.filter((m: any) => m.type === "VIDEO").map((m: any) => ({
          uid: m.id, url: m.imagePath, status: "done", assetId: m.mediaAssetId,
        })));
      }
    } catch (err) {
      toastError("Không thể tải thông tin sản phẩm.");
    } finally {
      setLoading(false);
    }
  }
};

    fetchCategories();
    loadCategoryTree();
    initData();
  }, [productId, isEditMode]);

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setLoading(true);
      const formValues = await validateFields();

      const rawData = {
        ...formValues,
        optionGroups,
        optionNames,
        variants,
        fileList,
        videoList,
        allowedShippingChannels, 
        regions,                 
        saveAsDraft: isDraft,
      };

      const finalPayload = mapCreateProductPayload(rawData);

      let result: any;
     if (isEditMode && productId) {
  result = await userProductService.updateProductByShop(productId, finalPayload, productVersion);
  
  const nextVersion = result?.data?.product?.version ?? result?.data?.version;
  if (nextVersion !== undefined) {
    setProductVersion(nextVersion); 
  }
  
  toastSuccess("✅ Cập nhật thành công!");
}

      const newVersion = result?.data?.product?.version ?? result?.data?.version ?? result?.version;
      if (newVersion !== undefined) setProductVersion(newVersion);

      const targetId = result?.data?.product?.id || result?.data?.id || result?.id || productId;
      
      setHasUnsavedChanges(false);
      if (targetId) {
        router.push(`/shop/products/${targetId}`);
      }
    } catch (err: any) {
      if (err.response?.status === 409 || err?.data?.code === 3005) {
        toastError("⚠️ Dữ liệu đã thay đổi ở tab khác hoặc phiên làm việc đã cũ. Vui lòng F5 trang!");
      } else {
        toastError(err?.message || "Lỗi lưu sản phẩm (3001)");
      }
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

          const freshState = useProductStore.getState();
          const freshVariants = freshState.variants;
          const freshUpdateVariantByKey = freshState.updateVariantByKey;

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
      updateAllVariants={(field, value) => {
        const store = useProductStore.getState();
        store.updateAllVariants(field, value);
      }}
      allowedShippingChannels={allowedShippingChannels}
      setAllowedShippingChannels={setAllowedShippingChannels}
      regions={regions}
      setRegions={setRegions}
    />
  );

  const totalStock = variants.reduce(
    (acc, curr) => acc + (curr.stockQuantity || 0),
    0,
  );

  const [activeTab, setActiveTab] = useState<TabType>("basic");

  return (
    <div className="min-h-screen space-y-2">
      <div className="flex justify-between items-center py-2 w-full">
        <h1 className="text-3xl font-semibold text-gray-900 italic uppercase">
          {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
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
            onClick={async (e) => {
              e.preventDefault();
              await handleSubmit();
            }}
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
