/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { FaSave } from "react-icons/fa";
import { Loader2, MapPin, Contact, Navigation, Home } from "lucide-react";
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
  Button,
  ButtonField,
  SectionHeader,
} from "@/components";
import { useToast } from "@/hooks/useToast";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId: string;
  initialValues?: any;
  onSuccess: () => void;
}

export const AddressFormModal = ({
  isOpen,
  onClose,
  buyerId,
  initialValues,
  onSuccess,
}: AddressFormModalProps) => {
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
    type: "HOME",
    isDefault: false,
  });

  const { data: provinces = [], isLoading: pLoading } = useQuery({
    queryKey: ["address", "provinces"],
    queryFn: async () => {
      const res = (await addressService.getAllProvinces()) as any;
      return res?.data || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: wards = [], isLoading: wLoading } = useQuery({
    queryKey: ["address", "wards", formData.provinceCode],
    queryFn: async () => {
      const res = (await addressService.getWardsByProvinceCode(
        formData.provinceCode,
      )) as any;
      return res?.data || [];
    },
    enabled: !!formData.provinceCode && isOpen,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      const addr = initialValues.address || {};

      const matchedProvince = _.find(
        provinces,
        (p) => p.name === addr.province,
      );

      setFormData((prev) => ({
        ...prev,
        recipientName: initialValues.recipientName || "",
        phone: initialValues.phone || "",
        detail: addr.detail || "",
        provinceCode: matchedProvince?.code || "",
        provinceName: addr.province || "",
        type: initialValues.type || "HOME",
        isDefault: initialValues.isDefault || false,
      }));
    } else if (isOpen) {
      setFormData({
        recipientName: "",
        phone: "",
        detail: "",
        provinceCode: "",
        provinceName: "",
        wardCode: "",
        wardName: "",
        type: "HOME",
        isDefault: false,
      });
    }
  }, [isOpen, initialValues, provinces]);

  // Tự động tìm mã xã khi dữ liệu wards load xong (Dành cho Edit mode)
  useEffect(() => {
    if (isOpen && initialValues?.address?.ward && wards.length > 0) {
      const matchedWard = _.find(
        wards,
        (w) => w.name === initialValues.address.ward,
      );
      if (matchedWard) {
        setFormData((prev) => ({
          ...prev,
          wardCode: matchedWard.code,
          wardName: matchedWard.name,
        }));
      }
    }
  }, [wards, isOpen, initialValues]);

  const handleProvinceChange = (code: string) => {
    const province = _.find(provinces, { code });
    setFormData((prev) => ({
      ...prev,
      provinceCode: code,
      provinceName: province?.fullName || "",
      wardCode: "",
      wardName: "",
    }));
  };

  const handleWardChange = (code: string) => {
    const ward = _.find(wards, { code });
    setFormData((prev) => ({
      ...prev,
      wardCode: code,
      wardName: ward?.name || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.recipientName ||
      !formData.phone ||
      !formData.provinceCode ||
      !formData.wardCode ||
      !formData.detail
    ) {
      toastError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        type: formData.type,
        isDefault: formData.isDefault,
        address: {
          detail: formData.detail,
          ward: formData.wardName,
          district: "", // Có thể mở rộng nếu API yêu cầu
          province: formData.provinceName,
          country: "Vietnam",
          zipCode: "70000",
          geoinfo: {
            latitude: 0,
            longitude: 0,
            userVerified: true,
            userAdjusted: true,
            confirmed: true,
          },
        },
      };

      if (initialValues?.id) {
        // Gọi service update
        toastSuccess("Cập nhật thành công");
      } else {
        await buyerAddressService.createAddress(payload as any);
        toastSuccess("Thêm địa chỉ thành công");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err?.message || "Lỗi lưu địa chỉ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500 shadow-sm border border-orange-100">
            <MapPin size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800 uppercase italic leading-none">
              {initialValues ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              Delivery Information
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center gap-3">
          <Button
            variant="edit"
            onClick={onClose}
            className="rounded-xl h-12 px-8"
          >
            Hủy bỏ
          </Button>
          <ButtonField
            form="address-form"
            htmlType="submit"
            loading={isSubmitting}
            className="w-48 h-12 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-slate-200 border-0"
          >
            <div className="flex items-center justify-center gap-2">
              {!isSubmitting && <FaSave size={14} />}
              {initialValues ? "Lưu thay đổi" : "Hoàn tất"}
            </div>
          </ButtonField>
        </div>
      }
      width="max-w-3xl"
    >
      <form
        id="address-form"
        onSubmit={handleSubmit}
        className="space-y-8 py-4"
      >
        {/* CONTACT SECTION */}
        <div className="space-y-4">
          <SectionHeader icon={Contact} title="Thông tin liên hệ" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Họ và tên người nhận"
              required
              value={formData.recipientName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, recipientName: e.target.value }))
              }
              placeholder="VD: Nguyễn Văn A..."
            />
            <FormInput
              label="Số điện thoại"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="09xx xxx xxx"
            />
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader icon={Navigation} title="Vị trí địa lý" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                Tỉnh / Thành phố
              </label>
              <SelectComponent
                placeholder={
                  pLoading ? "Đang tải dữ liệu..." : "Chọn Tỉnh/Thành"
                }
                options={_.map(provinces, (p) => ({
                  value: p.code,
                  label: p.fullName,
                }))}
                value={formData.provinceCode}
                onChange={handleProvinceChange}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                Phường / Xã
              </label>
              <SelectComponent
                placeholder={
                  wLoading ? "Đang lấy danh sách..." : "Chọn Phường/Xã"
                }
                disabled={!formData.provinceCode}
                options={_.map(wards, (w) => ({
                  value: w.code,
                  label: w.fullName || w.name,
                }))}
                value={formData.wardCode}
                onChange={handleWardChange}
                className="h-12"
              />
            </div>
          </div>
          <FormInput
            isTextArea
            label="Địa chỉ chi tiết"
            required
            value={formData.detail}
            onChange={(e) =>
              setFormData((p) => ({ ...p, detail: e.target.value }))
            }
            placeholder="Số nhà, ngõ, tên đường..."
            rows={2}
          />
        </div>

        {/* TYPE SECTION */}
        <div className="space-y-4">
          <SectionHeader icon={Home} title="Phân loại & Tùy chọn" />
          <div className="flex gap-4 p-1 bg-gray-50/50 rounded-2xl border border-gray-100">
            {menuAddressItems.map((item) => (
              <label
                key={item.val}
                className={cn(
                  "flex-1 py-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                  formData.type === item.val
                    ? "bg-white border-orange-500 text-orange-600 shadow-sm ring-1 ring-orange-500/10"
                    : "border-transparent text-gray-400 hover:text-gray-600",
                )}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={formData.type === item.val}
                  onChange={() =>
                    setFormData((p) => ({ ...p, type: item.val }))
                  }
                />
                <item.icon
                  size={22}
                  strokeWidth={formData.type === item.val ? 2.5 : 1.5}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-2 pl-1">
            <Checkbox
              label="Đặt làm địa chỉ mặc định cho các đơn hàng sau"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((p) => ({ ...p, isDefault: e.target.checked }))
              }
            />
          </div>
        </div>
      </form>
    </PortalModal>
  );
};
