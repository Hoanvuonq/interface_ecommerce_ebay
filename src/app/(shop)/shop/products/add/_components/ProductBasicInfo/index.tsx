"use client";

import { useProductStore } from "@/app/(shop)/shop/_stores/product.store";
import { FormInput } from "@/components";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { Info, Pencil } from "lucide-react";
import React from "react";
import { ProductImageCard } from "../ProductImageCard";
import { ProductVideoCard } from "../ProductVideoCard";

interface ProductBasicTabsProps {
  form: any;
  onOpenCategoryModal: () => void;
  onUploadImage: (file: File) => Promise<void>;
  onUploadVideo: (file: File) => Promise<void>;
  fileList: any[];
  setFileList: (files: any) => void;
  videoList: any[];
  setVideoList: (files: any) => void;
  onShowImageModal: (file: any) => void;
  onShowVideoModal: (file: any) => void;
}

export const ProductBasicTabs: React.FC<ProductBasicTabsProps> = ({
  form,
  onOpenCategoryModal,
  onUploadImage,
  onUploadVideo,
  fileList: propFileList,
  setFileList: propSetFileList,
  videoList: propVideoList,
  setVideoList: propSetVideoList,
  onShowImageModal,
  onShowVideoModal,
}) => {
  const {
    name,
    active,
    categoryPath,
    fileList: storeFileList,
    videoList: storeVideoList,
    setBasicInfo,
    setFileList: storeSetFileList,
    setVideoList: storeSetVideoList,
  } = useProductStore();

  // Use props if provided, otherwise use store
  const fileList = propFileList || storeFileList;
  const setFileList = propSetFileList || storeSetFileList;
  const videoList = propVideoList || storeVideoList;
  const setVideoList = propSetVideoList || storeSetVideoList;

  const { warning: toastWarning } = useToast();

  const handleSetFileList = (files: any) => {
    if (typeof files === "function") {
      setFileList(files);
    } else {
      setFileList(files);
    }
  };

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

  const handleImageUploadAction = async (files: FileList) => {
    const filesArray = Array.from(files);
    const MAX_IMAGES = 9;

    if (fileList.length + filesArray.length > MAX_IMAGES) {
      toastWarning(
        `Tối đa ${MAX_IMAGES} ảnh. Bạn còn ${
          MAX_IMAGES - fileList.length
        } lượt.`
      );
      return;
    }
    filesArray.forEach((file) => onUploadImage(file));
  };

  const handleVideoUploadAction = async (files: FileList) => {
    const file = files[0];
    if (file) await onUploadVideo(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in duration-500 items-start">
      <div className="flex-1 space-y-3 w-full">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 rounded-2xl animate-in zoom-in duration-500">
                  <Info className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  Thông tin chung
                </h3>
              </div>
              
              <div className="flex items-center gap-3 px-3 py-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <button
                  type="button"
                  onClick={() => handleActiveChange(!active)}
                  className={cn(
                    "relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ease-in-out shrink-0",
                    active 
                      ? "bg-linear-to-r from-orange-400 to-orange-500 shadow-md shadow-orange-200" 
                      : "bg-gray-300"
                  )}
                >
                  <span
                    className={cn(
                      "absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out shadow-md",
                      active ? "translate-x-6" : "translate-x-0.5"
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-sm w-17 font-bold whitespace-nowrap transition-colors duration-300 shrink-0",
                    active ? "text-orange-600" : "text-gray-500"
                  )}
                >
                  {active ? "Hoạt động" : "Tạm ẩn"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: "100ms" }}>
              <FormInput
                label="Tên sản phẩm"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="Ví dụ: Giày Sneaker Nam Cao Cấp"
                maxLength={120}
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: "150ms" }}>
              <label className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-1">
                Ngành hàng <span className="text-red-500">*</span>
              </label>
              <div
                onClick={onOpenCategoryModal}
                className="group relative h-12 w-full px-5 bg-linear-to-br from-gray-50 to-gray-25 border-2 border-gray-200 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-orange-400 hover:shadow-md active:scale-95"
              >
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    categoryPath ? "text-gray-800" : "text-gray-500"
                  )}
                >
                  {categoryPath || "Chọn ngành hàng"}
                </span>
                <Pencil className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>
            </div>
          </div>
        </div>

        <ProductImageCard
          fileList={fileList as any}
          setFileList={handleSetFileList}
          onUpload={handleImageUploadAction}
          onRemove={(uid) => setFileList(fileList.filter((f) => f.uid !== uid))}
          onPreview={onShowImageModal}
        />

        <ProductVideoCard
          videoList={videoList as any}
          onUpload={handleVideoUploadAction}
          onRemove={(uid) =>
            setVideoList(videoList.filter((v) => v.uid !== uid))
          }
          onPreview={onShowVideoModal}
        />
      </div>
    </div>
  );
};
