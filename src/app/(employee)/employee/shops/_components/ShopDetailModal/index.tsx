/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ButtonField,
  FormInput,
  SectionLoading,
  CustomButtonActions,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import {
  BadgeAlert,
  BadgeCheck,
  CreditCard,
  ExternalLink,
  FileText,
  History,
  ShieldCheck,
  Store,
  VerifiedIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  type as businessTypeMap,
  colorMap,
  labelMap,
  nationalityMap,
  ShopStatus,
  VerifiedStatus,
  verifyStatusColorMap,
  verifyStatusMap,
} from "../../_types/manager.shop.type";
import { RejectShopModal } from "../RejectShopModal";
import { ShopDetailModalProps } from "./type";

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
  open,
  shop,
  detailData,
  loading = false,
  legalLoading = false,
  taxLoading = false,
  onClose,
  onApproveLegal,
  onRejectLegal,
  onApproveTax,
  onRejectTax,
}) => {
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    type?: "legal" | "tax";
    id?: string;
  }>({ open: false });

  const shopId = shop?.shopId || detailData?.shopId;

  const handleOpenReject = (type: "legal" | "tax", id: string) => {
    setRejectModal({ open: true, type, id });
  };

  const handleConfirmReject = async (reason: string) => {
    if (!shopId || !rejectModal.id) return;
    if (rejectModal.type === "legal") {
      await onRejectLegal(shopId, rejectModal.id, reason);
    } else {
      await onRejectTax(shopId, rejectModal.id, reason);
    }
    setRejectModal({ open: false });
  };

  if (!open) return null;

  const legal = detailData?.legalInfo;
  const tax = detailData?.taxInfo;

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Store size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-gray-800 leading-none">
              Thẩm định hồ sơ
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              Shop Management • ID: {shopId}
            </p>
          </div>
        </div>
      }
      width="max-w-5xl"
      footer={
        <ButtonField
          htmlType="submit"
          type="login"
          onClick={onClose}
          className="px-10 w-50 h-12 rounded-2xl font-bold uppercase text-[11px] tracking-widest border-gray-200"
        >
          Đóng cửa sổ
        </ButtonField>
      }
    >
      <div className="relative">
        {loading && <SectionLoading message="Đang đồng bộ dữ liệu hồ sơ..." />}

        {detailData ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 p-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100/60">
                  <BadgeCheck className="text-blue-500" size={20} />
                  <h4 className="font-bold text-[12px] uppercase tracking-[0.15em] text-gray-500">
                    Thông tin thương hiệu
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormInput
                    label="Tên cửa hàng"
                    value={detailData.shopName}
                    readOnly
                    className="bg-gray-50/50 font-bold italic"
                  />
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-700 ml-1">
                      Trạng thái vận hành
                    </label>
                    <div className="h-12 px-5 flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl shadow-sm">
                      <span
                        className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase text-white shadow-sm"
                        style={{
                          backgroundColor:
                            colorMap[detailData.status as ShopStatus],
                        }}
                      >
                        {labelMap[detailData.status as ShopStatus]}
                      </span>
                    </div>
                  </div>
                  <FormInput
                    label="Người phê duyệt"
                    value={detailData.verifyBy || "System Admin"}
                    readOnly
                    className="bg-gray-50/50"
                  />
                  <FormInput
                    label="Ngày khởi tạo"
                    value={new Date(detailData.createdDate).toLocaleDateString(
                      "vi-VN",
                    )}
                    readOnly
                    className="bg-gray-50/50"
                  />
                </div>
                <FormInput
                  isTextArea
                  label="Mô tả shop"
                  value={detailData.description ?? ""}
                  readOnly
                  className="bg-gray-50/50 italic text-gray-600 min-h-24"
                />
              </div>

              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="relative w-full aspect-square bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-4 flex items-center justify-center group overflow-hidden">
                  {detailData.logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={toPublicUrl(
                          toSizedVariant(detailData.logoUrl, "_orig"),
                        )}
                        alt="logo"
                        fill
                        unoptimized
                        className="rounded-[2.5rem] object-cover shadow-inner group-hover:scale-110 transition-transform duration-700 p-2"
                      />
                    </div>
                  ) : (
                    <Store className="text-gray-200" size={100} />
                  )}
                </div>
              </div>
            </div>

            <section className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-8 space-y-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5 text-purple-900 rotate-12">
                <ShieldCheck size={220} />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">
                    <CreditCard size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] uppercase tracking-widest text-gray-800 leading-none">
                      Thông tin định danh
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 italic">
                      KYC Verification Data
                    </p>
                  </div>
                </div>

                {legal && legal.verifiedStatus === "PENDING" && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <CustomButtonActions
                      onCancel={() => handleOpenReject("legal", legal.legalId)}
                      onSubmit={() => onApproveLegal(shopId, legal.legalId)}
                      isDisabled={legalLoading}
                      cancelText="Từ Chối"
                      submitText="Duyệt Pháp Lý"
                      submitIcon={VerifiedIcon}
                      containerClassName="w-full flex gap-3 border-t-0 pt-0 justify-end"
                      className="w-44! rounded-4xl h-12 shadow-orange-200 shadow-lg"
                    />
                  </div>
                )}
              </div>

              {legal ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                  <div className="lg:col-span-4 space-y-6">
                    <FormInput
                      label="Họ tên đầy đủ"
                      value={legal.fullName}
                      readOnly
                      className="bg-gray-50 font-bold"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Quốc tịch"
                        value={
                          nationalityMap[legal.nationality] || legal.nationality
                        }
                        readOnly
                        className="bg-gray-50"
                      />
                      <FormInput
                        label="Số định danh"
                        value={legal.identityNumber}
                        readOnly
                        className="bg-gray-50 font-mono font-bold text-blue-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Trạng thái hồ sơ
                      </label>
                      <div className="h-12 px-5 flex items-center bg-gray-50 border border-gray-200 rounded-2xl">
                        <span
                          className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase text-white shadow-sm"
                          style={{
                            backgroundColor:
                              verifyStatusColorMap[
                                legal.verifiedStatus as VerifiedStatus
                              ],
                          }}
                        >
                          {
                            verifyStatusMap[
                              legal.verifiedStatus as VerifiedStatus
                            ]
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          url: legal.frontImagePreviewUrl,
                          label: "Mặt trước CCCD",
                        },
                        {
                          url: legal.backImagePreviewUrl,
                          label: "Mặt sau CCCD",
                        },
                        {
                          url: legal.faceImagePreviewUrl,
                          label: "Chân dung chủ shop",
                        },
                      ].map(
                        (img, i) =>
                          img.url && (
                            <div
                              key={i}
                              className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm aspect-square bg-gray-50"
                            >
                              <Image
                                src={img.url}
                                alt={img.label}
                                fill
                                unoptimized
                                className="object-cover transition-all duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all p-4 text-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-tight mb-2">
                                  {img.label}
                                </span>
                                <a
                                  href={img.url}
                                  target="_blank"
                                  className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-transform active:scale-90"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NoDataPlaceholder message="Hồ sơ nhân thân chưa được cung cấp" />
              )}
            </section>

            <section className="bg-gray-50/50 rounded-[3rem] border border-gray-100 p-8 space-y-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
                    <FileText size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] uppercase tracking-widest text-gray-800 leading-none">
                      Thông tin thuế quan
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 italic">
                      Tax Compliance Data
                    </p>
                  </div>
                </div>

                {tax && tax.verifiedStatus === "PENDING" && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <CustomButtonActions
                      onCancel={() => onApproveTax(shopId, tax.taxId)}
                      onSubmit={() => handleOpenReject("tax", tax.taxId)}
                      isDisabled={legalLoading}
                      cancelText="Từ Chối"
                      submitText="Xác Thực Thuế"
                      submitIcon={VerifiedIcon}
                      containerClassName="w-full flex gap-3 border-t-0 pt-0 justify-end"
                      className="w-44! rounded-4xl h-12 shadow-orange-200 shadow-lg"
                    />
                  </div>
                )}
              </div>

              {tax ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                  <FormInput
                    label="Loại hình đăng ký"
                    value={businessTypeMap[tax.type] || tax.type}
                    readOnly
                    className="bg-white font-bold"
                  />
                  <FormInput
                    label="Mã số thuế (MST)"
                    value={tax.taxIdentificationNumber}
                    readOnly
                    className="bg-white font-bold text-gray-900 text-sm tracking-tighter"
                  />
                  <FormInput
                    label="Email hóa đơn"
                    value={tax.email}
                    readOnly
                    className="bg-white text-blue-600 font-bold border-b-blue-200 border-b"
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <FormInput
                      isTextArea
                      label="Địa chỉ trụ sở"
                      value={tax.registeredAddress?.detail}
                      readOnly
                      className="bg-white min-h-20 font-medium"
                    />
                  </div>
                </div>
              ) : (
                <NoDataPlaceholder message="Chưa khai báo dữ liệu thuế quan" />
              )}
            </section>
          </div>
        ) : (
          <NoDataPlaceholder message="Hệ thống đang đồng bộ dữ liệu shop..." />
        )}
      </div>

      <RejectShopModal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false })}
        onConfirm={handleConfirmReject}
        isLoading={legalLoading || taxLoading}
        shopName={shop?.shopName || detailData?.shopName}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <BadgeAlert size={20} />
            <span className="font-bold uppercase tracking-tighter text-[13px]">
              Từ chối hồ sơ {rejectModal.type === "tax" ? "Thuế" : "Định danh"}
            </span>
          </div>
        }
        subTitle={`Phê duyệt hồ sơ ${rejectModal.type === "tax" ? "Tài chính" : "Pháp lý"}`}
      />
    </PortalModal>
  );
};

const NoDataPlaceholder = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
    <div className="p-6 bg-white rounded-full shadow-lg mb-4 text-gray-200 animate-pulse">
      <History size={48} />
    </div>
    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300 italic">
      {message}
    </p>
  </div>
);
