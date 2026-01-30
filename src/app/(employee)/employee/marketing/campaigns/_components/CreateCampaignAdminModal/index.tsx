/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PortalModal } from "@/features/PortalModal";
import {
  FormInput,
  ButtonField,
  MediaUploadField,
  SelectComponent,
  Button,
  Checkbox,
  DateTimeInput,
} from "@/components";
import { Tag, ImageIcon, Loader2, Star } from "lucide-react";

interface CreateCampaignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  isProcessing: boolean;
  onUploadThumb: (file: File) => Promise<any>;
  onUploadBanner: (file: File) => Promise<any>;
}

export const CreateCampaignAdminModal: React.FC<
  CreateCampaignAdminModalProps
> = ({
  isOpen,
  onClose,
  onSave,
  isProcessing,
  onUploadThumb,
  onUploadBanner,
}) => {
 const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    campaignType: "FLASH_SALE",
    startDate: "",
    endDate: "",
    displayPriority: 1,
    isFeatured: true,
    thumbnail: [] as any[],
    banner: [] as any[],
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // FIX QUAN TRỌNG: Kiểm tra ID hoặc assetId từ đối tượng MediaAsset
    const thumbAsset = formData.thumbnail[0];
    const bannerAsset = formData.banner[0];

    const finalPayload = {
      name: formData.name,
      description: formData.description,
      campaignType: formData.campaignType,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : "",
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : "",
      // Thử lấy 'id' trước, nếu không có thì lấy 'assetId'
      thumbnailAssetId: thumbAsset?.id || thumbAsset?.assetId || null,
      bannerAssetId: bannerAsset?.id || bannerAsset?.assetId || null,
      displayPriority: Number(formData.displayPriority),
      isFeatured: formData.isFeatured,
    };

    console.log("🚀 Payload gửi đi:", finalPayload); // Log để kiểm tra thực tế
    onSave(finalPayload);
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button
        variant="edit"
        type="button"
        disabled={isProcessing}
        onClick={onClose}
        className="px-8 h-11 rounded-xl font-bold uppercase text-[10px] text-gray-500 border-gray-200"
      >
        Hủy bỏ
      </Button>
      <ButtonField
        htmlType="submit"
        onClick={handleSubmit}
        type="login"
        disabled={isProcessing}
        className="w-56 h-11 rounded-xl font-bold uppercase text-[10px] shadow-lg shadow-orange-100 border-0"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Đang khởi tạo...
          </>
        ) : (
          "Khởi tạo chiến dịch"
        )}
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={() => !isProcessing && onClose()}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
            <Tag size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight uppercase">
              Tạo Chiến dịch Mới
            </h3>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
              Payload chuẩn hệ thống
            </p>
          </div>
        </div>
      }
      footer={footer}
      width="max-w-3xl"
      className="rounded-4xl"
    >
      <div className="space-y-6 py-2 px-1 max-h-[70vh] overflow-y-auto custom-scrollbar pr-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Tên chiến dịch"
            required
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Nhập tên..."
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-500 ml-1">
              Loại hình
            </label>
            <SelectComponent
              options={[
                { label: "Flash Sale", value: "FLASH_SALE" },
                { label: "Shop Discount", value: "SHOP_SALE" },
              ]}
              value={formData.campaignType}
              onChange={(val) => updateField("campaignType", val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimeInput
            label="Thời điểm bắt đầu"
            required
            value={formData.startDate}
            onChange={(val) => updateField("startDate", val)}
          />
          <DateTimeInput
            label="Thời điểm kết thúc"
            required
            value={formData.endDate}
            onChange={(val) => updateField("endDate", val)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-orange-50/30 rounded-3xl border border-orange-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500">
              <ImageIcon size={14} className="text-orange-500" /> Thumbnail (ID)
            </div>
            <MediaUploadField
              value={formData.thumbnail}
              onChange={(val) => updateField("thumbnail", val)}
              onUploadApi={onUploadThumb}
              maxCount={1}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500">
              <ImageIcon size={14} className="text-orange-500" /> Banner (ID)
            </div>
            <MediaUploadField
              value={formData.banner}
              onChange={(val) => updateField("banner", val)}
              onUploadApi={onUploadBanner}
              maxCount={1}
              classNameSizeUpload="w-80!"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <FormInput
            label="Độ ưu tiên"
            type="number"
            value={formData.displayPriority}
            onChange={(e) => updateField("displayPriority", e.target.value)}
          />
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-5">
            <Checkbox
              id={`checkbox-shop-${formData.isFeatured}`}
              checked={formData.isFeatured}
              onChange={(e) => updateField("isFeatured", e.target.checked)}
            />
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Star size={16} className="text-amber-500" /> Nổi bật
            </label>
          </div>
        </div>

        <FormInput
          label="Mô tả"
          isTextArea
          rows={3}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Thông tin chi tiết..."
        />
      </div>
    </PortalModal>
  );
};
