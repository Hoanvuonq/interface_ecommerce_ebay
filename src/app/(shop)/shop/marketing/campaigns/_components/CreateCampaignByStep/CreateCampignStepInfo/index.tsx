"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FormInput } from "@/components";
import {
  ImagePlus,
  X,
  Upload,
  Loader2,
  Calendar,
  LayoutGrid,
  Award,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { IStepInfo } from "../../CreateCampaignModal/type";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";

export const CreateCampignStepInfo: React.FC<IStepInfo> = ({
  form,
  setForm,
}) => {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const { uploadFile } = usePresignedUpload();

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "thumbnail",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File quá lớn (Max 5MB)");

    const previewUrl = URL.createObjectURL(file);
    if (type === "banner") {
      setBannerUploading(true);
      setForm({ ...form, bannerPreview: previewUrl });
      try {
        const result = await uploadFile(file, UploadContext.BANNER);
        setForm({
          ...form,
          bannerAssetId: result.assetId,
          bannerPreview: result.finalUrl || previewUrl,
        });
      } finally {
        setBannerUploading(false);
      }
    } else {
      setThumbnailUploading(true);
      setForm({ ...form, thumbnailPreview: previewUrl });
      try {
        const result = await uploadFile(file, UploadContext.BANNER);
        setForm({
          ...form,
          thumbnailAssetId: result.assetId,
          thumbnailPreview: result.finalUrl || previewUrl,
        });
      } finally {
        setThumbnailUploading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-5xl mx-auto py-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold  text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={14} /> Banner chiến dịch
            </label>
            <span className="text-[10px]  text-gray-400 italic">
              Tỷ lệ 3:1 (1200x400px)
            </span>
          </div>

          <div
            onClick={() => !bannerUploading && bannerInputRef.current?.click()}
            className={cn(
              "relative h-48 rounded-4xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group shadow-sm bg-slate-50",
              form.bannerPreview
                ? "border-orange-200"
                : "border-slate-200 hover:border-orange-400 hover:bg-orange-50/30",
            )}
          >
            {form.bannerPreview ? (
              <>
                <Image
                  src={form.bannerPreview}
                  alt="Banner"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button
                    type="button"
                    className="p-3 bg-white/20 hover:bg-white text-white hover:text-orange-600 rounded-2xl backdrop-blur-md transition-all shadow-xl active:scale-90 border border-white/30"
                  >
                    <Upload size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm({
                        ...form,
                        bannerPreview: undefined,
                        bannerAssetId: undefined,
                      });
                    }}
                    className="p-3 bg-white/20 hover:bg-red-500 text-white rounded-2xl backdrop-blur-md transition-all shadow-xl active:scale-90 border border-white/30"
                  >
                    <X size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2  text-gray-400">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <ImagePlus size={24} className="text-orange-400" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-tight">
                  Thêm Banner Quảng Cáo
                </p>
              </div>
            )}
            {bannerUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Area (4 cols) */}
        <div className="col-span-12 md:col-span-4 space-y-3">
          <label className="text-[11px] font-bold  text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Award size={14} /> Ảnh đại diện
          </label>
          <div
            onClick={() =>
              !thumbnailUploading && thumbnailInputRef.current?.click()
            }
            className={cn(
              "relative h-48 rounded-4xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group shadow-sm bg-slate-50",
              form.thumbnailPreview
                ? "border-orange-200"
                : "border-slate-200 hover:border-orange-400 hover:bg-orange-50/30",
            )}
          >
            {form.thumbnailPreview ? (
              <Image
                src={form.thumbnailPreview}
                alt="Thumb"
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2  text-gray-400">
                <ImagePlus size={24} />
                <p className="text-[10px] font-bold uppercase">1:1 Image</p>
              </div>
            )}
            {thumbnailUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                <Loader2 className="animate-spin text-orange-500" size={24} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: BASIC INFO */}
      <div className="grid grid-cols-12 gap-6 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
        <div className="col-span-12 md:col-span-7 space-y-5">
          <FormInput
            label="Tên chiến dịch"
            required
            placeholder="VD: Siêu Sale Năm Mới 2026..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-12 border-slate-200 focus:border-orange-400 font-bold  text-gray-700 rounded-2xl"
          />
          <FormInput
            label="Mô tả"
            isTextArea
            placeholder="Nhập nội dung ưu đãi thu hút khách hàng..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="h-32 border-slate-200 focus:border-orange-400 rounded-2xl"
          />
        </div>

        <div className="col-span-12 md:col-span-5 space-y-6 flex flex-col justify-between">
         <div className="flex items-center justify-between p-5 bg-orange-50/50 rounded-3xl border border-orange-100">
            <div>
              <span className="block text-xs font-bold  text-gray-600 uppercase tracking-tight">
                Độ ưu tiên hiển thị
              </span>
              <p className="text-[10px]  text-gray-400 font-medium">
                Số cao hơn sẽ ưu tiên lên đầu
              </p>
            </div>
            <FormInput
              type="number"
              min={1}
              placeholder="1"
              value={form.displayPriority ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  displayPriority: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              containerClassName="w-24"
              className="w-20! text-center h-10 text-base font-bold text-orange-600 border-orange-200 rounded-xl"
            />
          </div>
          <div className="p-5 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
            <div className="flex items-center gap-2 text-[11px] font-bold  text-gray-400 uppercase tracking-widest mb-1">
              <Calendar size={14} /> Thời gian chiến dịch
            </div>
            <div className="space-y-4">
              <FormInput
                type="datetime-local"
                label="Bắt đầu"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="h-10 bg-white rounded-xl text-sm"
              />
              <FormInput
                type="datetime-local"
                label="Kết thúc"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="h-10 bg-white rounded-xl text-sm"
              />
            </div>
          </div>

         
        </div>
      </div>

      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageChange(e, "banner")}
      />
      <input
        ref={thumbnailInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageChange(e, "thumbnail")}
      />
    </div>
  );
};
