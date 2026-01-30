import { useBanner } from "./useBanner";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useBannerFormStore } from "../_store/useBannerFormStore";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";
import { useToast } from "@/hooks/useToast";

export const useBannerLogic = (onSuccess: () => void) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const { formData, updateUpload, setFormField, setSubmitting } =
    useBannerFormStore();
  const { uploadFile: uploadPresigned } = usePresignedUpload();
  const { createBanner, updateBanner } = useBanner();

  const handleImageUpload = async (
    file: File,
    variant: "base" | "desktop" | "mobile",
  ) => {
    const localUrl = URL.createObjectURL(file);
    updateUpload(variant, { preview: localUrl, progress: 10 });
    try {
      const res = await uploadPresigned(file, UploadContext.BANNER);
      if (res.assetId) {
        const fieldMap = {
          base: "mediaAssetId",
          desktop: "mediaDesktopId",
          mobile: "mediaMobileId",
        };
        setFormField(fieldMap[variant], res.assetId);
        updateUpload(variant, {
          assetId: res.assetId,
          preview: toPublicUrl(res.finalUrl || res.path || ""),
          progress: 100,
        });
      }
    } catch (error) {
      updateUpload(variant, { preview: null, progress: 0 });
      toastError("Upload ảnh thất bại");
    }
  };

  const removeImage = (variant: "base" | "desktop" | "mobile") => {
    const fieldMap = {
      base: "mediaAssetId",
      desktop: "mediaDesktopId",
      mobile: "mediaMobileId",
    };
    setFormField(fieldMap[variant], null);
    updateUpload(variant, { preview: null, assetId: null, progress: 0 });
  };

  const submitForm = async () => {
    setSubmitting(true);
    try {
      let success = false;
      if (formData.id) {
        success = await updateBanner(
          formData.id,
          formData,
          formData.version?.toString() || "0",
        );
      } else {
        success = await createBanner(formData as any);
      }
      if (success) {
        toastSuccess("Lưu banner thành công!");
        onSuccess();
      }
    } catch (err: any) {
      toastError(err.message || "Lỗi hệ thống");
    } finally {
      setSubmitting(false);
    }
  };

  return { handleImageUpload, removeImage, submitForm };
};
