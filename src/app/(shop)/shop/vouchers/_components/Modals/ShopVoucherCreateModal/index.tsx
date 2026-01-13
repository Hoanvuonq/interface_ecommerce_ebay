/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CreateShopVoucherRequest,
  DiscountType,
  VoucherScope,
} from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { ButtonField, FormInput } from "@/components";
import { Button } from "@/components/button/button";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import { userProductService } from "@/services/products/product.service";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Calendar, Check, DollarSign, FileText, Gift, Info,
  Loader2, RefreshCw, Users, Package, Clock, MousePointer2
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useCreateShopVoucher } from "../../../_hooks/useShopVoucher";

export default function ShopVoucherCreateModal({ open, onClose, onSuccess }: any) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleCreateVoucher, loading: submitting } = useCreateShopVoucher();

  const [formData, setFormData] = useState<any>({
    voucherScope: VoucherScope.SHOP_ORDER,
    discountType: DiscountType.FIXED_AMOUNT,
    maxUsage: 100,
    applyToAllProducts: true,
    applyToAllCustomers: true,
    code: "",
    name: "",
    description: "",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    startDate: dayjs().format("YYYY-MM-DDTHH:mm"),
    endDate: dayjs().add(7, "day").format("YYYY-MM-DDTHH:mm"),
    productIds: [],
  });

  const [products, setProducts] = useState<UserProductDTO[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [codeGenerateMode, setCodeGenerateMode] = useState<"manual" | "auto">("manual");

  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const response = await userProductService.getAllProducts(0, 100);
      setProducts(response?.data?.content || []);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { if (open) fetchProducts(); }, [open, fetchProducts]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SHOP";
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData((p: any) => ({ ...p, code }));
  };

  useEffect(() => {
    if (codeGenerateMode === "auto" && open && !formData.code) generateCode();
  }, [codeGenerateMode, open]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateShopVoucherRequest = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    const res = await handleCreateVoucher(payload);
    if (res?.code === 1000) {
      toastSuccess("Tạo voucher thành công!");
      onSuccess();
      onClose();
    } else {
      toastError(res?.message || "Lỗi tham số dữ liệu");
    }
  };

  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
        <Gift size={22} />
      </div>
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Cấu hình Voucher</h2>
    </div>
  );

  const footerContent = (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button variant="edit" onClick={onClose} className="h-11! px-10 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em]">
        Hủy
      </Button>
      <ButtonField
        type="login"
        onClick={onFormSubmit}
        disabled={submitting}
        className="flex w-64 h-11! items-center justify-center gap-2 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 border-0"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
        Phát hành Voucher
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={headerContent}
      footer={footerContent}
      width="max-w-2xl"
      className="rounded-[3rem] p-0 overflow-hidden"
    >
      <div className="bg-[#fcfcfc]">
        <form onSubmit={onFormSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-3xl flex items-start gap-4">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
              Lưu ý: Voucher sau khi phát hành sẽ được công khai. Hãy kiểm tra kỹ các thông số giảm giá và thời gian áp dụng.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">
              <FileText size={14} /> 01. Thông tin định danh
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Chế độ tạo mã</label>
                <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                  {["manual", "auto"].map((mode) => (
                    <button key={mode} type="button" onClick={() => setCodeGenerateMode(mode as any)}
                      className={cn("px-8 py-2.5 text-[10px] font-bold uppercase rounded-xl transition-all",
                        codeGenerateMode === mode ? "bg-gray-900 text-white shadow-lg" : "text-gray-400")}>
                      {mode === "manual" ? "Nhập tay" : "Tự động"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <FormInput label="Mã Voucher" required value={formData.code} readOnly={codeGenerateMode === "auto"}
                    onChange={(e) => setFormData((p: any) => ({ ...p, code: e.target.value }))}
                    className="font-mono uppercase h-12! rounded-2xl!" placeholder="VD: SALE2026" />
                  {codeGenerateMode === "auto" && (
                    <button type="button" onClick={generateCode} className="absolute right-3 top-9 p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all z-10"><RefreshCw size={18} /></button>
                  )}
                </div>
                <FormInput label="Tên chương trình" required value={formData.name}
                  onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))} placeholder="VD: Tri ân khách hàng" />
              </div>

              <FormInput label="Mô tả (không bắt buộc)" isTextArea value={formData.description}
                onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))} placeholder="Ghi chú về voucher này..." />
            </div>
          </div>

          {/* Section 02: Cấu hình ưu đãi */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">
              <DollarSign size={14} /> 02. Cấu hình mức giảm
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-gray-500 uppercase ml-1">Loại ưu đãi</p>
                  <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    {[ { id: DiscountType.FIXED_AMOUNT, label: "Số tiền" }, { id: DiscountType.PERCENTAGE, label: "Phần trăm" } ].map((t) => (
                      <button key={t.id} type="button" onClick={() => setFormData((p: any) => ({ ...p, discountType: t.id }))}
                        className={cn("flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all",
                          formData.discountType === t.id ? "bg-orange-500 text-white shadow-md" : "text-gray-400")}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <FormInput label={`Giá trị giảm (${formData.discountType === DiscountType.FIXED_AMOUNT ? 'VNĐ' : '%'})`} 
                  type="number" required value={formData.discountValue}
                  onChange={(e) => setFormData((p: any) => ({ ...p, discountValue: Number(e.target.value) }))}
                  className="text-orange-600 font-bold h-12!" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Đơn tối thiểu áp dụng" type="number" required value={formData.minOrderAmount}
                  onChange={(e) => setFormData((p: any) => ({ ...p, minOrderAmount: Number(e.target.value) }))} />
                
                {formData.discountType === DiscountType.PERCENTAGE && (
                  <FormInput label="Số tiền giảm tối đa" type="number" value={formData.maxDiscount}
                    onChange={(e) => setFormData((p: any) => ({ ...p, maxDiscount: Number(e.target.value) }))} />
                )}
              </div>
            </div>
          </div>

          {/* Section 03: Điều kiện & Thời gian */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">
              <Clock size={14} /> 03. Thời gian & Giới hạn
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Thời điểm bắt đầu" type="datetime-local" required value={formData.startDate}
                  onChange={(e) => setFormData((p: any) => ({ ...p, startDate: e.target.value }))} />
                <FormInput label="Thời điểm kết thúc" type="datetime-local" required value={formData.endDate}
                  onChange={(e) => setFormData((p: any) => ({ ...p, endDate: e.target.value }))} />
              </div>
              <FormInput label="Tổng số lượng voucher phát hành" type="number" required value={formData.maxUsage}
                onChange={(e) => setFormData((p: any) => ({ ...p, maxUsage: Number(e.target.value) }))} />
            </div>
          </div>

          {/* Section 04: Phạm vi */}
          <div className="space-y-6 pb-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">
              <MousePointer2 size={14} /> 04. Đối tượng áp dụng
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase ml-1">Áp dụng sản phẩm</p>
                <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  {[ { id: true, label: "Tất cả sản phẩm" }, { id: false, label: "Sản phẩm chọn lọc" } ].map((opt) => (
                    <button key={String(opt.id)} type="button" onClick={() => setFormData((p: any) => ({ ...p, applyToAllProducts: opt.id }))}
                      className={cn("flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all",
                        formData.applyToAllProducts === opt.id ? "bg-gray-900 text-white shadow-md" : "text-gray-400")}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {!formData.applyToAllProducts && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <select multiple className="w-full px-5 py-4 rounded-3xl border border-gray-200 bg-gray-50/50 text-[10px] font-bold uppercase outline-none h-40 custom-scrollbar appearance-none focus:bg-white transition-all"
                    onChange={(e) => setFormData((p: any) => ({ ...p, productIds: Array.from(e.target.selectedOptions, (o) => o.value) }))}>
                    {products?.filter(p => p).map((p) => (<option key={p.id} value={p.id} className="py-3 px-5 rounded-xl mb-1 checked:bg-orange-500 checked:text-white">{p.name}</option>))}
                  </select>
                  <p className="text-[9px] text-gray-400 font-bold mt-3 ml-2 flex items-center gap-2 italic uppercase">
                    <Info size={12}/> Giữ Ctrl/Cmd để chọn nhiều sản phẩm
                  </p>
                </div>
              )}
            </div>
          </div>

        </form>
      </div>
    </PortalModal>
  );
}