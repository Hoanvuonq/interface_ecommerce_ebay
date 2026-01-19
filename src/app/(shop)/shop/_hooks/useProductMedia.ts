import { useState } from 'react';
import { UploadFile } from '@/app/(main)/orders/_types/review';
import { useProductStore } from '../_stores/product.store';
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { useToast } from '@/hooks/useToast';

export const useProductMedia = () => {
  const {success, warning, error} = useToast();
  const { setFileList, setVideoList } = useProductStore();
  const { uploadFile: uploadPresigned } = usePresignedUpload();
  
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploading(true);
      const localUrl = URL.createObjectURL(file as File);
      const tempUid = (file as any).uid;

      setFileList((prev) => [
        ...prev,
        { ...file, url: localUrl, status: "uploading", uid: tempUid, processing: true } as any,
      ]);

      const res = await uploadPresigned(file as File, UploadContext.PRODUCT_IMAGE);
      if (!res.finalUrl) throw new Error("Upload failed");

      setFileList((prev) =>
        prev.map((f) => f.uid === tempUid 
          ? { ...f, url: res.finalUrl, status: "done", processing: false, assetId: res.assetId } as any 
          : f
        )
      );
      onSuccess({ url: res.finalUrl });
    } catch (err) {
      onError(err);
      error("Upload ảnh thất bại");
      setFileList((prev) => prev.filter((f) => f.uid !== (file as any).uid));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (file: UploadFile) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  // --- Video Handlers ---
  const handleVideoUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploadingVideo(true);
      const localUrl = URL.createObjectURL(file as File);
      const tempUid = (file as any).uid;

      setVideoList((prev) => [
        ...prev,
        { ...file, url: localUrl, status: "uploading", uid: tempUid, processing: true } as any,
      ]);

      const res = await uploadPresigned(file as File, UploadContext.PRODUCT_VIDEO);
      if (!res.finalUrl) throw new Error("Upload failed");

      setVideoList((prev) =>
        prev.map((f) => f.uid === tempUid 
          ? { ...f, url: res.finalUrl, status: "done", processing: false, assetId: res.assetId } as any 
          : f
        )
      );
      onSuccess({ url: res.finalUrl });
    } catch (err) {
      onError(err);
      error("Upload video thất bại");
      setVideoList((prev) => prev.filter((f) => f.uid !== (file as any).uid));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemoveVideo = (file: UploadFile) => {
    setVideoList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  // --- Variant Image Upload ---
  const handleVariantImageUpload = async (file: File, variantIndex: number) => {
    try {
        const { updateVariant } = useProductStore.getState();
        const localUrl = URL.createObjectURL(file);
        
        // Optimistic update
        updateVariant(variantIndex, 'imageUrl', localUrl);
        updateVariant(variantIndex, 'imageProcessing', true);

        const res = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);
        
        if (res.finalUrl && res.assetId) {
            updateVariant(variantIndex, 'imageUrl', res.finalUrl);
            updateVariant(variantIndex, 'imageAssetId', res.assetId);
            updateVariant(variantIndex, 'imageProcessing', false);
            success("Upload ảnh biến thể thành công");
            URL.revokeObjectURL(localUrl);
        }
    } catch (e) {
        error("Lỗi upload ảnh biến thể");
        useProductStore.getState().updateVariant(variantIndex, 'imageProcessing', false);
    }
  };

  return {
    uploading,
    uploadingVideo,
    handleImageUpload,
    handleRemoveImage,
    handleVideoUpload,
    handleRemoveVideo,
    handleVariantImageUpload
  };
};