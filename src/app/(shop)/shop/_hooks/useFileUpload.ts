import { useState } from "react";
import { UploadFile } from "@/app/(main)/orders/_types/review";
import { UploadContext } from "@/types/storage/storage.types";

export const useFileUpload = (uploadPresigned: (file: File, context: UploadContext) => Promise<any>) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [videoList, setVideoList] = useState<UploadFile[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleUpload = async (file: File, onError: (message: string) => void) => {
    try {
      setUploading(true);
      const localUrl = URL.createObjectURL(file);
      const tempUid = `temp-${Date.now()}-${Math.random()}`;

      setFileList((prev) => [
        ...prev,
        {
          uid: tempUid,
          name: file.name,
          url: localUrl,
          status: "uploading",
          processing: true,
        } as any,
      ]);

      const res = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);
      if (!res.finalUrl) throw new Error("Xử lý ảnh chưa sẵn sàng");

      setFileList((prev) =>
        prev.map((f) => {
          if (f.uid === tempUid) {
            try {
              if (f.url && String(f.url).startsWith("blob:"))
                URL.revokeObjectURL(String(f.url));
            } catch {}
            return {
              ...f,
              url: res.finalUrl,
              status: "done",
              processing: false,
              assetId: res.assetId,
            } as any;
          }
          return f;
        })
      );
    } catch (err) {
      console.error("Upload failed:", err);
      onError("Upload ảnh thất bại");
      setFileList((prev) =>
        prev.filter((f) => f.uid !== `temp-${Date.now()}-${Math.random()}`)
      );
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (file: File, onError: (message: string) => void) => {
    const tempUid = `temp-video-${Date.now()}-${Math.random()}`;
    try {
      setUploadingVideo(true);
      const localUrl = URL.createObjectURL(file);

      setVideoList((prev) => [
        ...prev,
        {
          uid: tempUid,
          name: file.name,
          url: localUrl,
          status: "uploading",
          processing: true,
        } as any,
      ]);

      const res = await uploadPresigned(file, UploadContext.PRODUCT_VIDEO);
      if (!res.finalUrl) throw new Error("Xử lý video chưa sẵn sàng");

      setVideoList((prev) =>
        prev.map((f) => {
          if (f.uid === tempUid) {
            try {
              if (f.url && String(f.url).startsWith("blob:"))
                URL.revokeObjectURL(String(f.url));
            } catch {}
            return {
              ...f,
              url: res.finalUrl,
              status: "done",
              processing: false,
              assetId: res.assetId,
            } as any;
          }
          return f;
        })
      );
    } catch (err) {
      console.error("Video upload failed:", err);
      onError("Upload video thất bại");
      setVideoList((prev) => prev.filter((f) => f.uid !== tempUid));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemoveVideo = (file: UploadFile) => {
    setVideoList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const removeImage = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  return {
    uploading,
    fileList,
    setFileList,
    videoList,
    setVideoList,
    uploadingVideo,
    handleUpload,
    handleVideoUpload,
    handleRemoveVideo,
    removeImage,
  };
};
