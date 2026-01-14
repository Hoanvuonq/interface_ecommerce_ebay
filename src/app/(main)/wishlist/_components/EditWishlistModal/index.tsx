"use client";

import { PortalModal } from "@/features/PortalModal";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import {
  UpdateWishlistRequest,
  WishlistResponse,
} from "@/types/wishlist/wishlist.types";
import { cn } from "@/utils/cn";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import { motion } from "framer-motion";
import { Edit3, Loader2, Lock, Plus, Save, Trash2, Unlock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";
import { FormInput } from "@/components/formInput";

interface EditWishlistModalProps {
  visible: boolean;
  onClose: () => void;
  wishlist: WishlistResponse;
  onUpdate: (id: string, data: UpdateWishlistRequest) => Promise<void>;
}

export default function EditWishlistModal({
  visible,
  onClose,
  wishlist,
  onUpdate,
}: EditWishlistModalProps) {
  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [coverAssetId, setCoverAssetId] = useState<string | null>(null);
  const { success: toastSuccess, error: toastError } = useToast();
  // Upload States
  const { uploadFile: uploadPresigned, uploading: uploadingImage } =
    usePresignedUpload();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (visible && wishlist) {
      setName(wishlist.name);
      setDescription(wishlist.description || "");
      setIsPublic(wishlist.isPublic);

      if (wishlist.imageBasePath && wishlist.imageExtension) {
        const rawPath = `${wishlist.imageBasePath}${wishlist.imageExtension}`;
        setPreviewImage(toPublicUrl(toSizedVariant(rawPath, "_orig")));
      } else {
        setPreviewImage("");
      }
      setCoverAssetId(null);
      setUploadProgress(0);
    }
  }, [visible, wishlist]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastError("Vui lòng chọn tệp hình ảnh!");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);
    setUploadProgress(10);

    try {
      const res = await uploadPresigned(file, UploadContext.WISHLIST_COVER);
      if (res.assetId) {
        setCoverAssetId(res.assetId);
        setUploadProgress(100);
        toastSuccess("Tải ảnh bìa thành công!");
      }
    } catch (err) {
      toastError("Tải ảnh thất bại");
      setPreviewImage("");
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setCoverAssetId("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toastError("Tên danh mục không được để trống");
      return;
    }

    try {
      setUpdating(true);
      const updateData: UpdateWishlistRequest = {
        name,
        description,
        isPublic,
        coverImageAssetId: coverAssetId === null ? undefined : coverAssetId,
      };

      await onUpdate(wishlist.id, updateData);
      toastSuccess("Cập nhật danh mục thành công! 🎉");
      onClose();
    } catch (error) {
      toastError("Không thể cập nhật danh mục");
    } finally {
      setUpdating(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
        <Edit3 size={20} />
      </div>
      <div>
        <h3 className="text-md font-bold text-gray-900 uppercase ">
          Chỉnh sửa Wishlist
        </h3>
        <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">
          Cập nhật bộ sưu tập của bạn
        </p>
      </div>
    </div>
  );

  const modalFooter = (
    <div className="flex gap-3 ">
      <Button variant="edit" onClick={onClose}>
        Hủy bỏ
      </Button>
      <ButtonField
        form="address-form"
        htmlType="submit"
        type="login"
        disabled={updating || uploadingImage}
        onClick={handleSubmit}
        className="flex w-50 items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        <span className="flex items-center gap-2">
          {updating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {updating ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
        </span>
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={visible}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
      width="max-w-xl"
      className="rounded-[2.5rem]"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">
            Ảnh bìa danh mục
          </label>
          <div className="relative group aspect-21/9 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center transition-all hover:border-gray-300 shadow-inner">
            {previewImage ? (
              <>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={handleRemoveImage}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-red-500 transition-colors shadow-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                  {uploadingImage ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus size={24} />
                  )}
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                  Tải ảnh mới
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                />
              </label>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                <div className="w-full max-w-50 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <FormInput
          label="Tên danh mục"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên wishlist..."
        />
        <FormInput
          isTextArea
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn gọn về danh sách này..."
          rows={3}
        />
        
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase  text-gray-600 ml-1">
            Cài đặt quyền riêng tư
          </label>
          <div
            onClick={() => setIsPublic(!isPublic)}
            className={cn(
              "flex items-center justify-between p-5 rounded-[1.8rem] border cursor-pointer transition-all",
              isPublic
                ? "bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-100"
                : "bg-gray-50 border-gray-200 shadow-inner"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                  isPublic
                    ? "bg-white text-emerald-500"
                    : "bg-white text-gray-600"
                )}
              >
                {isPublic ? <Unlock size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <h4
                  className={cn(
                    "text-sm font-semibold uppercase tracking-tight",
                    isPublic ? "text-emerald-700" : "text-gray-700"
                  )}
                >
                  {isPublic ? "Công khai" : "Riêng tư"}
                </h4>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5 leading-none">
                  {isPublic
                    ? "Mọi người có thể xem qua link"
                    : "Chỉ mình bạn xem được"}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors p-1",
                isPublic ? "bg-emerald-500" : "bg-gray-300"
              )}
            >
              <motion.div
                animate={{ x: isPublic ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
}
