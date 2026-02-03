/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useMemo } from "react";
import { PortalModal } from "@/features/PortalModal";
import {
  FormInput,
  SelectComponent,
  ButtonField,
  Button,
  CustomButtonActions,
  Checkbox,
} from "@/components";
import { AddressModalProps } from "./type";
import {
  MapPin,
  User,
  Navigation,
  ShieldCheck,
  PackageCheck,
  RotateCcw,
  CheckCircle2,
  Save,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { StatusTabItem, StatusTabs } from "@/app/(shop)/shop/_components";
import { useOnboarding } from "../../_contexts/shop.onboarding.context";

import { AddressRole } from "./type";
export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  modalData,
  setModalData,
  modalErrors,
  setModalErrors,
  isEdit = false,
}) => {
  const {
    provinces,
    wards,
    country: countries,
    fetchWardsByProvince,
  } = useOnboarding();

  // Mapping Options cho Select
  const countryOptions = useMemo(
    () =>
      countries.map((c: any) => ({
        label: c.fullName || c.name,
        value: c.code,
      })),
    [countries],
  );
  const provinceOptions = useMemo(
    () => provinces.map((p: any) => ({ label: p.fullName, value: p.code })),
    [provinces],
  );
  const wardOptions = useMemo(
    () => wards.map((w: any) => ({ label: w.fullName, value: w.code })),
    [wards],
  );

  const updateModalData = useCallback(
    (key: string, value: any) => {
      setModalData((prev: any) => ({ ...prev, [key]: value }));
      if (modalErrors[key])
        setModalErrors((prev: any) => ({ ...prev, [key]: "" }));
    },
    [modalErrors, setModalData, setModalErrors],
  );

  // Cấu hình các Checkbox vai trò
  const ADDRESS_ROLES = [
    {
      key: "isDefault",
      label: "Địa chỉ mặc định",
      icon: CheckCircle2,
      desc: "Sử dụng làm địa chỉ chính",
    },
    {
      key: "isDefaultPickup",
      label: "Địa chỉ lấy hàng",
      icon: PackageCheck,
      desc: "Nơi shipper đến lấy hàng",
    },
    {
      key: "isDefaultReturn",
      label: "Địa chỉ hoàn hàng",
      icon: RotateCcw,
      desc: "Nơi nhận hàng khách trả về",
    },
  ];

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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
              Logistics Management System
            </p>
          </div>
        </div>
      }
      footer={
        <CustomButtonActions
          onCancel={onClose}
          onSubmit={onSave}
          submitText=" Xác nhận địa chỉ"
          submitIcon={Save}
          containerClassName="w-full flex gap-3 border-t-0"
          className="w-48! h-12 rounded-4xl"
        />
      }
      width="max-w-2xl"
      className="rounded-[2.5rem] border-none shadow-2xl"
    >
      <div className="space-y-8 py-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100/60">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Vai trò của địa chỉ này
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ADDRESS_ROLES.map((role) => (
              <div
                key={role.key}
                onClick={() => updateModalData(role.key, !modalData[role.key])}
                className={cn(
                  "p-4 rounded-3xl border-2 transition-all cursor-pointer select-none flex flex-col gap-3 group",
                  modalData[role.key]
                    ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/5"
                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200",
                )}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      modalData[role.key]
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-400 group-hover:text-gray-600",
                    )}
                  >
                    <role.icon size={18} />
                  </div>
                  <Checkbox
                    checked={modalData[role.key]}
                    onChange={() => {}} // Đã xử lý ở thẻ div cha
                    sizeClassName="w-5 h-5"
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      modalData[role.key] ? "text-gray-900" : "text-gray-500",
                    )}
                  >
                    {role.label}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                    {role.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần thông tin nhân sự */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100/60">
            <User size={16} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Nhân sự phụ trách
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Họ và tên đại diện"
              value={modalData.fullName}
              onChange={(e) => updateModalData("fullName", e.target.value)}
              error={modalErrors.fullName}
              required
            />
            <FormInput
              label="Số điện thoại"
              value={modalData.phone}
              onChange={(e) =>
                updateModalData("phone", e.target.value.replace(/[^0-9]/g, ""))
              }
              error={modalErrors.phone}
              required
              maxLengthNumber={11}
            />
          </div>
        </div>

        {/* Phần vị trí định vị */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100/60">
            <Navigation size={16} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Vị trí định vị kho hàng
            </span>
          </div>
          <div className="p-8 bg-gray-50/50 rounded-4xl border border-gray-100 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SelectComponent
                label="Quốc gia"
                options={countryOptions}
                value={modalData.countryCode || "VN"}
                onChange={(val) => updateModalData("countryCode", val)}
              />
              <SelectComponent
                label="Tỉnh / Thành phố"
                options={provinceOptions}
                value={modalData.provinceCode}
                error={modalErrors.province}
                onChange={(val) => {
                  const selected = provinces.find((p: any) => p.code === val);
                  setModalData((prev: any) => ({
                    ...prev,
                    provinceCode: val,
                    provinceName: selected?.fullName || "",
                    wardCode: "",
                    wardName: "",
                  }));
                  fetchWardsByProvince(val);
                }}
              />
              <SelectComponent
                label="Phường / Xã"
                options={wardOptions}
                value={modalData.wardCode}
                error={modalErrors.ward}
                disabled={!modalData.provinceCode}
                onChange={(val) => {
                  const selected = wards.find((w: any) => w.code === val);
                  updateModalData("wardCode", val);
                  updateModalData("wardName", selected?.fullName || "");
                }}
              />
            </div>
            <FormInput
              isTextArea
              label="Địa chỉ chi tiết"
              value={modalData.addressDetail}
              onChange={(e) => updateModalData("addressDetail", e.target.value)}
              error={modalErrors.addressDetail}
              required
              maxLengthNumber={200}
            />
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50/50 rounded-full border border-emerald-100/50">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest italic">
              Secure Onboarding Protocol
            </span>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
