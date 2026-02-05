/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AddressModal } from "@/app/(shop-onboarding)/shop/onboarding/_components/AddressModal";
import {
  Button,
  FormInput,
  MediaUploadField,
  SectionHeader,
} from "@/components";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import {
  ChevronRight,
  Info,
  MapPin,
  Navigation,
  Plus,
  Store,
} from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useOnboarding } from "../../_contexts/shop.onboarding.context";
import { cn } from "@/utils/cn";
import { getStoredUserDetail } from "@/utils/jwt";
import { AddressDisplayCard } from "../AddressDisplayCard";

export const StepBasicInfo = ({ errors }: { errors?: any }) => {
  const { formData, updateFormField, provinces, wards, fetchWardsByProvince } =
    useOnboarding();
  const [modalErrors, setModalErrors] = useState<any>({});
  const [open, setOpen] = useState(false);
  const { uploadFile } = usePresignedUpload();
  const lastFetchedProvinceCode = useRef<string | null>(null);

  useEffect(() => {
    if (!formData.email) {
      const userDetail = getStoredUserDetail();
      if (userDetail?.email) {
        updateFormField("email", userDetail.email);
      }
    }
  }, [formData.email, updateFormField]);

  const [modalData, setModalData] = useState({
    fullName: "",
    phone: "",
    country: "Vietnam",
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    addressDetail: "",
  });

  useEffect(() => {
    const pCode = modalData.provinceCode;
    if (pCode && pCode !== lastFetchedProvinceCode.current) {
      fetchWardsByProvince(pCode);
      lastFetchedProvinceCode.current = pCode;
    }
  }, [modalData.provinceCode, fetchWardsByProvince]);

  const handleOpenModal = useCallback(() => {
    const addr = formData.pickupAddress || {};
    setModalData({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      country: "Vietnam",
      provinceCode: addr.provinceCode || "",
      provinceName: addr.provinceName || "",
      wardCode: addr.wardCode || "",
      wardName: addr.wardName || "",
      addressDetail: addr.addressDetail || "",
    });
    lastFetchedProvinceCode.current = addr.provinceCode || null;
    setOpen(true);
  }, [formData.pickupAddress]);

  const handleSaveAddress = () => {
    updateFormField("pickupAddress", {
      ...modalData,
      region: `${modalData.wardName}, ${modalData.provinceName}, Việt Nam`,
    });
    setOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="bg-white rounded-4xl shadow-custom overflow-hidden p-6 space-y-8 border border-gray-50">
        <SectionHeader icon={Store} title="Hồ sơ Cửa hàng" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Tên cửa hàng thương mại"
            value={formData.shopName || ""}
            onChange={(e) => updateFormField("shopName", e.target.value)}
            required
            error={errors?.shopName}
            className="rounded-2xl!"
          />

          <FormInput
            label="Email liên lạc (Hệ thống)"
            value={formData.email || ""}
            disabled
            className="bg-gray-100 opacity-80 cursor-not-allowed rounded-2xl!"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader icon={MapPin} title="Địa chỉ lấy hàng" />
            {formData.pickupAddress && (
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Hệ thống đã định vị
              </span>
            )}
          </div>

          <AddressDisplayCard
            address={formData.pickupAddress}
            onEdit={handleOpenModal}
            error={errors?.pickupAddress}
          />
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="shrink-0 space-y-3">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Shop Branding Logo *
              </div>
              <div
                className={cn(
                  "py-2 rounded-2xl border shadow-custom transition-all",
                  errors?.logoUrl
                    ? "bg-red-50/30 border-red-200 animate-shake"
                    : "bg-gray-50/50 border-gray-100",
                )}
              >
                <MediaUploadField
                  mode="public"
                  maxCount={1}
                  value={
                    Array.isArray(formData.logoUrl) ? formData.logoUrl : []
                  }
                  onUploadApi={async (file) => {
                    const res = (await uploadFile(
                      file,
                      UploadContext.SHOP_LOGO,
                    )) as any;
                    return res.url || res.finalUrl;
                  }}
                  onChange={(files) => updateFormField("logoUrl", files)}
                />
              </div>
              {errors?.logoUrl && (
                <p className="text-[10px] font-medium text-red-500 ml-1 italic">
                  * {errors.logoUrl}
                </p>
              )}
            </div>

            <div className="flex-1 self-stretch">
              <div className="h-full flex gap-6 items-center p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Info className="text-blue-500" size={24} />
                </div>
                <div className="space-y-2 uppercase tracking-tighter text-[10px] font-bold text-blue-700/70">
                  <p className="text-blue-900 text-[11px] mb-1 font-bold">
                    Quy chuẩn dữ liệu hình ảnh
                  </p>
                  <p>• JPG, JPEG, PNG Profile (Max 2.0 MB)</p>
                  <p>• Ratio: 1:1 Optimized / Secure Storage Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-4xl p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Mô tả Shop
            </span>
            <span className="text-[9px] bg-white border border-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">
              Tùy chọn
            </span>
          </div>

          <FormInput
            isTextArea
            value={formData.description || ""}
            onChange={(e) => updateFormField("description", e.target.value)}
            placeholder="Hãy chia sẻ ngắn gọn về phong cách cửa hàng hoặc câu chuyện của bạn..."
            rows={4}
            maxLength={300}
            className="mb-0 rounded-2xl! bg-white border-white! focus:border-orange-200!"
          />
          <p className="mt-3 text-[10px] text-gray-400 font-bold italic text-right px-2">
            * Tối đa 300 ký tự. Mô tả chất lượng giúp tăng độ tin cậy.
          </p>
        </div>
      </div>

      <AddressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveAddress}
        modalData={modalData}
        setModalData={setModalData}
        provinceOptions={provinces.map((p) => ({
          label: p.fullName,
          value: p.code,
        }))}
        wardOptions={wards.map((w) => ({ label: w.fullName, value: w.code }))}
        isEdit={!!formData.pickupAddress}
        modalErrors={{}}
        setModalErrors={() => {}}
        provinces={provinces}
        wards={wards}
      />
    </div>
  );
};
