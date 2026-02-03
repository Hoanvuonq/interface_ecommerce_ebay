/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput } from "@/components";
import { MapPin, Loader2 } from "lucide-react";

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  isLoading?: boolean;
  initialData?: any;
}

export const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    country: "",
    addressDetail: "",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        province: initialData.province || "",
        district: initialData.district || "",
        ward: initialData.ward || "",
        country: initialData.country || "",
        addressDetail: initialData.addressDetail || "",
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl text-green-600">
            <MapPin size={18} />
          </div>
          <span className="font-bold text-gray-800 uppercase text-sm tracking-tight">
            Cập nhật Địa chỉ
          </span>
        </div>
      }
      width="max-w-2xl"
      className="rounded-[3rem]"
    >
      <form onSubmit={handleSubmit} className="space-y-8 py-2">
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-1 space-y-6">
          <FormInput
            label="Người nhận hàng"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="Nhập tên người nhận"
            maxLength={50}
          />

          <FormInput
            label="Số điện thoại"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Nhập số điện thoại"
            maxLength={20}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Tỉnh / Thành phố"
              required
              value={formData.province}
              onChange={(e) =>
                setFormData({ ...formData, province: e.target.value })
              }
              placeholder="Nhập tỉnh / thành phố"
            />
            <FormInput
              label="Quận / Huyện"
              required
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              placeholder="Nhập quận / huyện"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Phường / Xã"
              value={formData.ward}
              onChange={(e) =>
                setFormData({ ...formData, ward: e.target.value })
              }
              placeholder="Nhập phường / xã"
            />
            <FormInput
              label="Quốc gia"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="Nhập quốc gia"
            />
          </div>

          <FormInput
            label="Địa chỉ chi tiết"
            required
            isTextArea
            rows={3}
            value={formData.addressDetail}
            onChange={(e) =>
              setFormData({ ...formData, addressDetail: e.target.value })
            }
            placeholder="Ví dụ: 123 Đường ABC, Tòa nhà XYZ"
            maxLength={300}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:text-gray-600 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-10 py-3 bg-green-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20 flex items-center gap-2 hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            Lưu thay đổi
          </button>
        </div>
      </form>
    </PortalModal>
  );
};
