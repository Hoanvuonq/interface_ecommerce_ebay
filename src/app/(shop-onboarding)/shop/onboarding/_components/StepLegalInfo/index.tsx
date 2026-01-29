/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormInput, SelectComponent } from "@/components";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import {
  CreditCard,
  Fingerprint,
  Globe,
  Info,
  ShieldCheck,
  User,
} from "lucide-react";
import { useCallback } from "react";
import { useOnboarding } from "../../_contexts/shop.onboarding.context";
import { PrivateImageUploadField } from "../PrivateImageUploadField";
import { idTypeOptions, nationalityOptions } from "./type";

export const StepLegalInfo = ({ errors }: { errors?: any }) => {
  const { formData, updateFormField } = useOnboarding();
  const { uploadFile } = usePresignedUpload();

  const updateField = useCallback(
    (field: string, value: any) => {
      updateFormField(field, value);
    },
    [updateFormField],
  );

  const handlePrivateUpload = async (file: File, options: any) => {
    try {
      // 🟢 QUAN TRỌNG: Truyền flag isPrivate = true vào đây
      const res = await uploadFile(
        file,
        UploadContext.DOCUMENT,
        true, // Tham số isPrivate
        options, // Chứa onUploadProgress
      );
      return res;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4">
          <User size={14} /> 01. Định danh chủ sở hữu
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                <Globe size={14} className="text-orange-500" /> Quốc tịch
                <span className="text-red-500">*</span>
              </label>
              <SelectComponent
                options={nationalityOptions}
                value={formData?.nationality || ""}
                onChange={(val) => updateField("nationality", val)}
                placeholder="Chọn quốc tịch"
                className="rounded-2xl!"
              />
              {errors?.nationality && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 uppercase tracking-tighter">
                  {errors.nationality}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                <Fingerprint size={14} className="text-orange-500" /> Loại giấy
                tờ <span className="text-red-500">*</span>
              </label>
              <SelectComponent
                options={idTypeOptions}
                value={formData?.idType || ""}
                onChange={(val) => updateField("idType", val)}
                placeholder="Chọn hình thức"
                className="rounded-2xl!"
              />
              {errors?.idType && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 uppercase tracking-tighter">
                  {errors.idType}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
            <FormInput
              label="Số định danh pháp lý"
              required
              value={formData?.idNumber || ""}
              onChange={(e) => updateField("idNumber", e.target.value)}
              placeholder="Nhập số CCCD/Passport..."
              error={errors?.idNumber}
              className="rounded-2xl!"
            />
            <FormInput
              label="Họ & Tên trên giấy tờ"
              required
              value={formData?.fullName || ""}
              onChange={(e: any) => updateField("fullName", e.target.value)}
              placeholder="Nhập đầy đủ họ và tên"
              maxLength={50}
              error={errors?.fullName}
              className="rounded-2xl!"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4">
          <CreditCard size={14} /> 02. Hệ thống xác thực sinh trắc học
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                Ảnh chụp giấy tờ gốc <span className="text-red-500">*</span>
              </label>
              <div className="p-4 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner inline-block w-full sm:w-auto">
                <PrivateImageUploadField
                  maxCount={2}
                  value={formData.idImages}
                  onChange={(files) => updateField("idImages", files)}
                  onUploadApi={handlePrivateUpload} 
                  context={UploadContext.DOCUMENT}
                />
              </div>
              {errors?.idImages && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 uppercase tracking-tighter">
                  {errors.idImages}
                </p>
              )}
            </div>

            <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50 space-y-4">
              <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest">
                <Info size={14} /> Hướng dẫn
              </div>
              <ul className="space-y-3 text-[11px] text-orange-800/70 font-bold leading-relaxed tracking-tight">
                <li>• CCCD/CMND: Tải đủ 2 mặt</li>
                <li>• Passport: Trang thông tin chính</li>
                <li>• Ảnh rõ nét, không bị lóa</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start pt-10 border-t border-gray-50">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                Ảnh sinh trắc học khuôn mặt{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="p-4 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner inline-block w-full sm:w-auto">
                <PrivateImageUploadField
                  maxCount={1}
                  value={
                    Array.isArray(formData.faceImages)
                      ? formData.faceImages
                      : []
                  }
                  onUploadApi={handlePrivateUpload}
                  onChange={(files) => updateField("faceImages", files)}
                />
              </div>
              {errors?.faceImages && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 uppercase tracking-tighter">
                  {errors.faceImages}
                </p>
              )}
            </div>

            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} /> Bảo mật AI
              </div>
              <ul className="space-y-3 text-[11px] text-blue-800/70 font-bold leading-relaxed tracking-tight">
                <li>• Chụp chính diện, ánh sáng đều</li>
                <li>• Không đeo khẩu trang</li>
                <li>• Ảnh chụp trực tiếp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
