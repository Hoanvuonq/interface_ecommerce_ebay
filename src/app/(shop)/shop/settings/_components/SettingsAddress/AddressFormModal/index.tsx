"use client";

import {
  ButtonField,
  Checkbox,
  FormInput,
  SelectComponent,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  editingAddress: any;
  onSave: (values: any) => void;
  loading: boolean;
  provinces: any[];
  wards: any[];
  onProvinceChange: (code: string) => void;
}

export const AddressFormModal = ({
  open,
  onClose,
  editingAddress,
  onSave,
  loading,
  provinces,
  wards,
  onProvinceChange,
}: AddressModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "Vietnam",
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    addressDetail: "",
    default: false,
    defaultPickup: false,
    defaultReturn: false,
  });

  useEffect(() => {
    if (open) {
      if (editingAddress) {
        setFormData({
          fullName: editingAddress.recipientName || "", // recipientName -> fullName
          phone: editingAddress.phone || "",
          country: "Vietnam",
          provinceCode: editingAddress.address?.provinceCode || "", // Giữ code nếu backend có trả về
          provinceName: editingAddress.address?.province || "", // province -> provinceName
          wardCode: editingAddress.address?.wardCode || "",
          wardName: editingAddress.address?.ward || "", // ward -> wardName
          addressDetail: editingAddress.address?.detail || "",
          default: editingAddress.default || false,
          defaultPickup: editingAddress.defaultPickup || false,
          defaultReturn: editingAddress.defaultReturn || false,
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
          default: false,
          defaultPickup: false,
          defaultReturn: false,
        });
      }
    }
  }, [open, editingAddress]);

  const handleLocalSave = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.provinceCode ||
      !formData.wardCode
    ) {
      return;
    }
    onSave(formData);
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase  text-gray-800 tracking-tight">
            {editingAddress ? "Cấu hình địa chỉ" : "Thiết lập điểm mới"}
          </span>
          <span className="text-[10px]  text-gray-400 font-bold uppercase italic">
            Thông tin định vị kho hàng
          </span>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Định danh người gửi"
            placeholder="VD: Kho hàng Miền Nam"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <FormInput
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold  text-gray-700 uppercase ml-1">
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
                onProvinceChange(val);
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold  text-gray-700 uppercase ml-1">
              Phường/Xã
            </label>
            <SelectComponent
              placeholder="Chọn Phường/Xã"
              options={wards.map((w) => ({
                value: w.ward_code,
                label: w.name,
              }))}
              value={formData.wardCode}
              disabled={!formData.provinceCode}
              onChange={(val) => {
                const name = wards.find((w) => w.ward_code === val)?.name || "";
                setFormData({ ...formData, wardCode: val, wardName: name });
              }}
            />
          </div>
        </div>

        <FormInput
          label="Địa chỉ cụ thể"
          placeholder="Số nhà, tên đường..."
          isTextArea
          value={formData.addressDetail}
          onChange={(e) =>
            setFormData({ ...formData, addressDetail: e.target.value })
          }
        />

        <div className="bg-slate-50 p-5 rounded-4xl space-y-4 border border-slate-100 shadow-inner">
          <p className="text-[10px] font-bold uppercase  text-gray-500 tracking-widest">
            Thiết lập trạng thái
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Checkbox
              label="Đặt làm địa chỉ liên hệ mặc định"
              checked={formData.default}
              onChange={(e) =>
                setFormData({ ...formData, default: e.target.checked })
              }
            />
            <Checkbox
              label="Sử dụng làm địa chỉ Lấy hàng (Pickup)"
              checked={formData.defaultPickup}
              onChange={(e) =>
                setFormData({ ...formData, defaultPickup: e.target.checked })
              }
            />
            <Checkbox
              label="Sử dụng làm địa chỉ Trả hàng (Return)"
              checked={formData.defaultReturn}
              onChange={(e) =>
                setFormData({ ...formData, defaultReturn: e.target.checked })
              }
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <ButtonField
            className="flex-1 rounded-2xl! bg-slate-100!  text-gray-600! border-none font-bold uppercase text-[11px]"
            onClick={onClose}
          >
            Hủy bỏ
          </ButtonField>
          <ButtonField
            type="login"
            className="flex-2 w-40! rounded-2xl! shadow-lg shadow-orange-100 font-bold uppercase text-[11px]"
            onClick={handleLocalSave}
            disabled={loading}
          >
            <span className="flex gap-2 items-center">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {editingAddress ? "Cập nhật" : "Lưu địa chỉ"}
            </span>
          </ButtonField>
        </div>
      </div>
    </PortalModal>
  );
};
