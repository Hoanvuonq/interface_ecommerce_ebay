/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, ButtonField, MediaUploadField } from "@/components";
import { Button } from "@/components/button";
import { Store, ImageIcon, Loader2, Info } from "lucide-react";
import { EditShopModalProps } from "./type";

export const EditShopModal: React.FC<EditShopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  isProcessing,
}) => {
  const updateField = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const footer = (
    <div className="flex items-center justify-end gap-3  w-full">
      <Button
        variant="edit"
        type="button"
        disabled={isProcessing}
        onClick={onClose}
        className="px-8 h-11 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-500 border-gray-200 hover:bg-gray-50 transition-all"
      >
        Hủy bỏ quy trình
      </Button>
      <ButtonField
        htmlType="submit"
        onClick={onSave}
        type="login"
        disabled={isProcessing}
        className="w-44 h-11 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100 border-0 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Đang ghi nhận...
          </>
        ) : (
          "Cập nhật hệ thống"
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
          <div className="p-2 bg-orange-50 rounded-xl text-orange-600 shadow-sm">
            <Store size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">
              Chỉnh sửa hồ sơ Shop
            </h3>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
              Cấu hình thông tin cơ bản
            </p>
          </div>
        </div>
      }
      footer={footer}
      width="max-w-2xl"
      className="rounded-4xl border-none shadow-2xl"
    >
      <form
        onSubmit={onSave}
        className="space-y-8 py-2 px-1 animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar pr-3">
          <FormInput
            label="Định danh tên Shop"
            required
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Nhập tên shop chuyên nghiệp..."
            maxLength={30}
            className="rounded-2xl! focus:border-orange-400!"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon size={14} className="text-orange-500" />
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Logo hiển thị <span className="text-red-500">*</span>
                </label>
              </div>
              <MediaUploadField
                size="md"
                value={formData.logo}
                onChange={(val) => updateField("logo", val)}
                maxCount={1}
                className="justify-center md:justify-start"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon size={14} className="text-orange-500" />
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Banner truyền thông
                </label>
              </div>
              <MediaUploadField
                size="md"
                value={formData.banner}
                onChange={(val) => updateField("banner", val)}
                maxCount={1}
                className="justify-center md:justify-start"
              />
            </div>
          </div>

          <div className="space-y-3">
            <FormInput
              label="Giới thiệu hồ sơ cửa hàng"
              isTextArea
              rows={4}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Viết mô tả ngắn gọn giúp khách hàng tin tưởng shop của bạn hơn (tối đa 300 ký tự)..."
              maxLength={300}
              className="rounded-3xl! focus:border-orange-400!"
            />
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Info size={14} className="text-gray-400" />
              <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
                Mô tả hấp dẫn sẽ giúp tăng tỷ lệ chuyển đổi đơn hàng lên đến
                20%.
              </p>
            </div>
          </div>
        </div>
      </form>
    </PortalModal>
  );
};
