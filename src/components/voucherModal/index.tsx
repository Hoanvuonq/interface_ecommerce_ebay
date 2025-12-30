"use client";

import { PortalModal } from "@/features/PortalModal"; // Import PortalModal
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { VoucherOption } from "@/services/voucher/voucher.service";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import {
  AlertCircle,
  Gift,
  Info,
  Loader2,
  Tag as TagIcon,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { GroupedVouchers, VoucherModalProps } from "../voucherComponents/type";
import { Button } from "../button/button";
import { ButtonField } from "../buttonField";
import { FaSave } from "react-icons/fa";
import { useToast } from "@/hooks/useToast";

export const VoucherModal: React.FC<VoucherModalProps> = ({
  open,
  onClose,
  onConfirm,
  onFetchVouchers,
  onApplyVoucherCode,
  appliedVouchers,
  appliedVoucher,
  title,
  shopName,
  isShopVoucher = false,
}) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [applyingCode, setApplyingCode] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherOption[]>([]);
  const [groupedVouchers, setGroupedVouchers] = useState<GroupedVouchers>({
    productOrderVouchers: [],
    shippingVouchers: [],
  });
  const [isGrouped, setIsGrouped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrderVoucherId, setSelectedOrderVoucherId] = useState<
    string | undefined
  >(appliedVouchers?.order?.id || appliedVoucher?.id);
  const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState<
    string | undefined
  >(appliedVouchers?.shipping?.id);
const { error, success } = useToast();
  useEffect(() => {
    if (open) {
      if (appliedVouchers) {
        setSelectedOrderVoucherId(
          appliedVouchers.order?.id || appliedVouchers.order?.code
        );
        setSelectedShippingVoucherId(
          appliedVouchers.shipping?.id || appliedVouchers.shipping?.code
        );
      } else if (appliedVoucher) {
        setSelectedOrderVoucherId(appliedVoucher.id || appliedVoucher.code);
        setSelectedShippingVoucherId(undefined);
      }
    }
  }, [open, appliedVouchers, appliedVoucher]);

  useEffect(() => {
    if (open && onFetchVouchers) {
      setLoading(true);
      onFetchVouchers()
        .then((result) => {
          if (Array.isArray(result)) {
            setVouchers(result);
            setIsGrouped(false);
          } else {
            setGroupedVouchers(result);
            setIsGrouped(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching vouchers:", error);
          error("Không thể tải danh sách voucher");
        })
        .finally(() => setLoading(false));
    }
  }, [open, onFetchVouchers]);

  const formatDiscount = (voucher: VoucherOption) => {
    if (voucher.discountType === "PERCENTAGE" && voucher.discountAmount) {
      return `Giảm ${voucher.discountAmount}%`;
    } else if (voucher.discountType === "FIXED" && voucher.discountAmount) {
      return `Giảm ${formatPriceFull(voucher.discountAmount)}`;
    }
    return "Giảm giá";
  };

  const handleApplyCode = async () => {
    if (!voucherCode.trim()) {
      toast.warning("Vui lòng nhập mã voucher");
      return;
    }
    if (!onApplyVoucherCode) return;
    setApplyingCode(true);
    try {
      const result = await onApplyVoucherCode(voucherCode.trim().toUpperCase());
      if (result.success && result.voucher) {
        toast.success(`Đã áp dụng voucher ${result.voucher.code} thành công!`);
        setVoucherCode("");
        if (onFetchVouchers) {
          const refreshed = await onFetchVouchers();
          setVouchers(Array.isArray(refreshed) ? refreshed : []);
        }
      } else {
        toast.error(result.error || "Không thể áp dụng voucher này");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setApplyingCode(false);
    }
  };

  const handleConfirm = () => {
    if (isGrouped) {
      const selected: { order?: VoucherOption; shipping?: VoucherOption } = {};
      if (selectedOrderVoucherId) {
        const voucher = groupedVouchers.productOrderVouchers.find(
          (v) =>
            v.id === selectedOrderVoucherId || v.code === selectedOrderVoucherId
        );
        if (voucher) selected.order = voucher;
      }
      if (selectedShippingVoucherId) {
        const voucher = groupedVouchers.shippingVouchers.find(
          (v) =>
            v.id === selectedShippingVoucherId ||
            v.code === selectedShippingVoucherId
        );
        if (voucher) selected.shipping = voucher;
      }
      onConfirm(selected.order || selected.shipping ? selected : undefined);
    } else {
      const selected = selectedOrderVoucherId
        ? vouchers.find(
            (v) =>
              v.id === selectedOrderVoucherId ||
              v.code === selectedOrderVoucherId
          )
        : undefined;
      onConfirm(selected ? { order: selected } : undefined);
    }
    onClose();
  };

  const resolveVoucherImageUrl = (voucher: VoucherOption) => {
    if (voucher.imageBasePath && voucher.imageExtension) {
      return toPublicUrl(
        `${voucher.imageBasePath}_thumb${voucher.imageExtension}`
      );
    }
    return null;
  };

  const renderVoucherCard = (
    voucher: VoucherOption,
    type?: "order" | "shipping"
  ) => {
    const canSelect = voucher.canSelect !== false;
    const remainingCount = voucher.remainingCount ?? voucher.maxUsage;
    const remainingPercentage =
      voucher.remainingPercentage ??
      (voucher.maxUsage && voucher.usedCount !== undefined
        ? Math.round(
            ((voucher.maxUsage - voucher.usedCount) / voucher.maxUsage) * 100
          )
        : undefined);
    const isOutOfStock = remainingCount !== undefined && remainingCount <= 0;
    const isLowStock =
      remainingPercentage !== undefined && remainingPercentage < 30;

    const isSelected = isGrouped
      ? type === "order"
        ? selectedOrderVoucherId === voucher.id ||
          selectedOrderVoucherId === voucher.code
        : selectedShippingVoucherId === voucher.id ||
          selectedShippingVoucherId === voucher.code
      : selectedOrderVoucherId === voucher.id ||
        selectedOrderVoucherId === voucher.code;

    const imageUrl = resolveVoucherImageUrl(voucher);
    const isShipping =
      type === "shipping" || voucher.code?.toLowerCase().includes("ship");

    const handleSelect = () => {
      if (!canSelect || isOutOfStock) return;
      const isSame = isSelected;
      if (isGrouped && type) {
        if (type === "order")
          setSelectedOrderVoucherId(isSame ? undefined : voucher.id);
        else setSelectedShippingVoucherId(isSame ? undefined : voucher.id);
      } else {
        setSelectedOrderVoucherId(isSame ? undefined : voucher.id);
      }
    };

    return (
      <div
        key={voucher.id}
        onClick={handleSelect}
        className={cn(
          "relative flex bg-white mb-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden",
          isSelected
            ? "border-orange-500 bg-orange-50/30"
            : "border-gray-100 hover:border-orange-200",
          (!canSelect || isOutOfStock) &&
            "opacity-60 grayscale bg-gray-50 cursor-not-allowed"
        )}
      >
        <div
          className={cn(
            "w-24 shrink-0 flex flex-col items-center justify-center p-3 text-white relative",
            isShipping ? "bg-cyan-500" : "bg-orange-500"
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm"
            />
          ) : isShipping ? (
            <Truck size={32} />
          ) : (
            <TagIcon size={32} />
          )}
          <span className="text-[10px] font-semibold mt-2 uppercase text-center leading-tight">
            {isShipping ? "Vận chuyển" : "Giảm giá"}
          </span>
          <div className="absolute top-0 bottom-0 -right-1 w-2 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white -mr-1" />
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 min-w-0 flex flex-col justify-between relative">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 text-sm truncate uppercase tracking-tighter">
                {voucher.code}
              </h4>
              <p className="text-orange-600 font-semibold text-sm mt-1">
                {formatDiscount(voucher)}
              </p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                isSelected
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              )}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          <div className="mt-2 space-y-2">
            <p className="text-[11px] text-gray-500 line-clamp-1">
              Đơn tối thiểu {formatPriceFull(voucher.minOrderValue || 0)}
            </p>

            {remainingPercentage !== undefined && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isLowStock ? "bg-red-500" : "bg-green-500"
                    )}
                    style={{ width: `${100 - remainingPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tight text-gray-400">
                  <span>Đã dùng {100 - remainingPercentage}%</span>
                  {isLowStock && (
                    <span className="text-red-500 italic">Sắp hết!</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              {!canSelect && voucher.reason ? (
                <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle size={10} /> {voucher.reason}
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-[10px] text-blue-500 font-bold hover:underline flex items-center gap-1"
                >
                  <Info size={10} /> Điều kiện
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const headerContent = (
    <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-tight">
      {title ||
        (isShopVoucher ? `${shopName || "Shop"} Voucher` : "Chọn voucher")}
    </h3>
  );

  const footerContent = (
    <>
      <Button variant="edit" onClick={onClose}>
        Trở Lại
      </Button>
      <ButtonField
        onClick={handleConfirm}
        htmlType="submit"
        type="login"
        className={cn(
          "flex w-40 items-center gap-2 px-5 py-2 rounded-lg text-sm",
          "font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0"
        )}
      >
        <span className="flex items-center gap-2">
          <FaSave /> Sử Dụng
        </span>
      </ButtonField>
    </>
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={headerContent}
      footer={footerContent}
      width="max-w-lg"
    >
      <div className="p-2 bg-gray-50/50 border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <TagIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
              placeholder="Nhập mã voucher tại đây..."
              className={cn(
                "transition-all uppercase font-bold tracking-wider",
                "w-full pl-10 pr-4 py-3 bg-white border text-black border-gray-200 rounded-2xl text-sm",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              )}
            />
          </div>
          <button
            onClick={handleApplyCode}
            disabled={applyingCode || !voucherCode}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center text-base cursor-pointer gap-2"
          >
            {applyingCode ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "ÁP DỤNG"
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-gray-50/30 max-h-[60vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="animate-spin text-orange-500" />
            <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">
              Đang tìm ưu đãi...
            </p>
          </div>
        ) : isGrouped ? (
          <div className="space-y-8">
            {groupedVouchers.productOrderVouchers.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4 px-1">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-tighter">
                      Mã Giảm Giá của Shop
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase italic">
                      Có thể chọn 1 Voucher
                    </p>
                  </div>
                </div>
                {groupedVouchers.productOrderVouchers.map((v) =>
                  renderVoucherCard(v, "order")
                )}
              </div>
            )}
            {groupedVouchers.shippingVouchers.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4 px-1">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-tighter">
                      Mã Miễn Phí Vận Chuyển
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase italic">
                      Có thể chọn 1 Voucher
                    </p>
                  </div>
                </div>
                {groupedVouchers.shippingVouchers.map((v) =>
                  renderVoucherCard(v, "shipping")
                )}
              </div>
            )}
          </div>
        ) : vouchers.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-widest mb-4 px-1">
              Ưu đãi từ cửa hàng
            </h4>
            {vouchers.map((v) => renderVoucherCard(v))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Gift size={64} className="text-orange-600 mb-4 animate-bounce" />
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
              Hiện không có voucher nào khả dụng
            </p>
          </div>
        )}
      </div>
    </PortalModal>
  );
};
