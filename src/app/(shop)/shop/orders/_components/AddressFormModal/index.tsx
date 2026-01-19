"use client";

import React, { useEffect, useState } from "react";
import {
  FormInput,
  Checkbox,
  SelectComponent,
  ButtonField,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { Loader2 } from "lucide-react";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  editingAddress: any;
  handleSave: (values: any) => void;
  creating: boolean;
  updating: boolean;
  provinces: any[];
  wards: any[];
  onProvinceChange: (code: string, name: string) => void;
  modalForm?: any; 
}

export const AddressFormModal = ({
  open,
  onClose,
  editingAddress,
  handleSave,
  creating,
  updating,
  provinces,
  wards,
  onProvinceChange,
}: AddressModalProps) => {
  const isLoading = creating || updating;

  // 1. Quản lý dữ liệu Form bằng State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "Vietnam",
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    addressDetail: "",
    isDefault: false,
    isPickup: false,
    isReturn: false,
  });

  // 2. Cập nhật dữ liệu khi mở Modal (Sửa hoặc Thêm mới)
  useEffect(() => {
    if (open) {
      if (editingAddress) {
        setFormData({
          fullName: editingAddress.fullName || "",
          phone: editingAddress.phone || "",
          country: "Vietnam",
          provinceCode: editingAddress.provinceCode || "",
          provinceName: editingAddress.provinceName || "",
          wardCode: editingAddress.wardCode || "",
          wardName: editingAddress.wardName || "",
          addressDetail: editingAddress.addressDetail || "",
          isDefault: editingAddress.default || false,
          isPickup: editingAddress.defaultPickup || false,
          isReturn: editingAddress.defaultReturn || false,
        });
      } else {
        setFormData({
          fullName: "",
          phone: "",
          country: "Vietnam",
          provinceCode: "",
          provinceName: "",
          wardCode: "",
          wardName: "",
          addressDetail: "",
          isDefault: false,
          isPickup: false,
          isReturn: false,
        });
      }
    }
  }, [open, editingAddress]);

  const onLocalSave = () => {
    // Kiểm tra validation cơ bản trước khi gọi handleSave
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.provinceCode ||
      !formData.wardCode
    ) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }
    handleSave(formData);
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      width="max-w-2xl"
    >
      <div className="p-6 space-y-6">
        {/* Họ tên & Số điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Họ & Tên"
            placeholder="Nhập họ và tên người nhận"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <FormInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            required
            inputMode="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        {/* Địa chỉ hành chính */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Quốc gia
            </label>
            <SelectComponent
              options={[{ value: "Vietnam", label: "Việt Nam" }]}
              value={formData.country}
              disabled={true}
              onChange={() => {}}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Tỉnh/Thành phố
            </label>
            <SelectComponent
              placeholder="Chọn Tỉnh/Thành"
              options={provinces.map((p) => ({
                value: p.province_code,
                label: p.name,
              }))}
              value={formData.provinceCode}
              onChange={(val) => {
                const name =
                  provinces.find((p) => p.province_code === val)?.name || "";
                setFormData({
                  ...formData,
                  provinceCode: val,
                  provinceName: name,
                  wardCode: "",
                  wardName: "",
                });
                onProvinceChange(val, name);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Phường/Xã
            </label>
            <SelectComponent
              placeholder="Chọn Phường/Xã"
              options={wards.map((w) => ({
                value: w.ward_code,
                label: w.name,
              }))}
              value={formData.wardCode}
              disabled={!wards.length}
              onChange={(val) => {
                const name = wards.find((w) => w.ward_code === val)?.name || "";
                setFormData({ ...formData, wardCode: val, wardName: name });
              }}
            />
          </div>
        </div>

        {/* Địa chỉ chi tiết */}
        <FormInput
          label="Địa chỉ chi tiết"
          placeholder="Số nhà, tên đường..."
          isTextArea
          required
          value={formData.addressDetail}
          onChange={(e) =>
            setFormData({ ...formData, addressDetail: e.target.value })
          }
        />

        {/* Cài đặt mặc định */}
        <div className="bg-gray-50/80 p-5 rounded-4xl border border-gray-100 space-y-4 shadow-inner">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
            Cài đặt mặc định
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Checkbox
              label="Đặt làm địa chỉ mặc định"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
            />
            <Checkbox
              label="Địa chỉ lấy hàng"
              checked={formData.isPickup}
              onChange={(e) =>
                setFormData({ ...formData, isPickup: e.target.checked })
              }
            />
            <Checkbox
              label="Địa chỉ trả hàng"
              checked={formData.isReturn}
              onChange={(e) =>
                setFormData({ ...formData, isReturn: e.target.checked })
              }
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Hủy bỏ
          </button>
          <ButtonField
            onClick={onLocalSave}
            disabled={isLoading}
            className="min-w-[140px] shadow-lg shadow-orange-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              "Lưu địa chỉ"
            )}
          </ButtonField>
        </div>
      </div>
    </PortalModal>
  );
};
