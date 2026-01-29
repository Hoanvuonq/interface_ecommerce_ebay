/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback } from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, SelectComponent, ButtonField } from "@/components";
import { AddressModalProps } from "./type";
import {
  MapPin,
  User,
  Phone,
  Navigation,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button";

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  modalData,
  setModalData,
  modalErrors,
  setModalErrors,
  provinceOptions,
  wardOptions,
  provinces,
  wards,
  isEdit = false,
}) => {
  const updateModalData = useCallback(
    (key: string, value: any) => {
      setModalData((prev: any) => {
        if (prev[key] === value) return prev; 
        return { ...prev, [key]: value };
      });

      if (modalErrors[key]) {
        setModalErrors((prev: any) => ({ ...prev, [key]: "" }));
      }
    },
    [modalErrors, setModalData, setModalErrors],
  );

  const footer = (
    <div className="flex flex-col sm:flex-row justify-end gap-3 w-full py-4 px-6 border-t border-gray-50 bg-gray-50/20">
      <Button
        variant="edit"
        type="button"
        onClick={onClose}
        className="px-8 h-11 rounded-2xl font-bold text-[11px] uppercase tracking-widest text-gray-500 border-gray-200 hover:bg-white transition-all"
      >
        Hủy bỏ
      </Button>
      <ButtonField
        htmlType="submit"
        type="login"
        onClick={onSave}
        className="w-full sm:w-auto h-11 px-10 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-orange-500/10 border-0 transition-all active:scale-95"
      >
        Xác nhận địa chỉ
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
            <MapPin size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">
              {isEdit ? "Cấu hình" : "Thiết lập"} địa chỉ lấy hàng
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
              Logistics Management System
            </p>
          </div>
        </div>
      }
      footer={footer}
      width="max-w-2xl"
      className="rounded-[2.5rem] border-none shadow-2xl"
    >
      <div className="space-y-8 py-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100/60">
            <User size={16} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
              Nhân sự phụ trách lấy hàng
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Họ và tên đại diện"
              placeholder="Nhập tên người liên hệ"
              value={modalData.fullName}
              onChange={(e) => updateModalData("fullName", e.target.value)}
              error={modalErrors.fullName}
              required
              className="rounded-2xl! focus:border-orange-400!"
            />

            <FormInput
              label="Số điện thoại kết nối"
              placeholder="09xx xxx xxx"
              inputMode="tel"
              value={modalData.phone}
              onChange={(e) =>
                updateModalData("phone", e.target.value.replace(/[^0-9]/g, ""))
              }
              error={modalErrors.phone}
              required
              maxLengthNumber={11}
              className="rounded-2xl! focus:border-orange-400!"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100/60">
            <Navigation size={16} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
              Vị trí định vị kho hàng
            </span>
          </div>

          <div className="p-8 bg-gray-50/50 rounded-4xl border border-gray-100 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 tracking-widest">
                  Quốc gia
                </label>
                <div className="h-12 px-5 flex items-center bg-gray-100/50 border border-gray-200 rounded-2xl text-[13px] font-bold text-gray-500 cursor-not-allowed">
                  Việt Nam
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 tracking-widest">
                  Tỉnh / Thành phố
                </label>
                <SelectComponent
                  options={provinceOptions}
                  value={modalData.provinceCode}
                  onChange={(val) => {
                    const selected = provinces.find((p) => p.code === val);
                    setModalData((prev: any) => ({
                      ...prev,
                      provinceCode: val,
                      provinceName: selected?.fullName || "",
                      wardCode: "",
                      wardName: "",
                    }));
                    if (modalErrors.province)
                      setModalErrors((prev: any) => ({
                        ...prev,
                        province: "",
                      }));
                  }}
                  placeholder="Chọn Tỉnh/TP"
                  className={cn(
                    "rounded-2xl! border-gray-200! hover:border-orange-300!",
                    modalErrors.province && "border-red-400! bg-red-50/10",
                  )}
                />
                {modalErrors.province && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">
                    {modalErrors.province}
                  </p>
                )}
              </div>

              {/* Phường / Xã */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 tracking-widest">
                  Phường / Xã
                </label>
                <SelectComponent
                  options={wardOptions}
                  value={modalData.wardCode}
                  onChange={(val) => {
                    const selected = wards.find((w) => w.code === val);
                    updateModalData("wardCode", val);
                    updateModalData("wardName", selected?.fullName || "");
                  }}
                  placeholder="Chọn Phường/Xã"
                  disabled={!modalData.provinceCode}
                  className={cn(
                    "rounded-2xl! border-gray-200! hover:border-orange-300!",
                    modalErrors.ward && "border-red-400! bg-red-50/10",
                  )}
                />
                {modalErrors.ward && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">
                    {modalErrors.ward}
                  </p>
                )}
              </div>
            </div>

            <FormInput
              isTextArea
              label="Địa chỉ vận hành chi tiết"
              placeholder="Số nhà, tên tòa nhà, ngõ ngách..."
              rows={3}
              value={modalData.addressDetail}
              onChange={(e) => updateModalData("addressDetail", e.target.value)}
              error={modalErrors.addressDetail}
              required
              maxLengthNumber={200}
              className="rounded-3xl! bg-white border-gray-200 focus:border-orange-400!"
            />
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50/50 rounded-full border border-emerald-100/50 shadow-sm shadow-emerald-50">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
              End-to-End Encryption Secured
            </span>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
