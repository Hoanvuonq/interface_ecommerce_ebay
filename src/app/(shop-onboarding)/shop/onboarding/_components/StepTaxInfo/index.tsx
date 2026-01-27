/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef } from "react"; // Thêm useRef
import { FormInput, SectionHeader, SelectComponent } from "@/components";
import {
  useGetAllProvinces,
  useGetWardsByProvinceCode,
} from "@/hooks/address/useAddress";
import { Briefcase, MapPin, Hash, Globe, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useOnboarding } from "../../_contexts/shop.onboarding.context";

export const StepTaxInfo = ({ errors }: { errors?: any }) => {
  const { formData, updateFormField } = useOnboarding();
  const { fetchProvinces, data: provincesData } = useGetAllProvinces();
  const { fetchWards, data: wardsData } = useGetWardsByProvinceCode();
  
  // 🟢 CHỐNG SPAM: Ref để ghi nhớ mã tỉnh cuối cùng đã gọi API
  const lastFetchedTaxProvinceCode = useRef<string | null>(null);

  const provinces = useMemo(
    () => provincesData?.content || [],
    [provincesData],
  );
  const wards = useMemo(() => wardsData?.content || [], [wardsData]);

  useEffect(() => {
    fetchProvinces({ page: 0, size: 100 });
  }, [fetchProvinces]);

  // 🟢 FIX SPAM: Chỉ gọi API Wards khi mã tỉnh thực sự THAY ĐỔI
  useEffect(() => {
    const pCode = formData.taxProvinceCode;
    if (pCode && pCode !== lastFetchedTaxProvinceCode.current) {
      fetchWards(pCode, { page: 0, size: 100 });
      lastFetchedTaxProvinceCode.current = pCode; // Ghi nhớ lại
    }
  }, [formData.taxProvinceCode, fetchWards]);

  const handleProvinceChange = (val: any) => {
    const selectedOption = provinces.find((p: any) => p.code === val);
    updateFormField("taxProvinceCode", val);
    updateFormField(
      "taxProvinceName",
      selectedOption ? selectedOption.fullName : "",
    );
    // Reset ward khi đổi tỉnh
    updateFormField("taxWardCode", "");
    updateFormField("taxWardName", "");
    // Reset ref để nếu user chọn lại tỉnh cũ vẫn fetch được (nếu cần)
    // Hoặc giữ nguyên để tiết kiệm data
  };

  const handleWardChange = (val: any) => {
    const selectedOption = wards.find((w: any) => w.code === val);
    updateFormField("taxWardCode", val);
    updateFormField(
      "taxWardName",
      selectedOption ? selectedOption.fullName : "",
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* 01. HÌNH THỨC PHÁP LÝ */}
      <section className="bg-white rounded-[2.5rem] shadow-custom border border-gray-50 p-8 space-y-6">
        <SectionHeader icon={Briefcase} title="01. Hình thức pháp lý" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: "personal", label: "Cá nhân" },
            { id: "household", label: "Hộ kinh doanh" },
            { id: "company", label: "Công ty" },
          ].map((type) => {
            const isActive = formData.businessType === type.id;
            const hasError = errors?.businessType;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => updateFormField("businessType", type.id)}
                className={cn(
                  "relative flex items-center justify-between py-5 px-6 rounded-2xl border text-sm font-bold transition-all",
                  isActive
                    ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                    : "bg-white border-gray-100 text-gray-400 hover:border-orange-200",
                  !isActive &&
                    hasError &&
                    "border-red-400 bg-red-50/30 animate-shake",
                )}
              >
                {type.label}
                {isActive && (
                  <CheckCircle2
                    size={18}
                    className="text-orange-500 animate-in zoom-in"
                  />
                )}
              </button>
            );
          })}
        </div>
        {errors?.businessType && (
          <p className="text-[10px] font-medium text-red-500 ml-1 uppercase tracking-tighter">
            * {errors.businessType}
          </p>
        )}
      </section>

      {/* 02. ĐỊA CHỈ ĐĂNG KÝ THUẾ */}
      <section className="bg-white rounded-[2.5rem] shadow-custom border border-gray-50 p-8 space-y-8">
        <SectionHeader icon={MapPin} title="02. Địa chỉ đăng ký doanh nghiệp" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label text="Quốc gia" />
            <div className="h-12 px-5 flex items-center bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-400">
              <Globe size={16} className="mr-3" /> Việt Nam
            </div>
          </div>
          <div className="space-y-2">
            <Label text="Tỉnh / Thành phố" />
            <SelectComponent
              placeholder="Chọn Tỉnh/Thành"
              options={provinces.map((p) => ({
                label: p.fullName,
                value: p.code,
              }))}
              value={formData.taxProvinceCode || ""}
              onChange={handleProvinceChange}
              className={cn(errors?.taxProvinceCode && "animate-shake")}
            />
          </div>
          <div className="space-y-2">
            <Label text="Phường / Xã" />
            <SelectComponent
              disabled={!formData.taxProvinceCode}
              placeholder={
                !formData.taxProvinceCode ? "Chọn Tỉnh trước" : "Chọn Phường/Xã"
              }
              options={wards.map((w) => ({ label: w.fullName, value: w.code }))}
              value={formData.taxWardCode || ""}
              onChange={handleWardChange}
              className={cn(errors?.taxWardCode && "animate-shake")}
            />
          </div>
        </div>
        <FormInput
          isTextArea
          label="Địa chỉ chi tiết (như trên GPKD/CCCD)"
          placeholder="Số nhà, tên đường..."
          value={formData.taxAddressDetail || ""}
          onChange={(e) => updateFormField("taxAddressDetail", e.target.value)}
          required
          error={errors?.taxAddressDetail} // Truyền error
        />
      </section>

      {/* 03. LIÊN HỆ & MÃ SỐ THUẾ */}
      <section className="bg-white rounded-[2.5rem] shadow-custom border border-gray-50 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <SectionHeader icon={Hash} title="03. Liên hệ & Mã số thuế" />
        </div>
        <FormInput
          label="Email nhận hóa đơn"
          type="email"
          value={formData.billingEmail || ""}
          onChange={(e) => updateFormField("billingEmail", e.target.value)}
          required
          error={errors?.billingEmail} // Truyền error
        />
        <FormInput
          label="Mã số thuế"
          maxLengthNumber={13}
          value={formData.taxId || ""}
          onChange={(e) =>
            updateFormField("taxId", e.target.value.replace(/[^0-9]/g, ""))
          }
          required
          error={errors?.taxId} // Truyền error
        />
      </section>
    </div>
  );
};

function Label({ text }: { text: string }) {
  return (
    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 block mb-2 tracking-widest">
      {text}
    </label>
  );
}