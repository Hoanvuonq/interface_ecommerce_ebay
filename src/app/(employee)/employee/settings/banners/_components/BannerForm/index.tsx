/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo } from "react";
import { useBannerFormStore } from "../../_store/useBannerFormStore";
import { useBannerLogic } from "../../_hooks/useBannerLogic";
import { PortalModal } from "@/features/PortalModal";
import {
  FormInput,
  SelectComponent,
  CustomButtonActions,
  SectionHeader,
  DateTimeInput,
} from "@/components";
import {
  Monitor,
  Smartphone,
  Trash2,
  UploadCloud,
  Info,
  Calendar,
  Settings,
  Globe,
} from "lucide-react";
import {
  DeviceTarget,
  BannerDisplayLocation,
} from "@/app/(main)/(home)/_types/banner.dto";
import { useCategoryManager } from "@/app/(employee)/employee/categories/_hooks/useCategoryManager";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";

// Constants (Flattened for SelectComponent)
const LOCATION_OPTIONS = Object.entries(BannerDisplayLocation).map(
  ([key, value]) => ({
    label: value.replace(/_/g, " "),
    value: value,
  }),
);

const DEVICE_OPTIONS = [
  { label: "Tất cả thiết bị", value: DeviceTarget.ALL },
  { label: "Chỉ Desktop", value: DeviceTarget.DESKTOP },
  { label: "Chỉ Mobile", value: DeviceTarget.MOBILE },
];

export default function BannerForm({ banner, open, onSuccess, onCancel }: any) {
  const {
    formData,
    setFormField,
    setFormData,
    uploads,
    resetForm,
    syncFromBanner,
    isSubmitting,
  } = useBannerFormStore();
  const { handleImageUpload, removeImage, submitForm } =
    useBannerLogic(onSuccess);
  const { categories, fetchCategories } = useCategoryManager();

  // Load Data
  useEffect(() => {
    if (open) {
      fetchCategories(0, 100);
      if (banner) {
        const getUrl = (path?: string, ext?: string) =>
          path && ext
            ? toPublicUrl(toSizedVariant(`${path}.${ext}`, "_orig"))
            : null;
        syncFromBanner(banner, {
          base: getUrl(banner.basePath, banner.extension),
          desktop: getUrl(banner.basePathDesktop, banner.extensionDesktop),
          mobile: getUrl(banner.basePathMobile, banner.extensionMobile),
        });
      } else resetForm();
    }
  }, [open, banner, resetForm, syncFromBanner, fetchCategories]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onCancel}
      title={banner ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
      width="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-2">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-5">
            <SectionHeader icon={Info} title="Thông tin cơ bản" />
            <FormInput
              label="Tiêu đề chính"
              value={formData.title}
              onChange={(e) => setFormField("title", e.target.value)}
              placeholder="Vd: Summer Sale..."
            />
            <FormInput
              isTextArea
              label="Mô tả"
              value={formData.subtitle}
              onChange={(e) => setFormField("subtitle", e.target.value)}
              rows={2}
            />
            <FormInput
              label="Đường dẫn (Href)"
              value={formData.href}
              onChange={(e) => setFormField("href", e.target.value)}
              placeholder="/products/..."
            />
          </div>

          <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-5">
            <SectionHeader icon={Settings} title="Nhắm mục tiêu" />
            <div className="grid grid-cols-2 gap-4">
              <SelectComponent
                // label="Thiết bị"
                options={DEVICE_OPTIONS}
                value={formData.deviceTarget}
                onChange={(val) => setFormField("deviceTarget", val)}
              />
              <SelectComponent
                // label="Ngôn ngữ"
                options={[
                  { label: "Tiếng Việt", value: "vi" },
                  { label: "English", value: "en" },
                ]}
                value={formData.locale}
                onChange={(val) => setFormField("locale", val)}
              />
            </div>
            <SelectComponent
              // label="Vị trí hiển thị"
              options={LOCATION_OPTIONS}
              value={formData.displayLocation}
              onChange={(val) => setFormField("displayLocation", val)}
            />
          </div>
        </div>

        {/* CỘT PHẢI: MEDIA & LỊCH (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-orange-50/30 p-6 rounded-[2.5rem] border border-orange-100 space-y-6">
            <SectionHeader icon={Globe} title="Hình ảnh hiển thị" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desktop Upload Box */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Ảnh Desktop (1920x600)
                </p>
                {uploads.base.preview ? (
                  <div className="relative group aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={uploads.base.preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <button
                        onClick={() => removeImage("base")}
                        className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-orange-200 rounded-3xl cursor-pointer hover:bg-orange-100/50 transition-all">
                    <UploadCloud className="text-orange-400" size={32} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleImageUpload(e.target.files[0], "base")
                      }
                    />
                  </label>
                )}
              </div>

              {/* Mobile Upload Box */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Ảnh Mobile (Optional)
                </p>
                {uploads.mobile.preview ? (
                  <div className="relative group aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={uploads.mobile.preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <button
                        onClick={() => removeImage("mobile")}
                        className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-orange-200 rounded-3xl cursor-pointer hover:bg-orange-100/50 transition-all">
                    <Smartphone className="text-orange-400" size={32} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleImageUpload(e.target.files[0], "mobile")
                      }
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-[2.5rem] space-y-6">
            <SectionHeader
              icon={Calendar}
              title="Lịch trình & Hoàn tất"
              className="text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <DateTimeInput
                label="Thời gian bắt đầu"
                value={formData.scheduleStart}
                onChange={(val) => setFormField("scheduleStart", val)}
              />
              <DateTimeInput
                label="Thời gian kết thúc"
                value={formData.scheduleEnd}
                onChange={(val) => setFormField("scheduleEnd", val)}
              />
            </div>
            <CustomButtonActions
              submitText={banner ? "Cập nhật dữ liệu" : "Khởi tạo banner"}
              onCancel={onCancel}
              onSubmit={submitForm}
              // isProcessing={isSubmitting}
              className="w-full h-14 rounded-3xl font-black uppercase shadow-orange-500/20"
            />
          </div>
        </div>
      </div>
    </PortalModal>
  );
}
