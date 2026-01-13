"use client";
import React from "react";
import { useProductStore } from "@/app/(shop)/shop/_store/product.store";
import {
  Check,
  Trash2,
  PlayCircle,
  Image as ImageIcon,
  Info,
  Pencil,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { FormInput } from "@/components";
import { useToast } from "@/hooks/useToast";
interface ProductBasicTabsProps {
  form: any;
  onOpenCategoryModal: () => void;
  onUploadImage: (file: File) => Promise<void>;
  onUploadVideo: (file: File) => Promise<void>;
  onShowImageModal: (file: any) => void;
  onShowVideoModal: (file: any) => void;
}

export const ProductBasicTabs: React.FC<ProductBasicTabsProps> = ({
  form,
  onOpenCategoryModal,
  onUploadImage,
  onUploadVideo,
  onShowImageModal,
  onShowVideoModal,
}) => {
  const {
    name,
    active,
    categoryPath,
    fileList,
    videoList,
    uploading,
    setBasicInfo,
    setFileList,
    setVideoList,
  } = useProductStore();
  const { error: toastError, warning: toastWarning } = useToast();
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setBasicInfo("name", value);
    form.setFieldValue("name", value);
  };

  const handleActiveChange = (checked: boolean) => {
    setBasicInfo("active", checked);
    form.setFieldValue("active", checked);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toastWarning(`File ${file.name} không phải là hình ảnh!`);
        continue;
      }

      if (file.size > MAX_SIZE_BYTES) {
        toastError(
          `Ảnh "${file.name}" quá lớn (${(file.size / 1024 / 1024).toFixed(
            2
          )}MB). Vui lòng chọn ảnh dưới ${MAX_SIZE_MB}MB.`
        );
        continue;
      }

      await onUploadImage(file);
    }

    e.target.value = ""; // Reset input để có thể chọn lại cùng 1 file nếu cần
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("video/")) continue;
        await onUploadVideo(file);
      }
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-500">
      {/* CARD 1: THÔNG TIN CƠ BẢN */}
      <div className="bg-white rounded-4xl p-8 shadow-custom border border-orange-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Info className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Thông tin cơ bản</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Tên sản phẩm"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="Ví dụ: Giày Sneaker Nam Cao Cấp"
            maxLength={120}
          />

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-600 ml-1 flex items-center gap-1">
              Ngành hàng <span className="text-red-500">*</span>
            </label>
            <div
              onClick={onOpenCategoryModal}
              className="h-12 w-full px-5 bg-gray-50/50 border border-gray-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-orange-500 transition-all group shadow-sm"
            >
              <span
                className={cn(
                  "text-sm font-semibold",
                  categoryPath ? "text-gray-700" : "text-gray-500 font-normal"
                )}
              >
                {categoryPath || "Chọn ngành hàng sản phẩm"}
              </span>
              <Pencil className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-4 p-4 bg-orange-50/30 rounded-2xl border border-orange-100/50">
            <label className="text-sm font-bold text-gray-700">
              Trạng thái:
            </label>
            <button
              type="button"
              onClick={() => handleActiveChange(!active)}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300",
                active ? "bg-orange-500 shadow-md" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                  active ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-bold",
                active ? "text-orange-600" : "text-gray-500"
              )}
            >
              {active ? "Đang kinh doanh" : "Tạm ẩn"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CARD 2: HÌNH ẢNH SẢN PHẨM */}
        <div className="lg:col-span-2 bg-white rounded-4xl p-8 shadow-custom border border-orange-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <ImageIcon className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Hình ảnh sản phẩm
              </h3>
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {fileList.length} / 9 Ảnh
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* --- LIST PREVIEW ẢNH --- */}
            {fileList.map((file, index) => (
              <div key={file.uid} className="relative group">
                <div
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm",
                    index === 0
                      ? "border-orange-500 ring-4 ring-orange-500/10"
                      : "border-gray-100 hover:border-orange-200"
                  )}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className={cn(
                      "w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500",
                      file.processing && "opacity-50 blur-[2px]"
                    )}
                    onClick={() => onShowImageModal(file)}
                  />

                  {/* Overlay Đang tải */}
                  {file.processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                    </div>
                  )}

                  {/* Badge Ảnh chính */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-[9px] text-white font-bold rounded-md shadow-lg">
                      ẢNH CHÍNH
                    </div>
                  )}

                  {/* Nút Xóa */}
                  <button
                    type="button"
                    onClick={() =>
                      setFileList(fileList.filter((f) => f.uid !== file.uid))
                    }
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = [...fileList];
                      const [item] = newFiles.splice(index, 1);
                      newFiles.unshift(item);
                      setFileList(newFiles);
                    }}
                    className="mt-2 w-full py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                  >
                    LÀM ẢNH CHÍNH
                  </button>
                )}
              </div>
            ))}

            {fileList.length < 9 && (
              <label
                className={cn(
                  "aspect-square border-2 border-dashed border-orange-200 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-50 hover:border-orange-400 transition-all cursor-pointer group relative overflow-hidden",
                  uploading && "pointer-events-none opacity-60"
                )}
              >
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="p-3 bg-orange-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <span className="mt-2 text-[11px] font-bold text-orange-600">
                  THÊM ẢNH
                </span>

                <span className="text-[9px] text-gray-400 font-medium mt-1">
                  Tối đa 2MB mỗi ảnh
                </span>
              </label>
            )}
          </div>
        </div>

        {/* CARD 3: VIDEO */}
        <div className="bg-white rounded-4xl p-8 shadow-custom border border-orange-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-xl">
              <PlayCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Video</h3>
          </div>

          <div className="space-y-4">
            {videoList.map((file) => (
              <div
                key={file.uid}
                className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black group shadow-sm"
              >
                <video
                  src={file.url}
                  className="w-full h-full object-cover opacity-70"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all"
                  onClick={() => onShowVideoModal(file)}
                >
                  {file.processing ? (
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setVideoList(videoList.filter((v) => v.uid !== file.uid))
                  }
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {videoList.length < 3 && (
              <label className="w-full aspect-video border-2 border-dashed border-orange-200 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-50 hover:border-orange-400 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <div className="p-3 bg-orange-100 rounded-full group-hover:rotate-90 transition-transform duration-500">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <span className="mt-2 text-xs font-bold text-orange-600">
                  THÊM VIDEO
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Tối đa 30MB • MP4
                </span>
              </label>
            )}

            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex gap-3">
              <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                Video giúp khách hàng có cái nhìn thực tế hơn. Nên quay sản phẩm
                ở điều kiện ánh sáng tốt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
