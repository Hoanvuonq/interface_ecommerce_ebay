"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FormInput } from "@/components";
import { ImagePlus, X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { IStepInfo } from "../CreateCampaignModal/type";
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

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file tối đa 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "banner") {
      setBannerUploading(true);
      setForm({
        ...form,
        bannerPreview: previewUrl,
        bannerAssetId: undefined,
      });

      try {
        const result = await uploadFile(file, UploadContext.BANNER);
        setForm({
          ...form,
          bannerAssetId: result.assetId,
          bannerPreview: result.finalUrl || previewUrl,
        });
      } catch (error) {
        console.error("Banner upload failed:", error);
        alert("Upload banner thất bại. Vui lòng thử lại.");
        setForm({
          ...form,
          bannerPreview: undefined,
          bannerAssetId: undefined,
        });
      } finally {
        setBannerUploading(false);
      }
    } else {
      setThumbnailUploading(true);
      setForm({
        ...form,
        thumbnailPreview: previewUrl,
        thumbnailAssetId: undefined,
      });

      try {
        const result = await uploadFile(file, UploadContext.BANNER);
        setForm({
          ...form,
          thumbnailAssetId: result.assetId,
          thumbnailPreview: result.finalUrl || previewUrl,
        });
      } catch (error) {
        console.error("Thumbnail upload failed:", error);
        alert("Upload thumbnail thất bại. Vui lòng thử lại.");
        setForm({
          ...form,
          thumbnailPreview: undefined,
          thumbnailAssetId: undefined,
        });
      } finally {
        setThumbnailUploading(false);
      }
    }

    // Reset input to allow re-selecting the same file
    e.target.value = "";
  };

  const removeImage = (type: "banner" | "thumbnail") => {
    if (type === "banner") {
      setForm({
        ...form,
        bannerPreview: undefined,
        bannerAssetId: undefined,
      });
    } else {
      setForm({
        ...form,
        thumbnailPreview: undefined,
        thumbnailAssetId: undefined,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Banner Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-800 uppercase tracking-tight">
          Banner chiến dịch
          <span className="text-[10px] text-slate-400 font-bold ml-2 italic">
            (Khuyến nghị: 1200x400px - Tỉ lệ 3:1)
          </span>
          {form.bannerAssetId && (
            <span className="ml-2 text-[10px] text-green-600 font-bold">
              ✓ Đã upload
            </span>
          )}
        </label>
        <div
          onClick={() => !bannerUploading && bannerInputRef.current?.click()}
          className={cn(
            "relative w-full h-44 rounded-4xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group shadow-sm",
            bannerUploading && "pointer-events-none opacity-70",
            form.bannerPreview
              ? "border-orange-500/20"
              : "border-slate-200 hover:border-orange-400 hover:bg-orange-50/20",
          )}
        >
          {form.bannerPreview ? (
            <>
              <Image
                src={form.bannerPreview}
                alt="Banner preview"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {bannerUploading && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={32} className="animate-spin text-white" />
                    <span className="text-white text-sm font-bold">Đang upload...</span>
                  </div>
                </div>
              )}
              {!bannerUploading && (
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      bannerInputRef.current?.click();
                    }}
                    className="p-3 bg-white rounded-2xl text-slate-900 hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-90"
                  >
                    <Upload size={20} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage("banner");
                    }}
                    className="p-3 bg-white rounded-2xl text-slate-900 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="p-4 bg-slate-50 rounded-3xl mb-3 shadow-inner">
                <ImagePlus size={32} className="text-slate-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Click để tải banner
              </span>
            </div>
          )}
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, "banner")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-tight">
            Thumbnail
            <span className="text-[10px] text-slate-400 font-bold ml-1 italic">
              (1:1)
            </span>
            {form.thumbnailAssetId && (
              <span className="ml-1 text-[10px] text-green-600 font-bold">
                ✓
              </span>
            )}
          </label>
          <div
            onClick={() => !thumbnailUploading && thumbnailInputRef.current?.click()}
            className={cn(
              "relative aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group shadow-sm",
              thumbnailUploading && "pointer-events-none opacity-70",
              form.thumbnailPreview
                ? "border-orange-500/20"
                : "border-slate-200 hover:border-orange-400 hover:bg-orange-50/20",
            )}
          >
            {form.thumbnailPreview ? (
              <>
                <Image
                  src={form.thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {thumbnailUploading && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 size={24} className="animate-spin text-white" />
                  </div>
                )}
                {!thumbnailUploading && (
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        thumbnailInputRef.current?.click();
                      }}
                      className="p-2 bg-white rounded-xl text-slate-900 hover:bg-orange-500 hover:text-white transition-all active:scale-90"
                    >
                      <Upload size={16} strokeWidth={3} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage("thumbnail");
                      }}
                      className="p-2 bg-white rounded-xl text-slate-900 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <ImagePlus size={24} className="mb-1 opacity-50" />
                <span className="text-[10px] font-bold uppercase">
                  Ảnh đại diện
                </span>
              </div>
            )}
          </div>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, "thumbnail")}
          />
        </div>

        {/* Campaign Name & Description */}
        <div className="md:col-span-3 space-y-4">
          <FormInput
            label="Tên chiến dịch"
            required
            placeholder="VD: Flash Sale hè 2026..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-12 text-sm font-bold shadow-sm"
          />
          <FormInput
            label="Mô tả chiến dịch"
            isTextArea
            placeholder="Nội dung khuyến mãi dành cho khách hàng..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="h-28 text-sm font-medium leading-relaxed shadow-sm"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
        <FormInput
          label="Thời gian bắt đầu"
          type="datetime-local"
          required
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="h-11 font-bold"
        />
        <FormInput
          label="Thời gian kết thúc"
          type="datetime-local"
          required
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="h-11 font-bold"
        />
      </div>

      <div className="flex items-center gap-6 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">
            Độ ưu tiên hiển thị
          </label>
          <p className="text-[11px] text-slate-500 font-bold italic">
            * Số càng cao, chiến dịch càng được đẩy lên đầu trang chủ shop.
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
          className="w-28 text-center h-11 text-lg font-bold text-orange-600 bg-orange-50/20!"
        />
      </div>
    </div>
  );
};
