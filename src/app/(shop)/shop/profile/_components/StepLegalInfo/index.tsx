/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { FormInput, SelectComponent } from "@/components";
import { ImageUploadField } from "@/app/(main)/profile/_components/ImageUploadField";
import { Globe, Fingerprint, User, CreditCard, Info } from "lucide-react";

export function StepLegalInfo({ formData, setFormData, errors }: any) {
  // Hàm cập nhật state chung
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const nationalityOptions = [
    { label: "Việt Nam", value: "vn" },
    { label: "Hoa Kỳ", value: "us" },
    { label: "Nhật Bản", value: "jp" },
    { label: "Hàn Quốc", value: "kr" },
    { label: "Anh", value: "uk" },
    { label: "Pháp", value: "fr" },
    { label: "Đức", value: "de" },
    { label: "Úc", value: "au" },
    { label: "Canada", value: "ca" },
    { label: "Singapore", value: "sg" },
  ];

  const idTypeOptions = [
    { label: "Căn Cước Công Dân (CCCD)", value: "cccd" },
    { label: "Chứng Minh Nhân Dân (CMND)", value: "cmnd" },
    { label: "Hộ chiếu", value: "passport" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-10">
      
      {/* 01. Thông tin định danh cơ bản */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 px-2">
          <User size={14} /> 01. Định danh cá nhân
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                <Globe size={14} /> Quốc tịch <span className="text-red-500">*</span>
              </label>
              <SelectComponent
                options={nationalityOptions}
                value={formData.nationality}
                onChange={(val) => updateField("nationality", val)}
                placeholder="Chọn quốc tịch"
              />
              {errors?.nationality && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.nationality}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                <Fingerprint size={14} /> Loại giấy tờ <span className="text-red-500">*</span>
              </label>
              <SelectComponent
                options={idTypeOptions}
                value={formData.idType}
                onChange={(val) => updateField("idType", val)}
                placeholder="Chọn hình thức"
              />
              {errors?.idType && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.idType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Số định danh"
              required
              value={formData.idNumber}
              onChange={(e) => updateField("idNumber", e.target.value)}
              placeholder="Nhập số CCCD/CMND/Hộ chiếu"
              error={errors?.idNumber}
            />
            <FormInput
              label="Họ & Tên chủ sở hữu"
              required
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Nhập đầy đủ họ và tên"
              maxLength={50}
              error={errors?.fullName}
            />
          </div>
        </div>
      </div>

      {/* 02. Hình ảnh giấy tờ */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 px-2">
          <CreditCard size={14} /> 02. Xác thực hình ảnh
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
          
          {/* Tải lên CCCD/Passport */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 items-start">
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                Ảnh chụp giấy tờ <span className="text-red-500">*</span>
              </label>
              <div className="p-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2rem] transition-colors hover:border-orange-200">
                <ImageUploadField
                  value={formData.idImages || []}
                  onChange={(val) => updateField("idImages", val)}
                  maxCount={formData.idType === "passport" ? 1 : 2}
                  allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                  maxSizeMB={50}
                />
              </div>
              {errors?.idImages && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.idImages}</p>}
            </div>

            <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100 space-y-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-wider">
                <Info size={14} /> Hướng dẫn
              </div>
              <ul className="space-y-2 text-[11px] text-orange-800/80 font-medium leading-relaxed">
                <li className="flex gap-2"><span>•</span> <span>CCCD/CMND: Cần đủ 2 mặt</span></li>
                <li className="flex gap-2"><span>•</span> <span>Passport: Cần trang thông tin chính</span></li>
                <li className="flex gap-2"><span>•</span> <span>Ảnh rõ nét, không bị lóa sáng</span></li>
              </ul>
            </div>
          </div>

          {/* Tải lên khuôn mặt */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 items-start pt-8 border-t border-gray-100">
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                Ảnh sinh trắc học khuôn mặt <span className="text-red-500">*</span>
              </label>
              <div className="p-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2rem] transition-colors hover:border-orange-200">
                <ImageUploadField
                  value={formData.faceImages || []}
                  onChange={(val) => updateField("faceImages", val)}
                  maxCount={1}
                  allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                  maxSizeMB={50}
                />
              </div>
              {errors?.faceImages && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.faceImages}</p>}
            </div>

            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider">
                <Info size={14} /> Hướng dẫn
              </div>
              <ul className="space-y-2 text-[11px] text-blue-800/80 font-medium leading-relaxed">
                <li className="flex gap-2"><span>•</span> <span>Chụp chính diện, ngồi thẳng</span></li>
                <li className="flex gap-2"><span>•</span> <span>Không đeo kính râm/khẩu trang</span></li>
                <li className="flex gap-2"><span>•</span> <span>Đảm bảo đủ ánh sáng</span></li>
              </ul>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}