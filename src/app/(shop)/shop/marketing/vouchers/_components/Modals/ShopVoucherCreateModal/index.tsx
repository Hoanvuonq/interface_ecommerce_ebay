/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DiscountType } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { StatusTabs } from "@/app/(shop)/shop/_components";
import {
  Checkbox,
  CustomButtonActions,
  DateTimeInput,
  FormInput,
  SectionHeader,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import { userProductService } from "@/app/(shop)/shop/products/_services/product.service";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Check,
  Clock,
  DollarSign,
  FileText,
  Gift,
  Info,
  MousePointer2,
  Package,
  RefreshCw,
  Search,
  Tag,
  Zap,
  CheckCircle2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  discountTypeTabs,
  generateModeTabs,
  INITIAL_VOUCHER_FORM,
  scopeTabs,
} from "../../../_constants/voucher";
import { useCreateShopVoucher } from "../../../_hooks/useShopVoucher";

export default function ShopVoucherCreateModal({
  open,
  onClose,
  onSuccess,
}: any) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleCreateVoucher, loading: submitting } = useCreateShopVoucher();

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>(INITIAL_VOUCHER_FORM);
  const [products, setProducts] = useState<UserProductDTO[]>([]);
  const [codeGenerateMode, setCodeGenerateMode] = useState<"manual" | "auto">(
    "manual",
  );

  // 🟢 Load danh sách sản phẩm
  const fetchProducts = useCallback(async () => {
    try {
      const response = await userProductService.getAllProducts(0, 100);
      setProducts(response?.data?.content || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (open) fetchProducts();
  }, [open, fetchProducts]);

  // 🟢 Logic tạo mã tự động
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SHOP";
    for (let i = 0; i < 8; i++)
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData((p: any) => ({ ...p, code }));
  };

  useEffect(() => {
    if (codeGenerateMode === "auto" && open && !formData.code) generateCode();
  }, [codeGenerateMode, open]);

  // 🟢 Submit Form & Fix lỗi 3001
  const onFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name) return toastError("Tên voucher không được để trống");
    if (Number(formData.discountValue) <= 0)
      return toastError("Giá trị giảm phải lớn hơn 0");

    const payload = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      startDate: dayjs(formData.startDate).isBefore(dayjs())
        ? dayjs().add(2, "minute").toISOString()
        : dayjs(formData.startDate).toISOString(),
      endDate: dayjs(formData.endDate).toISOString(),
      discountValue: Number(formData.discountValue),
      minOrderAmount: Number(formData.minOrderAmount),
      maxDiscount: Number(formData.maxDiscount),
    };

    const res = await handleCreateVoucher(payload);
    if (res?.code === 1000 || res?.success) {
      toastSuccess("Tạo voucher thành công!");
      onSuccess();
      onClose();
    } else {
      toastError(res?.message || "Vui lòng kiểm tra lại các thông số");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-orange-400 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Gift size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide leading-none">
              Phát hành Voucher
            </h2>
            <p className="text-[11px] text-gray-500 font-bold uppercase  mt-1">
              Cấu hình ưu đãi cho Calatha Store
            </p>
          </div>
        </div>
      }
      footer={
        <CustomButtonActions
          onCancel={onClose}
          onSubmit={onFormSubmit}
          isDisabled={submitting}
          submitText="Xác nhận phát hành"
          submitIcon={Check}
          containerClassName="w-full flex gap-3 border-t-0"
          className="w-56! h-12 rounded-4xl shadow-xl shadow-orange-500/20"
        />
      }
      width="max-w-3xl"
      className="rounded-4xl overflow-hidden shadow-custom"
    >
      <form onSubmit={onFormSubmit} className="space-y-6">
        <div className="bg-linear-to-r from-blue-600 to-indigo-500 p-6 rounded-2xl flex items-start gap-5 shadow-lg shadow-blue-100 relative overflow-hidden">
          <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0 border border-white/30">
            <Info size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-blue-50 uppercase tracking-widest mb-1">
              Mẹo doanh thu
            </p>
            <p className="text-[12px] text-white/90 leading-relaxed font-medium">
              Voucher có mã ngắn gọn và thời gian áp dụng trong 7 ngày thường
              thu hút khách hàng chốt đơn nhanh hơn 40%.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <SectionHeader icon={FileText} title="01. Thông tin định danh" />
          <div className="bg-white p-4 rounded-3xl shadow-custom space-y-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                Chế độ tạo mã
              </label>
              <StatusTabs
                layoutId="genModeTab"
                tabs={generateModeTabs}
                current={codeGenerateMode}
                onChange={(key) => setCodeGenerateMode(key as any)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <FormInput
                  label="Mã Voucher"
                  required
                  value={formData.code}
                  readOnly={codeGenerateMode === "auto"}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  className=" h-12 rounded-2xl!"
                  placeholder="VD: SALE99"
                />
                {codeGenerateMode === "auto" && (
                  <button
                    type="button"
                    onClick={generateCode}
                    className="absolute right-4 top-9 p-2 text-orange-500 hover:rotate-180 transition-all duration-500 z-10"
                  >
                    <RefreshCw size={20} />
                  </button>
                )}
              </div>
              <FormInput
                label="Tên chương trình"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((p: any) => ({ ...p, name: e.target.value }))
                }
                placeholder="VD: Siêu sale mừng năm mới"
                className="h-12 rounded-2xl!"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader icon={DollarSign} title="02. Cấu hình chiết khấu" />
          <div className="bg-white p-4 rounded-3xl shadow-custom space-y-4">
            <div className="flex gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Loại ưu đãi
                </label>
                <StatusTabs
                  layoutId="discountTypeTab"
                  tabs={discountTypeTabs}
                  current={formData.discountType}
                  onChange={(key) =>
                    setFormData((p: any) => ({ ...p, discountType: key }))
                  }
                />
              </div>
              <FormInput
                label={`Giá trị giảm (${formData.discountType === DiscountType.FIXED_AMOUNT ? "VNĐ" : "%"})`}
                type="number"
                required
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    discountValue: e.target.value,
                  }))
                }
                className="text-orange-600 text-2xl font-bold h-12 rounded-2xl! border-orange-100 bg-orange-50/20"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 border-t border-gray-50">
              <FormInput
                label="Đơn tối thiểu (VNĐ)"
                type="number"
                required
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    minOrderAmount: e.target.value,
                  }))
                }
                placeholder="0"
              />
              {formData.discountType === DiscountType.PERCENTAGE && (
                <FormInput
                  label="Giảm tối đa (VNĐ)"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      maxDiscount: e.target.value,
                    }))
                  }
                  placeholder="Không giới hạn"
                />
              )}
            </div>
          </div>
        </section>

        {/* Section 03: Thời gian */}
        <section className="space-y-4">
          <SectionHeader icon={Clock} title="03. Hiệu lực & Giới hạn" />
          <div className="bg-white p-4 rounded-3xl shadow-custom space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DateTimeInput
                label="Bắt đầu từ"
                required
                value={formData.startDate}
                onChange={(value: string) =>
                  setFormData((p: any) => ({
                    ...p,
                    startDate: value,
                  }))
                }
              />
              <DateTimeInput
                label="Kết thúc vào"
                required
                value={formData.endDate}
                onChange={(value: string) =>
                  setFormData((p: any) => ({
                    ...p,
                    endDate: value,
                  }))
                }
              />
             
              <FormInput
                label="Tổng số lượng voucher phát hành"
                type="number"
                required
                value={formData.maxUsage}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    maxUsage: e.target.value,
                  }))
                }
                className="max-w-50"
              />
            </div>
          </div>
        </section>

        <section className="pb-10 space-y-4">
          <SectionHeader icon={MousePointer2} title="04. Phạm vi áp dụng" />
          <div className="bg-white p-4 rounded-3xl shadow-custom space-y-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                Sản phẩm áp dụng
              </label>
              <StatusTabs
                layoutId="prodScopeTab"
                tabs={scopeTabs}
                current={formData.applyToAllProducts ? "all" : "selective"}
                onChange={(key) =>
                  setFormData((p: any) => ({
                    ...p,
                    applyToAllProducts: key === "all",
                  }))
                }
              />
            </div>

            {!formData.applyToAllProducts && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-between bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <div className="relative w-full sm:w-72 group">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10"
                    />
                    <input
                      type="text"
                      placeholder="Tìm tên sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-2xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <Checkbox
                    label="Chọn tất cả danh sách"
                    checked={
                      formData.productIds.length === products.length &&
                      products.length > 0
                    }
                    onChange={(e: any) =>
                      setFormData((p: any) => ({
                        ...p,
                        productIds: e.target.checked
                          ? products.map((i) => i.id)
                          : [],
                      }))
                    }
                  />
                </div>

                {/* Grid danh sách sản phẩm */}
                <div className="max-h-80 overflow-y-auto p-4 bg-white rounded-4xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 custom-scrollbar shadow-inner">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() =>
                          setFormData((prev: any) => {
                            const exists = prev.productIds.includes(p.id);
                            return {
                              ...prev,
                              productIds: exists
                                ? prev.productIds.filter(
                                    (id: any) => id !== p.id,
                                  )
                                : [...prev.productIds, p.id],
                            };
                          })
                        }
                        className={cn(
                          "flex items-center p-4 rounded-2xl border transition-all cursor-pointer group/item",
                          formData.productIds.includes(p.id)
                            ? "bg-orange-50 border-orange-200 ring-1 ring-orange-200"
                            : "bg-white border-gray-100 hover:border-orange-200 hover:bg-gray-50",
                        )}
                      >
                        <Checkbox
                          checked={formData.productIds.includes(p.id)}
                          onChange={() => {}}
                          containerClassName="pointer-events-none"
                        />
                        <div className="ml-3 min-w-0">
                          <p className="text-[12px] font-bold text-gray-800 truncate group-hover/item:text-orange-600 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            SKU: {p.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-300">
                      <Package
                        size={48}
                        strokeWidth={1}
                        className="mb-3 opacity-20"
                      />
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
                        Không tìm thấy dữ liệu
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    CanoX Inventory: {products.length}
                  </span>
                  <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-orange-200 animate-pulse">
                    <Check size={14} strokeWidth={4} />
                    <span className="text-[10px] font-bold uppercase">
                      Đã chọn {formData.productIds.length} món
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </form>
    </PortalModal>
  );
}
