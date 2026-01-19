/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { PortalModal } from "@/features/PortalModal"; //
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { getStoredUserDetail } from "@/utils/jwt";
import dayjs from "dayjs";
import {
  Clock as ClockIcon,
  Eye,
  EyeOff,
  FileText,
  History,
  Info,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { statusTagMap, StatusType } from "../../../_utils/status";
import { useUpdateShopTax } from "../../_hooks/useShop";
import { StepTaxInfo } from "../StepTaxInfo";

export const TaxInfo = ({
  shop,
  setShop,
}: {
  shop: any;
  setShop: any;
}) =>{
  const [showSensitive, setShowSensitive] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [formData, setFormData] = useState<any>({});

  const tax = shop?.taxInfo;
  const { handleUpdateShopTax, loading: updating } = useUpdateShopTax();
  const users = getStoredUserDetail();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleEdit = () => {
    setFormData({
     businessType: tax?.type?.toLowerCase(),
      country: tax?.registeredAddress?.countryName,
      province: tax?.registeredAddress?.provinceName,
      district: tax?.registeredAddress?.districtName,
      addressDetail: tax?.registeredAddress?.detail,
      email: tax?.email,
      taxId: tax?.taxIdentificationNumber,
    });
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
         type: formData.businessType,
        registeredAddress: {
          countryCode: formData.country,
          countryName: formData.country,
          provinceCode: formData.provinceCode || formData.province || "",
          provinceName: formData.provinceName || formData.province || "",
          provinceNameOld: formData.provinceName || formData.province || "",
          districtCode: "",
          districtName: "",
          wardCode: formData.wardCode || "",
          wardName: formData.wardName || "",
          wardNameOld: formData.wardName || "",
          detail: formData.addressDetail,
        },
        email: formData.email,
        taxIdentificationNumber: formData.taxId,
      };

      const res = await handleUpdateShopTax(users.shopId, tax.taxId, payload);
      if (res) {
        const shopRes = await getShopDetail(users.shopId);
        if (shopRes) setShop(shopRes.data);
        toastSuccess("Cập nhật thông tin thuế thành công!");
        setOpenModal(false);
      }
    } catch (err: any) {
      toastError(err?.message || "Cập nhật thất bại!");
    }
  };

  const status: StatusType = tax?.verifiedStatus || "PENDING";

  const typeNames: Record<string, string> = {
    PERSONAL: "Cá nhân",
    COMPANY: "Doanh nghiệp",
    HOUSEHOLD: "Hộ kinh doanh",
  };

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mt-6 transition-all">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Thông tin Thuế</h2>
                {statusTagMap[status]}
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-0.5">Xác thực pháp lý cửa hàng</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <History size={14} />
              {showHistory ? "Ẩn lịch sử" : "Lịch sử"}
            </button>
            <button 
              onClick={handleEdit}
              className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Info Alert Section */}
          <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-3xl flex items-start gap-4">
            <Info className="text-blue-500 shrink-0 mt-1" size={20} />
            <div className="text-[11px] font-medium text-blue-800 leading-relaxed uppercase tracking-tight">
              Người bán chỉ được cập nhật thông tin một lần cách nhau 30 ngày. 
              Mọi thông tin phải chính xác để phục vụ khấu trừ thuế và xuất hóa đơn.
            </div>
          </div>

          {showHistory && tax?.lastModifiedDate && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl w-fit text-[11px] font-bold text-gray-500 italic animate-in fade-in slide-in-from-top-2">
              <ClockIcon size={12} />
              Cập nhật cuối: {dayjs(tax.lastModifiedDate).format("DD/MM/YYYY HH:mm")}
            </div>
          )}

          {/* Data Display Section */}
          <div className="relative group">
            <button 
              onClick={() => setShowSensitive(!showSensitive)}
              className="absolute -top-10 right-0 flex items-center gap-2 text-[10px] font-bold uppercase text-orange-600 hover:text-orange-700 transition-colors"
            >
              {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
              {showSensitive ? "Ẩn thông tin" : "Xem thông tin bảo mật"}
            </button>

            <div className="grid grid-cols-1 gap-1 border border-gray-100 rounded-4xl overflow-hidden shadow-inner bg-gray-50/50">
              {[
                { label: "Loại hình kinh doanh", value: typeNames[tax?.type] || "Không xác định" },
                { 
                  label: "Địa chỉ đăng ký", 
                  value: showSensitive ? tax?.registeredAddress?.detail : "••••••••••••••••••••••••",
                  isMasked: !showSensitive 
                },
                { label: "Email nhận hóa đơn", value: tax?.email },
                { 
                  label: "Mã số thuế", 
                  value: showSensitive ? tax?.taxIdentificationNumber : "••••••••••••",
                  isMasked: !showSensitive
                },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[280px_1fr] bg-white p-5 group/row hover:bg-gray-50 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 self-center">{item.label}</span>
                  <span className={cn(
                    "text-sm font-bold text-gray-800",
                    item.isMasked && "tracking-[0.3em] text-gray-500"
                  )}>
                    {item.value || "Chưa cập nhật"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa sử dụng thẻ HTML thuần & Tailwind */}
      <PortalModal 
        isOpen={openModal} 
        onClose={() => !updating && setOpenModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
              <FileText size={18} />
            </div>
            <span className="font-bold text-gray-800 uppercase text-sm tracking-tight">Cập nhật Thông tin Thuế</span>
          </div>
        }
        width="max-w-3xl"
        className="rounded-[3rem]"
      >
        <form onSubmit={handleSave} className="space-y-8 py-2">
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-1">
             <StepTaxInfo formData={formData} setFormData={setFormData} />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              disabled={updating}
              onClick={() => setOpenModal(false)}
              className="px-8 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:text-gray-600 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-10 py-3 bg-orange-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {updating && <Loader2 size={14} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </PortalModal>
    </>
  );
}