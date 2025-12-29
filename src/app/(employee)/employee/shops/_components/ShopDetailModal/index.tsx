/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  identityMap,
  nationalityMap,
  type,
  verifyStatusMap,
  VerifiedStatus,
  labelMap,
  ShopStatus,
  colorMap,
  verifyStatusColorMap,
} from "../../_types/manager.shop.type";
import { useShopApprovalStore } from "../../_store/useShopApprovalStore";
import { TextAreaField } from "@/components";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import { ShopDetailModalProps } from "./type";
import { PortalModal } from "@/features/PortalModal";

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
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
  const [rejectLegalModal, setRejectLegalModal] = useState<{
    open: boolean;
    legalId?: string;
  }>({ open: false });

  const [rejectTaxModal, setRejectTaxModal] = useState<{
    open: boolean;
    taxId?: string;
  }>({ open: false });

  const [rejectReason, setRejectReason] = useState("");

  const shopId = shop?.shopId || detailData?.shopId;

  if (!open) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={`🏪 Chi tiết Shop: ${shop?.shopName || detailData?.shopName}`}
      width="max-w-4xl"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
        >
          Đóng
        </button>
      }
    >
      <div className="relative min-h-75">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-600 font-medium italic">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}

        {detailData ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b border-gray-200 pb-2">
                <span className="text-blue-500">🧾</span> Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2">
                    <strong className="text-gray-500 min-w-35">Tên shop:</strong> 
                    <span className="text-gray-900 font-semibold">{detailData.shopName}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <strong className="text-gray-500 min-w-35">Mô tả:</strong> 
                    <span className="text-gray-700">{detailData.description || "--"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <strong className="text-gray-500 min-w-35">Trạng thái:</strong>
                    <span 
                      className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: colorMap[detailData.status as ShopStatus] }}
                    >
                      {labelMap[detailData.status as ShopStatus] ?? "--"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <strong className="text-gray-500 min-w-35">Người duyệt:</strong> 
                    <span className="font-medium">{detailData.verifyBy || "--"}</span>
                  </p>
                  <div className="pt-2 border-t border-gray-100 space-y-2 italic text-gray-400 text-xs">
                    <p>Ngày tạo: {detailData.createdDate ? new Date(detailData.createdDate).toLocaleString("vi-VN") : "--"}</p>
                    <p>Cập nhật: {detailData.lastModifiedDate ? new Date(detailData.lastModifiedDate).toLocaleString("vi-VN") : "--"}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                  {detailData.logoUrl && (
                    <div className="group relative">
                      <img
                        src={toPublicUrl(toSizedVariant(detailData.logoUrl, "_orig"))}
                        alt="Logo"
                        className="w-28 h-28 rounded-full border-4 border-gray-50 object-cover shadow-lg transition-transform group-hover:scale-105"
                      />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded uppercase font-bold tracking-tighter">Logo</span>
                    </div>
                  )}
                  {detailData.bannerUrl && (
                    <div className="w-full relative group">
                      <img
                        src={toPublicUrl(toSizedVariant(detailData.bannerUrl, "_orig"))}
                        alt="Banner"
                        className="w-full h-24 rounded-lg border object-cover shadow-md transition-transform group-hover:brightness-105"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded uppercase font-bold">Banner</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <span className="text-purple-500">⚖️</span> Thông tin định danh
                </h3>
                {detailData.legalInfo && (detailData.legalInfo.verifiedStatus === "PENDING" || !detailData.legalInfo.verifiedStatus) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveLegal(shopId, detailData.legalInfo.legalId)}
                      disabled={legalLoading}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-md disabled:opacity-50"
                    >
                      {legalLoading ? "..." : "Duyệt"}
                    </button>
                    <button
                      onClick={() => setRejectLegalModal({ open: true, legalId: detailData.legalInfo.legalId })}
                      className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-lg border border-red-200 transition-all"
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>

              {detailData.legalInfo ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><strong className="text-gray-400">Họ tên:</strong> <span className="font-semibold text-gray-800">{detailData.legalInfo.fullName}</span></p>
                      <p><strong className="text-gray-400">Quốc tịch:</strong> {nationalityMap[detailData.legalInfo.nationality] || detailData.legalInfo.nationality || "--"}</p>
                      <p><strong className="text-gray-400">Số giấy tờ:</strong> <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{detailData.legalInfo.identityNumber}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <strong className="text-gray-400">Trạng thái:</strong>
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white"
                          style={{ backgroundColor: verifyStatusColorMap[detailData.legalInfo.verifiedStatus as VerifiedStatus] }}
                        >
                          {verifyStatusMap[detailData.legalInfo.verifiedStatus as VerifiedStatus]}
                        </span>
                      </p>
                      <p><strong className="text-gray-400">Ngày duyệt:</strong> {detailData.legalInfo.verifyDate ? new Date(detailData.legalInfo.verifyDate).toLocaleString("vi-VN") : "--"}</p>
                      <p className="text-red-500"><strong className="text-gray-400">Lý do từ chối:</strong> {detailData.legalInfo.rejectedReason || "--"}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    {[
                      { url: detailData.legalInfo.frontImageUrl, label: "Mặt trước" },
                      { url: detailData.legalInfo.backImageUrl, label: "Mặt sau" },
                      { url: detailData.legalInfo.faceImageUrl, label: "Khuôn mặt" }
                    ].map((img, i) => img.url && (
                      <div key={i} className="group relative cursor-pointer">
                        <img src={img.url} alt={img.label} className="w-40 h-28 object-cover rounded-lg border-2 border-gray-100 shadow-sm group-hover:border-blue-300 transition-all" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-all">
                          <span className="text-white text-xs font-bold">{img.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <p className="text-center italic text-gray-400 py-4">-- Không có dữ liệu định danh --</p>}
            </section>

            {/* THÔNG TIN THUẾ */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <span className="text-emerald-500">💰</span> Thông tin thuế
                </h3>
                {detailData.taxInfo && (detailData.taxInfo.verifiedStatus === "PENDING" || !detailData.taxInfo.verifiedStatus) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveTax(shopId, detailData.taxInfo.taxId)}
                      disabled={taxLoading}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all disabled:opacity-50"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => setRejectTaxModal({ open: true, taxId: detailData.taxInfo.taxId })}
                      className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-lg border border-red-200 transition-all"
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>

              {detailData.taxInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <p><strong className="text-gray-400">Loại hình:</strong> {type[detailData.taxInfo.type] || detailData.taxInfo.type || "--"}</p>
                    <p><strong className="text-gray-400">Email:</strong> <span className="text-blue-600 underline underline-offset-2">{detailData.taxInfo.email}</span></p>
                    <p><strong className="text-gray-400">MST:</strong> <span className="font-mono font-bold text-gray-700">{detailData.taxInfo.taxIdentificationNumber}</span></p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <strong className="text-gray-400">Trạng thái:</strong>
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white"
                        style={{ backgroundColor: verifyStatusColorMap[detailData.taxInfo.verifiedStatus as VerifiedStatus] }}
                      >
                        {verifyStatusMap[detailData.taxInfo.verifiedStatus as VerifiedStatus]}
                      </span>
                    </p>
                    <p><strong className="text-gray-400">Địa chỉ:</strong> <span className="text-gray-600">{detailData.taxInfo.registeredAddress?.detail}</span></p>
                    <p className="text-red-500"><strong className="text-gray-400">Lý do từ chối:</strong> {detailData.taxInfo.rejectedReason || "--"}</p>
                  </div>
                </div>
              ) : <p className="text-center italic text-gray-400 py-4">-- Không có dữ liệu thuế --</p>}
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <span className="text-4xl mb-2">📭</span>
             <p className="font-medium">Không có dữ liệu shop</p>
          </div>
        )}
      </div>

      {/* PORTAL MODAL TỪ CHỐI PHÁP LÝ */}
      <PortalModal
        isOpen={rejectLegalModal.open}
        onClose={() => { setRejectLegalModal({ open: false }); setRejectReason(""); }}
        title="🚫 Từ chối thông tin định danh"
        width="max-w-md"
        footer={
          <div className="flex gap-2">
            <button 
              onClick={() => { setRejectLegalModal({ open: false }); setRejectReason(""); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button 
              disabled={!rejectReason.trim()}
              onClick={() => {
                if (!shopId || !rejectLegalModal.legalId) return;
                onRejectLegal(shopId, rejectLegalModal.legalId!, rejectReason);
                setRejectLegalModal({ open: false });
                setRejectReason("");
              }}
              className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md disabled:bg-gray-300"
            >
              Xác nhận từ chối
            </button>
          </div>
        }
      >
        <TextAreaField
          label="Lý do từ chối"
          name="reason"
          placeholder="Vui lòng nhập lý do cụ thể..."
          maxLength={500}
          rows={4}
          required
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </PortalModal>

      {/* PORTAL MODAL TỪ CHỐI THUẾ */}
      <PortalModal
        isOpen={rejectTaxModal.open}
        onClose={() => { setRejectTaxModal({ open: false }); setRejectReason(""); }}
        title="🚫 Từ chối thông tin thuế"
        width="max-w-md"
        footer={
          <div className="flex gap-2">
            <button 
              onClick={() => { setRejectTaxModal({ open: false }); setRejectReason(""); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button 
              disabled={!rejectReason.trim()}
              onClick={() => {
                if (!shopId || !rejectTaxModal.taxId) return;
                onRejectTax(shopId, rejectTaxModal.taxId!, rejectReason);
                setRejectTaxModal({ open: false });
                setRejectReason("");
              }}
              className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md disabled:bg-gray-300"
            >
              Xác nhận từ chối
            </button>
          </div>
        }
      >
        <TextAreaField
          label="Lý do từ chối"
          name="reason"
          placeholder="Vui lòng nhập lý do cụ thể..."
          maxLength={500}
          rows={4}
          required
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </PortalModal>
    </PortalModal>
  );
};

export default ShopDetailModal;