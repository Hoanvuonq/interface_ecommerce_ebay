"use client";

import { useState, useEffect } from "react";
import { useCreateReview, useUpdateReview } from "@/hooks/useReview";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { UploadFile, ReviewModalProps } from "../_types/review";
import { useToast } from "@/hooks/useToast";
import { ReviewType } from "@/app/(employee)/employee/reviews/_types/review.type";
export const useReviewModalLogic = ({
  open,
  productId,
  orderId,
  existingReview,
  onCancel,
  onSuccess,
}: ReviewModalProps) => {
  const { mutate: createReview, loading: createLoading } = useCreateReview();
  const { mutate: updateReview, loading: updateLoading } = useUpdateReview();
  const { uploadFile, uploading: uploadingMedia } = usePresignedUpload();
  const { success, error: ToastError,warning } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedAssetIds, setUploadedAssetIds] = useState<Map<string, string>>(
    new Map()
  );
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const isUpdateMode = !!existingReview;

  useEffect(() => {
    if (open) {
      setRating(existingReview?.rating ?? 0);
      setComment(existingReview?.comment ?? "");
      setFileList([]);
      setUploadedAssetIds(new Map());
      setUploadingFiles(new Set());
    }
  }, [open, existingReview]);

  const resetState = () => {
    fileList.forEach((file) => {
      if (file.thumbUrl?.startsWith("blob:"))
        URL.revokeObjectURL(file.thumbUrl);
    });
    setRating(0);
    setComment("");
    setFileList([]);
    onCancel();
  };

  const handleNativeFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const currentImages = fileList.filter((f) =>
      f.type?.startsWith("image/")
    ).length;
    const currentVideos = fileList.filter((f) =>
      f.type?.startsWith("video/")
    ).length;

    const validFiles: File[] = [];
    let newImages = 0;
    let newVideos = 0;

    for (const file of fileArray) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        ToastError(`${file.name} không đúng định dạng!`);
        continue;
      }
      if (file.size / 1024 / 1024 > 10) {
        ToastError(`${file.name} vượt quá 10MB!`);
        continue;
      }
      if (isImage) newImages++;
      if (isVideo) newVideos++;
      validFiles.push(file);
    }

    if (currentImages + newImages > 5) return ToastError("Tối đa 5 hình ảnh!");
    if (currentVideos + newVideos > 2) return ToastError("Tối đa 2 video!");

    const newUploads: UploadFile[] = validFiles.map((file) => ({
      uid: crypto.randomUUID(),
      name: file.name,
      status: "uploading",
      originFileObj: file,
      type: file.type,
      thumbUrl: URL.createObjectURL(file),
    }));

    setFileList((prev) => [...prev, ...newUploads]);

    newUploads.forEach(async (fileWrapper) => {
      const { uid, originFileObj, type } = fileWrapper;
      setUploadingFiles((prev) => new Set(prev).add(uid));

      try {
        const context = type?.startsWith("image/")
          ? UploadContext.REVIEW_IMAGE
          : UploadContext.REVIEW_VIDEO;
        const result = await uploadFile(originFileObj!, context);

        if (result.assetId) {
          setUploadedAssetIds((prev) => new Map(prev).set(uid, result.assetId));
          setFileList((prev) =>
            prev.map((f) =>
              f.uid === uid ? { ...f, status: "done", url: result.finalUrl } : f
            )
          );
        }
      } catch (error) {
        setFileList((prev) =>
          prev.map((f) => (f.uid === uid ? { ...f, status: "error" } : f))
        );
      } finally {
        setUploadingFiles((prev) => {
          const next = new Set(prev);
          next.delete(uid);
          return next;
        });
      }
    });
  };

  const handleRemoveFile = (uid: string) => {
    const file = fileList.find((f) => f.uid === uid);
    if (file?.thumbUrl?.startsWith("blob:")) URL.revokeObjectURL(file.thumbUrl);

    setFileList((prev) => prev.filter((f) => f.uid !== uid));
    setUploadedAssetIds((prev) => {
      const next = new Map(prev);
      next.delete(uid);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) return ToastError("Vui lòng chọn số sao");
    if (uploadingFiles.size > 0)
      return warning("Vui lòng chờ tải media xong!");

    try {
      if (isUpdateMode && existingReview) {
        await updateReview(existingReview.id, { rating, comment });
        success("Cập nhật thành công!");
      } else {
        const mediaAssetIds = fileList
          .map((f) => uploadedAssetIds.get(f.uid))
          .filter((id): id is string => !!id);

        await createReview({
          reviewType: ReviewType.PRODUCT,
          reviewableId: productId,
          rating,
          comment,
          orderId,
          mediaAssetIds: mediaAssetIds.length > 0 ? mediaAssetIds : undefined,
        });
        success("Gửi đánh giá thành công!");
      }
      resetState();
      onSuccess?.();
    } catch (error) {
      ToastError("Thao tác thất bại!");
    }
  };

  return {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    fileList,
    uploadingFiles,
    handleNativeFileSelect,
    handleRemoveFile,
    handleSubmit,
    resetState,
    isUpdateMode,
    isLoading:
      createLoading ||
      updateLoading ||
      uploadingMedia ||
      uploadingFiles.size > 0,
  };
};
