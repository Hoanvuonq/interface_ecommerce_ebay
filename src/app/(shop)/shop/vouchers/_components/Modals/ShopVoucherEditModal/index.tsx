"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  X, 
  Save, 
  Info, 
  Tags, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  ChevronDown,
  Loader2,
  AlertTriangle
} from "lucide-react";
import dayjs from "dayjs";
import { 
  DiscountMethod, 
  VoucherTemplate,
  CreateShopVoucherRequest 
} from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { useUpdateVoucher } from "../../../_hooks/useShopVoucher";
import { userProductService } from "@/services/products/product.service";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";

interface ShopVoucherEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  voucher: VoucherTemplate | null;
}

export default function ShopVoucherEditModal({
  open,
  onClose,
  onSuccess,
  voucher,
}: ShopVoucherEditModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleUpdate, loading: submitting } = useUpdateVoucher();

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [products, setProducts] = useState<UserProductDTO[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Sync voucher data to local state when opened
  useEffect(() => {
    if (voucher && open) {
      setFormData({
        ...voucher,
        startDate: dayjs(voucher.startDate).format("YYYY-MM-DDTHH:mm"),
        endDate: dayjs(voucher.endDate).format("YYYY-MM-DDTHH:mm"),
        productIds: voucher.productIds || [],
      });
      fetchProducts();
    }
  }, [voucher, open]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await userProductService.getAllProducts(0, 1000);
      setProducts(response?.data?.content || []);
    } catch (err) {
      toastError("Không thể tải danh sách sản phẩm");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucher) return;

    const payload: CreateShopVoucherRequest = {
      ...formData,
      code: formData.code.toUpperCase(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    const res = await handleUpdate(voucher.id, payload);
    if (res?.code === 1000) {
      toastSuccess("Cập nhật voucher thành công!");
      onSuccess();
    } else {
      toastError(res?.message || "Cập nhật thất bại");
    }
  };

  return (
    <PortalModal 
      isOpen={open} 
      onClose={onClose} 
      width="max-w-3xl"
      className="rounded-[2.5rem] p-0 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Tags size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Chỉnh sửa Voucher</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
        
        {/* Section: Basic Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            <Info size={14} /> Thông tin cơ bản
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Mã Voucher</label>
              <input
                name="code"
                value={formData.code || ""}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 outline-none transition-all font-mono font-bold uppercase"
                placeholder="VD: GIAM20K"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Tên hiển thị</label>
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 outline-none transition-all font-bold"
                placeholder="VD: Tri ân khách hàng"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 outline-none transition-all text-sm font-medium"
            />
          </div>
        </section>

        {/* Section: Discount Config */}
        <section className="p-6 bg-orange-50/30 rounded-[2rem] border border-gray-100/50 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase tracking-widest">
            <DollarSign size={14} /> Cấu hình giảm giá
          </div>
          
          <div className="flex p-1 bg-white rounded-2xl border border-gray-100 w-fit">
            {[
              { id: DiscountMethod.FIXED_AMOUNT, label: "Số tiền cố định" },
              { id: DiscountMethod.PERCENTAGE, label: "Phần trăm (%)" }
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setFormData((p:any) => ({...p, discountMethod: method.id}))}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                  formData.discountMethod === method.id 
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {method.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Mức giảm</label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue || 0}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 outline-none transition-all font-bold text-orange-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Đơn tối thiểu</label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount || 0}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 outline-none transition-all font-bold"
              />
            </div>
            {formData.discountMethod === DiscountMethod.PERCENTAGE && (
              <div className="space-y-1.5 animate-in fade-in zoom-in-95">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Giảm tối đa</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount || 0}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl border border-white bg-white shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 outline-none transition-all font-bold"
                />
              </div>
            )}
          </div>
        </section>

        {/* Section: Time & Limit */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              <Calendar size={14} /> Thời gian hiệu lực
            </div>
            <div className="space-y-3">
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white outline-none transition-all text-sm font-bold"
              />
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              <Users size={14} /> Giới hạn lượt dùng
            </div>
            <input
              type="number"
              name="maxUsage"
              value={formData.maxUsage || 0}
              onChange={handleInputChange}
              className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white outline-none transition-all text-sm font-bold text-gray-700"
              placeholder="VD: 100"
            />
          </div>
        </section>

        {/* Section: Scope */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            <CheckCircle2 size={14} /> Phạm vi áp dụng
          </div>
          
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 mb-4">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
              Bạn có thể giới hạn voucher này cho một số sản phẩm hoặc nhóm khách hàng nhất định.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase ml-1">Sản phẩm áp dụng</p>
              <div className="flex gap-2">
                {[
                  { id: true, label: "Tất cả sản phẩm" },
                  { id: false, label: "Chọn sản phẩm cụ thể" }
                ].map((opt) => (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setFormData((p:any) => ({...p, applyToAllProducts: opt.id}))}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                      formData.applyToAllProducts === opt.id 
                        ? "bg-white border-gray-500 text-orange-600 shadow-sm ring-1 ring-orange-500" 
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {!formData.applyToAllProducts && (
               <div className="animate-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <select 
                      multiple
                      className="w-full px-5 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 focus:bg-white outline-none transition-all text-sm font-bold appearance-none custom-scrollbar min-h-[120px]"
                      value={formData.productIds}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData((p:any) => ({...p, productIds: options}));
                      }}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id} className="py-2 px-4 rounded-xl mb-1 checked:bg-orange-500 checked:text-white">
                          {p.name} (SKU: {p.variants?.[0]?.sku})
                        </option>
                      ))}
                    </select>
                    {loadingProducts && <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-[1.5rem]"><Loader2 className="animate-spin text-orange-500" /></div>}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 ml-2 italic">Giữ phím Ctrl (hoặc Cmd) để chọn nhiều sản phẩm</p>
               </div>
            )}
          </div>
        </section>
      </form>

      {/* Footer Actions */}
      <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleFormSubmit}
          disabled={submitting}
          className="px-8 py-3 rounded-2xl bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-orange-600 shadow-lg shadow-gray-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Lưu thay đổi
        </button>
      </div>
    </PortalModal>
  );
}