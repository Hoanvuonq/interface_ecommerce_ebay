"use client";

import React, { useEffect, useState } from "react";
import { UploadFile } from "@/app/(main)/orders/_types/review";
import {
  VoucherScope,
  DiscountType,
  CreatePlatformTemplateRequest,
  CreatePlatformDirectRequest,
} from "../../_types/voucher-v2.type";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { toPublicUrl } from "@/utils/storage/url";
import { UploadContext } from "@/types/storage/storage.types";
import {
  Upload as UploadIcon,
  Loader2,
  Trash2,
  Info,
  Tag,
  Calendar,
  DollarSign,
  Layout,
  UserCircle,
  AlertTriangle,
} from "lucide-react";
import { FormInput, SelectComponent, CustomButtonActions } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface TemplateFormModalProps {
  open: boolean;
  mode: "paid" | "direct";
  onClose: () => void;
  onSubmit: (
    values: CreatePlatformTemplateRequest | CreatePlatformDirectRequest,
  ) => void;
  loading?: boolean;
}

export const TemplateFormModal = ({
  open,
  mode,
  onClose,
  onSubmit,
  loading = false,
}: TemplateFormModalProps) => {
  const { success: ToastSuccess, error: ToastError } = useToast();
  const { uploadFile: uploadPresigned, uploading: uploadingImage } =
    usePresignedUpload();

  // --- Logic State Giữ Nguyên ---
  const [formData, setFormData] = useState<any>({
    code: "",
    name: "",
    description: "",
    voucherScope: VoucherScope.SHOP_ORDER,
    discountType: DiscountType.FIXED_AMOUNT,
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    maxUsage: 1,
    startDate: "",
    endDate: "",
    validityDays: 30,
    price: 0,
    maxPurchasePerShop: 1,
    applyToAllShops: true,
    applyToAllProducts: true,
    applyToAllCustomers: true,
    imageAssetId: undefined,
  });

  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>();

  useEffect(() => {
    if (open) {
      setFormData({
        code: "",
        name: "",
        description: "",
        voucherScope: VoucherScope.SHOP_ORDER,
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        maxUsage: 1,
        startDate: "",
        endDate: "",
        validityDays: 30,
        price: 0,
        maxPurchasePerShop: 1,
        applyToAllShops: true,
        applyToAllProducts: true,
        applyToAllCustomers: true,
        imageAssetId: undefined,
      });
      setImageFileList([]);
      setPreviewImage(undefined);
    }
  }, [open, mode]);

  // --- Logic Upload Ảnh Giữ Nguyên ---
  const buildFinalUrlFromPath = (path?: string | null, file?: File) => {
    if (!path || !file) return undefined;
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const ext = extension === "jpeg" ? "jpg" : extension;
    const normalized = path.replace(/^pending\//, "public/");
    return toPublicUrl(`${normalized}_orig.${ext}`);
  };

  const handleImageRemove = () => {
    imageFileList.forEach((file) => {
      if (file.url && file.url.startsWith("blob:"))
        URL.revokeObjectURL(file.url);
    });
    setImageFileList([]);
    setPreviewImage(undefined);
    setFormData((prev: any) => ({ ...prev, imageAssetId: undefined }));
  };

  const processImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return ToastError("Chỉ chấp nhận file hình ảnh");
    if (file.size / 1024 / 1024 > 5)
      return ToastError("Hình ảnh phải nhỏ hơn 5MB");

    handleImageRemove();
    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);

    try {
      const res = await uploadPresigned(file, UploadContext.VOUCHER_IMAGE);
      if (!res.assetId) throw new Error("Upload thất bại - không có assetId");

      setFormData((prev: any) => ({ ...prev, imageAssetId: res.assetId }));
      let finalUrl =
        res.finalUrl ||
        (res.path ? buildFinalUrlFromPath(res.path, file) : localUrl);

      setImageFileList([
        {
          uid: res.assetId,
          name: file.name,
          status: "done",
          url: localUrl,
          thumbUrl: finalUrl,
        } as any,
      ]);
      ToastSuccess("Tải ảnh thành công");
    } catch (error: any) {
      ToastError(error?.message || "Tải ảnh thất bại");
      handleImageRemove();
    }
  };

  // --- Logic Submit Giữ Nguyên ---
  const handleSubmit = () => {
    if (
      !formData.code ||
      !formData.name ||
      !formData.startDate ||
      !formData.endDate
    ) {
      return ToastError("Vui lòng nhập đầy đủ các trường bắt buộc");
    }

    const payload: any = {
      ...formData,
      code: formData.code.toUpperCase(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      purchasable: mode === "paid",
    };

    // Loại bỏ các trường không thuộc mode tương ứng
    if (mode === "direct") {
      delete payload.price;
      delete payload.validityDays;
      delete payload.maxPurchasePerShop;
    }

    onSubmit(payload);
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      width="max-w-4xl"
      title={
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl text-white shadow-lg",
              mode === "paid"
                ? "bg-amber-500 shadow-amber-200"
                : "bg-blue-500 shadow-blue-200",
            )}
          >
            {mode === "paid" ? (
              <DollarSign size={20} strokeWidth={2.5} />
            ) : (
              <Tag size={20} strokeWidth={2.5} />
            )}
          </div>
          <span className="font-bold uppercase tracking-tight  text-gray-800">
            {mode === "paid"
              ? "Khởi tạo Voucher Template (PAID)"
              : "Khởi tạo Voucher Platform (DIRECT)"}
          </span>
        </div>
      }
      footer={
        <CustomButtonActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitText="Xác nhận khởi tạo"
          className={`w-44! rounded-2xl h-11 shadow-xl shadow-orange-500/20 ${mode === "paid" ? "bg-amber-500" : "bg-blue-500"}`}
          containerClassName="border-t-0 bg-transparent"
        />
      }
    >
      <div className="space-y-10 py-4">
        <div
          className={cn(
            "p-4 rounded-2xl border flex gap-3 items-start animate-in fade-in",
            mode === "paid"
              ? "bg-amber-50 border-amber-100 text-amber-700"
              : "bg-blue-50 border-blue-100 text-blue-700",
          )}
        >
          <Info size={18} className="mt-0.5 shrink-0" />
          <p className="text-[11px] font-bold leading-relaxed uppercase tracking-wider">
            {mode === "paid"
              ? "PAID Protocol: Shop sẽ chi trả phí để sở hữu và sử dụng template này cho các chiến dịch riêng."
              : "DIRECT Protocol: Voucher do sàn phát hành, có hiệu lực trực tiếp trên toàn bộ hệ thống."}
          </p>
        </div>

        {/* --- Section 1: Basic Info --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Layout size={16} className="text-orange-500" />
            <h3 className="text-[10px] font-bold uppercase   text-gray-400">
              Định danh Voucher
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Mã Voucher (Upper)"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: PROTOCOL2026"
            />
            <FormInput
              label="Tên hiển thị chiến dịch"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Voucher tri ân khách hàng thân thiết"
            />
          </div>

          <FormInput
            label="Mô tả nội dung"
            isTextArea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Chi tiết về điều kiện áp dụng..."
          />

          {/* Upload Image Logic Giữ Nguyên */}
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-gray-700 ml-1">
              Visual Asset (Ảnh Voucher)
            </label>
            <div className="flex items-center gap-6">
              <div className="relative size-32 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center group transition-all hover:border-orange-400">
                {previewImage ? (
                  <>
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      onClick={handleImageRemove}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <Trash2 size={24} />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2  text-gray-400 hover:text-orange-500 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <UploadIcon size={24} />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      Tải Asset
                    </span>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={processImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 text-[10px]  text-gray-400 italic space-y-1 uppercase tracking-tight font-bold">
                <p>• Tỷ lệ chuẩn: 1:1</p>
                <p>• Tối đa: 5MB (JPG/PNG)</p>
                <p>• AssetId sẽ được tự động đồng bộ sau khi upload</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Discount Config --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Tag size={16} className="text-orange-500" />
            <h3 className="text-[10px] font-bold uppercase   text-gray-400">
              Cấu hình ưu đãi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-700 ml-1">
                Scope
              </label>
              <SelectComponent
                options={[
                  { label: "🛒 Đơn hàng", value: VoucherScope.SHOP_ORDER },
                  { label: "🚚 Vận chuyển", value: VoucherScope.SHIPPING },
                  { label: "📦 Sản phẩm", value: VoucherScope.PRODUCT },
                ]}
                value={formData.voucherScope}
                onChange={(val) =>
                  setFormData({ ...formData, voucherScope: val })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-700 ml-1">
                Loại giảm giá
              </label>
              <SelectComponent
                options={[
                  { label: "💵 Số tiền", value: DiscountType.FIXED_AMOUNT },
                  { label: "📊 Phần trăm", value: DiscountType.PERCENTAGE },
                ]}
                value={formData.discountType}
                onChange={(val) =>
                  setFormData({ ...formData, discountType: val })
                }
              />
            </div>
            <FormInput
              label="Giá trị ưu đãi"
              type="number"
              required
              value={formData.discountValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountValue: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Đơn tối thiểu (VNĐ)"
              type="number"
              value={formData.minOrderAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minOrderAmount: Number(e.target.value),
                })
              }
            />
            {formData.discountType === DiscountType.PERCENTAGE && (
              <FormInput
                label="Giảm tối đa (VNĐ)"
                type="number"
                value={formData.maxDiscount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscount: Number(e.target.value),
                  })
                }
              />
            )}
          </div>
        </div>

        {/* --- Section 3: Time & Usage --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Calendar size={16} className="text-orange-500" />
            <h3 className="text-[10px] font-bold uppercase   text-gray-400">
              Thời gian & Số lượng
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Bắt đầu"
              type="datetime-local"
              required
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <FormInput
              label="Kết thúc"
              type="datetime-local"
              required
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <FormInput
              label="Tổng số lượng"
              type="number"
              required
              value={formData.maxUsage}
              onChange={(e) =>
                setFormData({ ...formData, maxUsage: Number(e.target.value) })
              }
            />
            {mode === "paid" && (
              <FormInput
                label="Hiệu lực (Ngày)"
                type="number"
                value={formData.validityDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validityDays: Number(e.target.value),
                  })
                }
              />
            )}
          </div>

          {mode === "paid" && (
            <div className="p-6 rounded-4xl bg-amber-50/30 border border-amber-100/50 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-inner">
              <FormInput
                label="Giá bán (VNĐ)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
              <FormInput
                label="Giới hạn mua/Shop"
                type="number"
                value={formData.maxPurchasePerShop}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPurchasePerShop: Number(e.target.value),
                  })
                }
              />
            </div>
          )}
        </div>

        {/* --- Section 4: Global Settings --- */}
        <div className="space-y-6 pb-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <UserCircle size={16} className="text-orange-500" />
            <h3 className="text-[10px] font-bold uppercase   text-gray-400">
              Phạm vi áp dụng
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "applyToAllShops",
              "applyToAllProducts",
              "applyToAllCustomers",
            ].map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:border-orange-200 group"
              >
                <span className="text-[10px] font-bold uppercase  text-gray-500 group-hover:text-gray-900 transition-colors">
                  {key === "applyToAllShops"
                    ? "Toàn bộ Shop"
                    : key === "applyToAllProducts"
                      ? "Toàn bộ SP"
                      : "Toàn bộ Khách"}
                </span>
                <button
                  onClick={() =>
                    setFormData({ ...formData, [key]: !formData[key] })
                  }
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-all",
                    formData[key] ? "bg-orange-500" : "bg-slate-200",
                  )}
                >
                  <div
                    className={cn(
                      "size-3.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm",
                      formData[key] ? "left-5.5" : "left-0.75",
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-[10px] font-bold  text-gray-500 leading-relaxed uppercase tracking-wider">
            Hệ thống sẽ kiểm tra tính hợp lệ của mã định danh trước khi khởi
            tạo. Sau khi hoàn tất, Protocol sẽ tự động đồng bộ Asset Id vào hệ
            thống lưu trữ tập trung.
          </p>
        </div>
      </div>
    </PortalModal>
  );
};
