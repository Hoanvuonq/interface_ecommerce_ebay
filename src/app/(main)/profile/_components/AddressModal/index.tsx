/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import {
  MapPin,
  SaveIcon,
  User,
  Phone,
  Home,
  Briefcase,
  CircleEllipsis,
  Map,
  Hash,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

import {
  Checkbox,
  CustomButtonActions,
  FormInput,
  SelectComponent,
  SectionHeader,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import { addressService } from "@/services/address/address.service";
import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { cn } from "@/utils/cn";
import { StatusTabs, StatusTabItem } from "@/app/(shop)/shop/_components";

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
    countryCode: "VN",
    countryName: "Việt Nam",
    districtName: "",
    zipCode: "700000",
    type: "HOME",
    isDefault: false,
  });

  const typeTabs: StatusTabItem<string>[] = useMemo(
    () => [
      { key: "HOME", label: "Nhà riêng", icon: Home },
      { key: "OFFICE", label: "Văn phòng", icon: Briefcase },
      { key: "OTHER", label: "Khác", icon: CircleEllipsis },
    ],
    [],
  );

  const { data: countries = [] } = useQuery({
    queryKey: ["address", "country"],
    queryFn: async () => {
      const res = (await addressService.getCountryInfo()) as any;
      return res?.data ? (Array.isArray(res.data) ? res.data : [res.data]) : [];
    },
    enabled: isOpen,
  });

  const { data: provinces = [] } = useQuery({
    queryKey: ["address", "provinces"],
    queryFn: async () => {
      const res = (await addressService.getAllProvinces()) as any;
      return res?.data?.content || res?.data || [];
    },
    enabled: isOpen,
  });

  const { data: wards = [] } = useQuery({
    queryKey: ["address", "wards", formData.provinceCode],
    queryFn: async () => {
      const res = (await addressService.getWardsByProvinceCode(
        formData.provinceCode,
      )) as any;
      return res?.data?.content || res?.data || [];
    },
    enabled: !!formData.provinceCode && isOpen,
  });

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
        countryCode: "VN",
        countryName: addr.country || "Việt Nam",
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
      toastError("Vui lòng nhập đầy đủ thông tin địa chỉ");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        address: {
          detail: formData.detail,
          ward: formData.wardName,
          district: formData.districtName || formData.wardName,
          province: formData.provinceName,
          country: formData.countryName,
          zipCode: formData.zipCode,
          geoinfo: {
            latitude: 10.8231,
            longitude: 106.6297,
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
        await buyerAddressService.createAddress(payload as any);
      }
      toastSuccess("Cập nhật địa chỉ thành công");
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err?.message || "Lỗi lưu dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-3xl"
      className="rounded-[2.5rem] overflow-hidden"
      title={
        <div className="flex items-center gap-4 py-2">
          <div className="p-3 bg-linear-to-br from-orange-400 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-200">
            <MapPin size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-none">
              Địa chỉ nhận hàng
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Thiết lập thông tin vận chuyển chính xác
            </p>
          </div>
        </div>
      }
      footer={
        <CustomButtonActions
          formId="address-form"
          isLoading={isSubmitting}
          onCancel={onClose}
          submitText={initialValues ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          submitIcon={SaveIcon}
          className="bg-orange-600 hover:bg-orange-700 w-full md:w-60 text-white rounded-2xl h-14 font-bold uppercase tracking-wider shadow-orange-200 shadow-2xl transition-all duration-300"
        />
      }
    >
      <form
        id="address-form"
        onSubmit={handleSubmit}
        className="space-y-8 py-4 px-2"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Thông tin người nhận
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-blue-50/30 rounded-4xl border border-blue-100/50">
            <FormInput
              label="Họ tên người nhận"
              required
              placeholder="VD: Nguyễn Văn A"
              value={formData.recipientName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, recipientName: e.target.value }))
              }
              className="rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-orange-500/20"
            />
            <FormInput
              label="Số điện thoại"
              required
              placeholder="09xx xxx xxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              className="rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Map size={16} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Khu vực vận chuyển
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectComponent
              label="Quốc gia"
              required
              options={countries.map((c: any) => ({
                value: c.code || "VN",
                label: c.fullName || c.name || "Việt Nam",
              }))}
              value={formData.countryCode}
              onChange={(val: string) => {
                const c = _.find(countries, { code: val });
                setFormData((prev) => ({
                  ...prev,
                  countryCode: val,
                  countryName: c?.fullName || c?.name || "Việt Nam",
                }));
              }}
            />
            <SelectComponent
              label="Tỉnh / Thành phố"
              required
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
              label="Phường / Xã"
              required
              disabled={!formData.provinceCode}
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

          <FormInput
            isTextArea
            label="Địa chỉ chi tiết"
            required
            placeholder="Số nhà, tên đường, tòa nhà..."
            value={formData.detail}
            onChange={(e) =>
              setFormData((p) => ({ ...p, detail: e.target.value }))
            }
            className="rounded-3xl min-h-25 shadow-sm border-gray-100"
          />
        </div>

        <div className="bg-gray-50/80 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 flex-1 w-full">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                  Loại địa chỉ
                </span>
              </div>
              <StatusTabs
                tabs={typeTabs}
                current={formData.type}
                onChange={(key) => setFormData((p) => ({ ...p, type: key }))}
                layoutId="address-type-shifter"
              />
            </div>

            <div className="w-full md:w-48">
              <FormInput
                label="Mã Zip"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, zipCode: e.target.value }))
                }
                className="rounded-xl shadow-sm border-gray-100"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200/50">
            <label
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border",
                formData.isDefault
                  ? "bg-orange-50 border-orange-200 shadow-sm"
                  : "bg-white border-gray-100 hover:border-gray-200",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    formData.isDefault
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-400",
                  )}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    Địa chỉ mặc định
                  </p>
                  <p className="text-xs text-gray-400">
                    Ưu tiên sử dụng khi đặt hàng
                  </p>
                </div>
              </div>
              <Checkbox
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isDefault: e.target.checked }))
                }
                className="accent-orange-500 w-6 h-6 rounded-lg"
              />
            </label>
          </div>
        </div>
      </form>
    </PortalModal>
  );
};
