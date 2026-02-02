/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import {
  Monitor,
  Smartphone,
  Info,
  Calendar,
  Settings,
  Globe,
  Tag,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

import { StatusTabs } from "@/app/(shop)/shop/_components";
import { useBannerFormStore } from "../../_store/useBannerFormStore";
import { useBannerLogic } from "../../_hooks/useBannerLogic";
import { PortalModal } from "@/features/PortalModal";
import {
  FormInput,
  SelectComponent,
  CustomButtonActions,
  SectionHeader,
  DateTimeInput,
  MediaUploadField,
} from "@/components";
import {
  DeviceTarget,
  BannerDisplayLocation,
} from "@/app/(main)/(home)/_types/banner.dto";
import { useCategoryManager } from "@/app/(employee)/employee/categories/_hooks/useCategoryOperations";
import { toPublicUrl } from "@/utils/storage/url";
import { CustomFile } from "@/components/mediaUploadField/type";
import { cn } from "@/utils/cn";

const LOCATION_OPTIONS = Object.entries(BannerDisplayLocation).map(
  ([key, value]) => ({
    label: _.startCase(_.lowerCase(value)),
    value: value,
  }),
);

const DEVICE_TABS = [
  { key: DeviceTarget.ALL, label: "Tất cả", icon: Globe },
  { key: DeviceTarget.DESKTOP, label: "Desktop", icon: Monitor },
  { key: DeviceTarget.MOBILE, label: "Mobile", icon: Smartphone },
];

export default function BannerForm({ banner, open, onSuccess, onCancel }: any) {
  const {
    formData,
    setFormField,
    uploads,
    resetForm,
    syncFromBanner,
    isSubmitting,
  } = useBannerFormStore();
  const { handleImageUpload, removeImage, submitForm } =
    useBannerLogic(onSuccess);
  const { fetchCategories } = useCategoryManager();

  const { data: categories = [], isLoading: categoryLoading } = useQuery({
    queryKey: ["categories", "list-all"],
    queryFn: async () => {
      const res = (await fetchCategories(0, 100)) as any;
      return res?.data?.content || res?.content || [];
    },
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (open) {
      if (banner) {
        const getUrl = (path?: string) =>
          path ? toPublicUrl(path.replace("*", "orig")) : null;
        syncFromBanner(banner, {
          base: getUrl(banner.imagePath),
          desktop: getUrl(banner.imagePathDesktop),
          mobile: getUrl(banner.imagePathMobile),
        });
      } else resetForm();
    }
  }, [open, banner, resetForm, syncFromBanner]);

  const getMediaValue = (previewUrl?: string | null): CustomFile[] => {
    if (!previewUrl) return [];
    return [
      { uid: "-1", name: "preview", status: "done" as const, url: previewUrl },
    ];
  };

  const isCategoryRelated = useMemo(() => {
    return _.includes(
      [
        BannerDisplayLocation.CATEGORY_PAGE_TOP,
        BannerDisplayLocation.CATEGORY_PAGE_SIDEBAR,
        BannerDisplayLocation.PRODUCT_LIST_TOP,
        BannerDisplayLocation.PRODUCT_LIST_SIDEBAR,
      ],
      formData.displayLocation,
    );
  }, [formData.displayLocation]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onCancel}
      title={banner ? "Chỉnh sửa Banner" : "Thiết lập Banner mới"}
      width="max-w-7xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
        {/* CỘT TRÁI: CONFIG */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-4xl border border-gray-100 space-y-5 shadow-custom">
            <SectionHeader icon={Info} title="Nội dung" />
            <FormInput
              label="Tiêu đề chính"
              value={formData.title}
              onChange={(e) => setFormField("title", e.target.value)}
              placeholder="Nhập tiêu đề..."
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
              placeholder="https://..."
            />
          </div>

          <div className="bg-white p-6 rounded-4xl border border-gray-100 space-y-5 shadow-custom">
            <SectionHeader icon={Settings} title="Nhắm mục tiêu" />
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">
                Thiết bị hiển thị
              </label>
              <StatusTabs
                tabs={DEVICE_TABS}
                current={formData.deviceTarget}
                onChange={(key) => setFormField("deviceTarget", key)}
                layoutId="form-device-tabs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectComponent
                options={[
                  { label: "Tiếng Việt", value: "vi" },
                  { label: "English", value: "en" },
                ]}
                value={formData.locale}
                onChange={(val) => setFormField("locale", val)}
              />
              <SelectComponent
                options={LOCATION_OPTIONS}
                value={formData.displayLocation}
                onChange={(val) => setFormField("displayLocation", val)}
              />
            </div>
            {isCategoryRelated && (
              <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 animate-in fade-in">
                <label className="text-[10px] font-bold text-orange-500 uppercase flex items-center gap-1 mb-2">
                  <Tag size={12} /> Danh mục
                </label>
                <SelectComponent
                  placeholder="Chọn danh mục..."
                  options={_.map(categories, (c: any) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  value={formData.categoryId}
                  onChange={(val) => setFormField("categoryId", val)}
                  disabled={categoryLoading}
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-50/50 p-6 rounded-4xl border border-gray-100 shadow-custom space-y-6">
            <SectionHeader icon={ImageIcon} title="Tài nguyên hình ảnh" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div
                className={cn(
                  "space-y-2",
                  formData.deviceTarget === DeviceTarget.ALL
                    ? "md:col-span-2"
                    : "md:col-span-1",
                )}
              >
                <p className="text-[10px] font-bold uppercase text-gray-400 ml-2 flex items-center gap-2">
                  <Layers size={14} /> Ảnh mặc định (Bắt buộc)
                </p>
                <MediaUploadField
                  size="lg"
                  value={getMediaValue(uploads.base.preview)}
                  maxCount={1}
                  classNameSizeUpload={cn(
                    "rounded-3xl border-gray-200",
                    formData.deviceTarget === DeviceTarget.ALL
                      ? "aspect-[21/9]"
                      : "aspect-video",
                  )}
                  onChange={(files) =>
                    files.length === 0
                      ? removeImage("base")
                      : files[0].originFileObj &&
                        handleImageUpload(files[0].originFileObj, "base")
                  }
                />
              </div>

              {(formData.deviceTarget === DeviceTarget.ALL ||
                formData.deviceTarget === DeviceTarget.DESKTOP) && (
                <div className="space-y-2 animate-in zoom-in-95 duration-300">
                  <p className="text-[10px] font-bold uppercase text-gray-400 ml-2 flex items-center gap-2">
                    <Monitor size={14} /> Desktop Only
                  </p>
                  <MediaUploadField
                    size="lg"
                    value={getMediaValue(uploads.desktop.preview)}
                    maxCount={1}
                    classNameSizeUpload="aspect-video rounded-3xl border-gray-200"
                    onChange={(files) =>
                      files.length === 0
                        ? removeImage("desktop")
                        : files[0].originFileObj &&
                          handleImageUpload(files[0].originFileObj, "desktop")
                    }
                  />
                </div>
              )}

              {(formData.deviceTarget === DeviceTarget.ALL ||
                formData.deviceTarget === DeviceTarget.MOBILE) && (
                <div className="space-y-2 animate-in zoom-in-95 duration-300">
                  <p className="text-[10px] font-bold uppercase text-gray-400 ml-2 flex items-center gap-2">
                    <Smartphone size={14} /> Mobile Only
                  </p>
                  <MediaUploadField
                    size="lg"
                    value={getMediaValue(uploads.mobile.preview)}
                    maxCount={1}
                    classNameSizeUpload={cn(
                      "rounded-3xl border-gray-200",
                      formData.deviceTarget === DeviceTarget.ALL
                        ? "aspect-square"
                        : "aspect-video",
                    )}
                    onChange={(files) =>
                      files.length === 0
                        ? removeImage("mobile")
                        : files[0].originFileObj &&
                          handleImageUpload(files[0].originFileObj, "mobile")
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* LỊCH TRÌNH */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-orange-100/50 shadow-xl shadow-orange-500/5 space-y-6 relative overflow-hidden">
            <SectionHeader icon={Calendar} title="Lịch trình hiển thị" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                  Ngày bắt đầu
                </label>
                <DateTimeInput
                  value={formData.scheduleStart}
                  onChange={(val) => setFormField("scheduleStart", val)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                  Ngày kết thúc
                </label>
                <DateTimeInput
                  value={formData.scheduleEnd}
                  onChange={(val) => setFormField("scheduleEnd", val)}
                />
              </div>
            </div>
            <CustomButtonActions
              submitText={banner ? "Cập nhật dữ liệu" : "Kích hoạt Banner"}
              onCancel={onCancel}
              onSubmit={submitForm}
              isLoading={isSubmitting}
              className="w-full md:w-72 h-16 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-2xl shadow-orange-500/20"
            />
          </div>
        </div>
      </div>
    </PortalModal>
  );
}
