/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { FormInput } from "@/components"; // Sử dụng FormInput chung cho cả Input và TextArea
import {
  useGetAllProvinces,
  useGetWardsByProvinceCode,
} from "@/hooks/address/useAddress";
import type { ProvinceResponse, WardResponse } from "@/types/address/address.types";
import { Briefcase, MapPin, Mail, Hash, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export function StepTaxInfo({ formData, setFormData }: any) {
  // API địa chỉ
  const { fetchProvinces, data: provincesData } = useGetAllProvinces();
  const { fetchWards, data: wardsData } = useGetWardsByProvinceCode();

  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [wards, setWards] = useState<WardResponse[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");

  // Load tỉnh/thành phố khi mount
  useEffect(() => {
    fetchProvinces({ page: 0, size: 100 });
  }, []);

  useEffect(() => {
    if (provincesData?.content) setProvinces(provincesData.content);
  }, [provincesData]);

  // Load phường/xã khi chọn tỉnh
  useEffect(() => {
    if (selectedProvinceCode) {
      setWards([]);
      fetchWards(selectedProvinceCode, { page: 0, size: 1000 });
    }
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (wardsData?.content) setWards(wardsData.content);
  }, [wardsData]);

  // Hàm update form state chung
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-10">
      
      {/* 01. Loại hình kinh doanh */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase  text-gray-500">
          <Briefcase size={14} /> 01. Hình thức pháp lý
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "personal", label: "Cá nhân" },
            { id: "household", label: "Hộ kinh doanh" },
            { id: "company", label: "Công ty" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => updateField("businessType", type.id)}
              className={cn(
                "py-4 px-6 rounded-2xl border font-bold text-sm transition-all active:scale-95",
                formData.businessType === type.id
                  ? "bg-gray-900 text-white border-gray-900 shadow-xl"
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 02. Địa chỉ kinh doanh */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase  text-gray-500">
          <MapPin size={14} /> 02. Địa chỉ đăng ký
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quốc gia (Fixed) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1">Quốc gia</label>
              <div className="h-12 px-5 flex items-center bg-gray-100/50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700">
                <Globe size={14} className="mr-2 text-gray-500" /> Việt Nam
              </div>
            </div>

            {/* Tỉnh/Thành phố */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1">Tỉnh / Thành phố</label>
              <div className="relative">
                <select
                  className="w-full h-12 px-5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-gray-500 appearance-none transition-all"
                  value={formData.provinceName || ""}
                  onChange={(e) => {
                    const selected = provinces.find(p => p.fullName === e.target.value);
                    if (selected) {
                      setSelectedProvinceCode(selected.code);
                      setFormData((prev: any) => ({
                        ...prev,
                        provinceName: selected.fullName,
                        provinceCode: selected.code,
                        wardName: "",
                        wardCode: ""
                      }));
                    }
                  }}
                >
                  <option value="">Chọn Tỉnh/TP</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.fullName}>{p.fullName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Phường/Xã */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1">Phường / Xã</label>
              <div className="relative">
                <select
                  disabled={!selectedProvinceCode}
                  className="w-full h-12 px-5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-gray-500 appearance-none disabled:opacity-50 transition-all"
                  value={formData.wardName || ""}
                  onChange={(e) => {
                    const selected = wards.find(w => w.fullName === e.target.value);
                    if (selected) {
                      setFormData((prev: any) => ({
                        ...prev,
                        wardName: selected.fullName,
                        wardCode: selected.code,
                        districtName: selected.fullName, // Để tương thích backend cũ
                      }));
                    }
                  }}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map(w => (
                    <option key={w.code} value={w.fullName}>{w.fullName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <FormInput
            isTextArea
            rows={2}
            label="Địa chỉ chi tiết (Số nhà, tên đường)"
            placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
            value={formData.addressDetail}
            onChange={(e) => updateField("addressDetail", e.target.value)}
            required
          />

          <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
              Địa chỉ kinh doanh: theo giấy phép kinh doanh (Công ty/Hộ kinh doanh) hoặc CCCD (Cá nhân).
            </p>
          </div>
        </div>
      </div>

      {/* 03. Liên hệ & Thuế */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase  text-gray-500">
          <Hash size={14} /> 03. Liên hệ & Mã số thuế
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email nhận hóa đơn"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
          <FormInput
            label="Mã số thuế"
            placeholder="Nhập 10 hoặc 13 số"
            maxLength={13}
            value={formData.taxId}
            onChange={(e) => updateField("taxId", e.target.value.replace(/[^0-9]/g, ""))}
            required
          />
        </div>
      </div>
    </div>
  );
}

// Icon helper cho Alert
function Info({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}