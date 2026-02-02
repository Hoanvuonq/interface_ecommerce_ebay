/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MapPin, Contact, Navigation, Home, SaveIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";

import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { addressService } from "@/services/address/address.service";
import { cn } from "@/utils/cn";
import { menuAddressItems } from "../../_types/menu";
import { PortalModal } from "@/features/PortalModal";
import {
  SelectComponent,
  FormInput,
  Checkbox,
  SectionHeader,
  CustomButtonActions,
} from "@/components";
import { useToast } from "@/hooks/useToast";

export const AddressFormModal = ({
  isOpen,
  onClose,
  buyerId,
  initialValues,
  onSuccess,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    detail: "",
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    districtName: "", // Cần lưu tên huyện
    zipCode: "700000",
    type: "HOME",
    isDefault: false,
  });

  // 1. Fetch Tỉnh/Thành
  const { data: provinces = [] } = useQuery({
    queryKey: ["address", "provinces"],
    queryFn: async () => {
      const res = (await addressService.getAllProvinces()) as any;
      return res?.data || [];
    },
    enabled: isOpen,
  });

  // 2. Fetch Phường/Xã
  const { data: wards = [] } = useQuery({
    queryKey: ["address", "wards", formData.provinceCode],
    queryFn: async () => {
      const res = (await addressService.getWardsByProvinceCode(
        formData.provinceCode,
      )) as any;
      return res?.data || [];
    },
    enabled: !!formData.provinceCode && isOpen,
  });

  // Logic mapping Edit mode
  useEffect(() => {
    if (isOpen && initialValues) {
      const addr = initialValues.address || {};
      const matchedP = _.find(
        provinces,
        (p) => p.fullName === addr.province || p.name === addr.province,
      );

      setFormData({
        recipientName: initialValues.recipientName || "",
        phone: initialValues.phone || "",
        detail: addr.detail || "",
        provinceCode: matchedP?.code || "",
        provinceName: addr.province || "",
        districtName: addr.district || "N/A",
        wardCode: "",
        wardName: addr.ward || "",
        zipCode: addr.zipCode || "700000",
        type: initialValues.type || "HOME",
        isDefault: !!initialValues.isDefault,
      });
    }
  }, [isOpen, initialValues, provinces]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.provinceName || !formData.wardName || !formData.detail) {
      toastError("Vui lòng nhập đầy đủ địa chỉ");
      return;
    }

    setIsSubmitting(true);
    try {
      // PAYLOAD CHUẨN 100% THEO SWAGGER
      const payload = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        address: {
          detail: formData.detail,
          ward: formData.wardName,
          district: formData.districtName || formData.wardName, // KHÔNG để rỗng
          province: formData.provinceName,
          country: "Việt Nam",
          zipCode: formData.zipCode,
          geoinfo: {
            // PHẢI GỬI OBJECT
            latitude: 0.1,
            longitude: 0.1,
            userVerified: true,
            userAdjusted: true,
            confirmed: true,
          },
        },
        type: formData.type,
        isDefault: formData.isDefault,
      };

      if (initialValues?.addressId) {
        await buyerAddressService.updateAddress(
          buyerId,
          initialValues.addressId,
          payload as any,
        );
      } else {
        await buyerAddressService.createAddress( payload as any);
      }
      toastSuccess("Thành công");
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err?.message || "Lỗi 500: Server từ chối dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-4xl"
      title={
        <div className="flex items-center gap-3">
          <MapPin className="text-orange-500" />{" "}
          <span className="font-black uppercase italic">Địa chỉ giao hàng</span>
        </div>
      }
      footer={
        <CustomButtonActions
          formId="address-form"
          isLoading={isSubmitting}
          onCancel={onClose}
          submitText={initialValues ? "Lưu thay đổi" : "Xác nhận hoàn tất"}
          submitIcon={SaveIcon}
          containerClassName="border-t p-6"
          className="bg-slate-900 w-60 text-white rounded-2xl h-12"
        />
      }
    >
      <form
        id="address-form"
        onSubmit={handleSubmit}
        className="space-y-8 py-4"
      >
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Họ tên"
            required
            value={formData.recipientName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, recipientName: e.target.value }))
            }
          />
          <FormInput
            label="Số điện thoại"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData((p) => ({ ...p, phone: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <SelectComponent
            placeholder="Chọn Tỉnh/Thành"
            options={provinces.map((p: any) => ({
              value: p.code,
              label: p.fullName,
            }))}
            value={formData.provinceCode}
            onChange={(val: string) => {
              const p = _.find(provinces, { code: val });
              setFormData((prev) => ({
                ...prev,
                provinceCode: val,
                provinceName: p?.fullName || "",
                wardCode: "",
                wardName: "",
              }));
            }}
          />
          <SelectComponent
            disabled={!formData.provinceCode}
            placeholder="Chọn Phường/Xã"
            options={wards.map((w: any) => ({
              value: w.code,
              label: w.fullName || w.name,
            }))}
            value={formData.wardCode}
            onChange={(val: string) => {
              const w = _.find(wards, { code: val });
              setFormData((prev) => ({
                ...prev,
                wardCode: val,
                wardName: w?.fullName || w?.name || "",
              }));
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <FormInput
              isTextArea
              label="Địa chỉ chi tiết"
              required
              value={formData.detail}
              onChange={(e) =>
                setFormData((p) => ({ ...p, detail: e.target.value }))
              }
            />
          </div>
          <FormInput
            label="Zip Code"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData((p) => ({ ...p, zipCode: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl">
          <div className="flex gap-4">
            {menuAddressItems.map((item) => (
              <label
                key={item.val}
                className={cn(
                  "px-6 py-3 rounded-xl border cursor-pointer",
                  formData.type === item.val
                    ? "bg-white border-orange-500 text-orange-600 shadow-sm"
                    : "border-gray-200 text-gray-400",
                )}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={formData.type === item.val}
                  onChange={() =>
                    setFormData((p) => ({ ...p, type: item.val as any }))
                  }
                />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          <Checkbox
            label="Đặt làm mặc định"
            checked={formData.isDefault}
            onChange={(e) =>
              setFormData((p) => ({ ...p, isDefault: e.target.checked }))
            }
          />
        </div>
      </form>
    </PortalModal>
  );
};
