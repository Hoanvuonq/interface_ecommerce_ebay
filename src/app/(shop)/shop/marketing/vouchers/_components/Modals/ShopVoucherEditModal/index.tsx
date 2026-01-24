"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Tags,
  Info,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import {
  DiscountMethod,
  VoucherTemplate,
  CreateShopVoucherRequest,
} from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { useUpdateVoucher } from "../../../_hooks/useShopVoucher";
import { userProductService } from "@/services/products/product.service";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import { CustomButtonActions, FormInput, SelectComponent } from "@/components";

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

  // Chuyển đổi list sản phẩm sang định dạng Option cho SelectComponent
  const productOptions = useMemo(() => {
    return products.map((p) => ({
      label: `${p.name} (SKU: ${p.variants?.[0]?.sku || "N/A"})`,
      value: p.id,
    }));
  }, [products]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async () => {
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

  const footer = (
    <CustomButtonActions
      onCancel={onClose}
      onSubmit={handleFormSubmit}
      submitText="Cập nhật voucher"
      isLoading={submitting}
      hasChanges={true}
      className="w-48! rounded-2xl h-11 shadow-xl shadow-orange-500/20"
      containerClassName="border-t-0 bg-transparent py-6 px-8"
    />
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Tags size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight leading-none italic">
              Chỉnh sửa Voucher
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase  mt-1.5">
              Mã hệ thống: {voucher?.id}
            </p>
          </div>
        </div>
      }
      footer={footer}
      width="max-w-3xl"
      className="rounded-[3rem] p-0 overflow-hidden shadow-2xl"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white"
      >
        {/* Section: Basic Info */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase  ml-1">
            <Info size={14} strokeWidth={3} /> Thông tin chiến dịch
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Mã Voucher"
              name="code"
              required
              value={formData.code || ""}
              onChange={handleInputChange}
              placeholder="VD: GIAM20K"
              className="font-mono font-bold text-orange-600 uppercase italic"
            />
            <FormInput
              label="Tên hiển thị"
              name="name"
              required
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="VD: Tri ân khách hàng"
              className="font-bold"
            />
          </div>
          <FormInput
            isTextArea
            label="Mô tả chi tiết"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Ghi chú về điều kiện hoặc nội dung chương trình..."
            className="italic font-medium"
          />
        </section>

        {/* Section: Discount Config */}
        <section className="p-7 bg-orange-50/50 rounded-[2.5rem] border border-orange-100 space-y-6 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">
              <DollarSign size={14} strokeWidth={3} /> Cơ chế ưu đãi
            </div>
            <div className="flex p-1 bg-white/80 backdrop-blur rounded-xl border border-orange-100 shadow-sm">
              {[
                { id: DiscountMethod.FIXED_AMOUNT, label: "Số tiền" },
                { id: DiscountMethod.PERCENTAGE, label: "Phần trăm" },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData((p: any) => ({ ...p, discountMethod: method.id }))}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                    formData.discountMethod === method.id
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInput
              type="number"
              label="Giá trị giảm"
              name="discountValue"
              value={formData.discountValue || 0}
              onChange={handleInputChange}
              className="font-bold text-orange-600 text-lg tabular-nums italic border-0 shadow-md bg-white"
            />
            <FormInput
              type="number"
              label="Đơn tối thiểu"
              name="minOrderAmount"
              value={formData.minOrderAmount || 0}
              onChange={handleInputChange}
              className="font-bold tabular-nums border-0 shadow-md bg-white"
            />
            {formData.discountMethod === DiscountMethod.PERCENTAGE && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <FormInput
                  type="number"
                  label="Giảm tối đa"
                  name="maxDiscount"
                  value={formData.maxDiscount || 0}
                  onChange={handleInputChange}
                  className="font-bold tabular-nums border-0 shadow-md bg-white"
                />
              </div>
            )}
          </div>
        </section>

        {/* Section: Time & Limit */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase  ml-1">
              <Calendar size={14} strokeWidth={3} /> Thời gian áp dụng
            </div>
            <div className="space-y-3">
              <FormInput
                type="datetime-local"
                label="Ngày bắt đầu"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleInputChange}
                className="font-bold"
              />
              <FormInput
                type="datetime-local"
                label="Ngày kết thúc"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                className="font-bold"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase  ml-1">
              <Users size={14} strokeWidth={3} /> Quản lý phát hành
            </div>
            <FormInput
              type="number"
              label="Tổng lượt sử dụng tối đa"
              name="maxUsage"
              value={formData.maxUsage || 0}
              onChange={handleInputChange}
              className="font-bold tabular-nums shadow-sm italic"
              placeholder="VD: 100"
            />
          </div>
        </section>

        {/* Section: Scope */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase  ml-1">
            <CheckCircle2 size={14} strokeWidth={3} /> Đối tượng áp dụng
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200 w-full">
                {[
                  { id: true, label: "Tất cả sản phẩm" },
                  { id: false, label: "Sản phẩm chỉ định" },
                ].map((opt) => (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setFormData((p: any) => ({
                        ...p,
                        applyToAllProducts: opt.id,
                        productIds: opt.id ? [] : p.productIds,
                    }))}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all",
                      formData.applyToAllProducts === opt.id
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-500"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {!formData.applyToAllProducts && (
                <div className="animate-in slide-in-from-top-2 duration-300 space-y-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase ml-1">Chọn danh sách sản phẩm</p>
                  <SelectComponent
                    isMulti
                    placeholder="Tìm và chọn sản phẩm..."
                    options={productOptions}
                    value={formData.productIds}
                    disabled={loadingProducts}
                    onChange={(vals) => setFormData((p: any) => ({ ...p, productIds: vals }))}
                  />
                  {loadingProducts && (
                    <div className="flex items-center gap-2 text-[10px] text-orange-500 font-bold italic ml-2">
                      <Loader2 className="animate-spin" size={12} /> Đang tải danh sách...
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-4xl flex flex-col justify-center gap-3 shadow-inner">
               <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-widest italic leading-none">Hướng dẫn cập nhật</h4>
               <p className="text-[11px] font-semibold text-blue-800/70 leading-relaxed uppercase tracking-tighter">
                Việc chỉnh sửa các thông số giảm giá sẽ áp dụng ngay lập tức cho các khách hàng chưa sử dụng voucher. Hãy kiểm tra kỹ ngân sách trước khi lưu.
              </p>
            </div>
          </div>
        </section>
      </form>
    </PortalModal>
  );
}