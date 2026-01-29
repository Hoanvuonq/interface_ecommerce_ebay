"use client";

import { ButtonField, DataTable } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { formatCurrency, formatDateTime } from "@/hooks/format";
import { cn } from "@/utils/cn";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Layers,
  Loader2,
  Tag,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetVoucherInfo } from "../../../_hooks/useShopVoucher";
import { voucherInstanceColumns } from "./colum";

interface ShopVoucherDetailModalProps {
  open: boolean;
  templateId: string;
  onClose: () => void;
}

export default function ShopVoucherDetailModal({
  open,
  templateId,
  onClose,
}: ShopVoucherDetailModalProps) {
  const [voucherInfo, setVoucherInfo] = useState<any | null>(null);
  const { fetchVoucherInfo, loading } = useGetVoucherInfo();

  useEffect(() => {
    if (open && templateId) {
      fetchVoucherInfo(templateId).then((res) => {
        if (res?.code === 1000 && res.data) {
          setVoucherInfo(res.data);
        }
      });
    }
  }, [open, templateId]);

  const isActuallyUsable = voucherInfo?.usable && voucherInfo?.template?.active;

  const getReasonMessage = (reason: string) => {
    switch (reason) {
      case "NOT_AVAILABLE":
        return "Voucher hiện không khả dụng trong hệ thống.";
      case "EXPIRED":
        return "Voucher đã hết hạn sử dụng.";
      case "OUT_OF_STOCK":
        return "Voucher đã hết lượt sử dụng.";
      default:
        return "Voucher này đang tạm ngưng hoạt động.";
    }
  };

  if (!open) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      width="max-w-5xl"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
              <Tag size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight leading-none">
                Chi tiết Voucher
              </h2>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                ID: {templateId}
              </p>
            </div>
          </div>
        </div>
      }
      footer={
        <ButtonField
          htmlType="submit"
          type="login"
          onClick={onClose}
          className="w-40 h-12 text-[13px] font-bold"
        >
          Xác nhận đóng
        </ButtonField>
      }
    >
      <div className="p-4 space-y-4">
        {loading || !voucherInfo ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              Đang truy xuất dữ liệu...
            </span>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "p-5 rounded-4xl border flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500",
                isActuallyUsable
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-red-50 border-red-100 text-red-800",
              )}
            >
              {isActuallyUsable ? (
                <CheckCircle2 className="shrink-0" />
              ) : (
                <AlertCircle className="shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">
                  {isActuallyUsable
                    ? "Voucher đang hoạt động"
                    : "Voucher ngưng hoạt động"}
                </p>
                <p className="text-xs font-medium opacity-80 mt-0.5">
                  {isActuallyUsable
                    ? "Voucher này đang khả dụng và có thể áp dụng cho các đơn hàng thỏa điều kiện."
                    : getReasonMessage(voucherInfo.reason)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="bg-white rounded-4xl border border-gray-100 p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                    <Info size={14} strokeWidth={3} /> Thông tin chiến dịch
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-4 py-1.5 bg-gray-900 text-orange-400 rounded-xl font-mono font-bold text-xl tracking-tighter shadow-inner">
                        {voucherInfo.template.code}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-800 leading-tight italic">
                        {voucherInfo.template.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                      {voucherInfo.template.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                      <Layers size={14} strokeWidth={3} /> Danh sách thực thể
                      (Instances)
                    </div>
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase italic">
                      {voucherInfo.instances?.length || 0} mục
                    </span>
                  </div>

                  {voucherInfo.instances?.length > 0 ? (
                    <DataTable
                      data={voucherInfo.instances}
                      columns={voucherInstanceColumns}
                      loading={false}
                      page={0}
                      size={10}
                      totalElements={voucherInfo.instances.length}
                      onPageChange={() => {}}
                    />
                  ) : (
                    <div className="py-12 bg-gray-50/50 rounded-4xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
                      <Layers className="text-gray-300" size={32} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                        Không có instance cụ thể (Voucher dùng chung)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 rounded-4xl p-8 text-white shadow-2xl shadow-gray-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <DollarSign size={80} />
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <DollarSign size={12} strokeWidth={3} /> Giá trị ưu đãi
                      </p>
                      <div className="flex flex-col gap-1">
                        <span className="text-4xl font-bold text-orange-400 tracking-tighter italic">
                          {voucherInfo.template.discountType === "FIXED_AMOUNT"
                            ? formatCurrency(voucherInfo.template.discountValue)
                            : `${Math.round(voucherInfo.template.discountValue)}%`}
                        </span>
                        {voucherInfo.template.maxDiscount > 0 && (
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic">
                            Tối đa{" "}
                            {formatCurrency(voucherInfo.template.maxDiscount)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="grid grid-cols-1 gap-5">
                      <InfoItem
                        icon={<Target size={14} />}
                        label="Đơn tối thiểu"
                        value={formatCurrency(
                          voucherInfo.template.minOrderAmount,
                        )}
                      />
                      <InfoItem
                        icon={<Trophy size={14} />}
                        label="Giới hạn dùng"
                        value={`${voucherInfo.template.maxUsage} lượt`}
                      />
                      <InfoItem
                        icon={<Calendar size={14} />}
                        label="Ngày bắt đầu"
                        value={formatDateTime(voucherInfo.template.startDate)}
                      />
                      <InfoItem
                        icon={<Clock size={14} />}
                        label="Ngày kết thúc"
                        value={formatDateTime(voucherInfo.template.endDate)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50/50 rounded-4xl border border-orange-100 p-8 space-y-5 shadow-sm">
                  <div className="text-[10px] font-bold text-orange-600 uppercase  flex items-center gap-2">
                    <CheckCircle2 size={14} strokeWidth={3} /> Phạm vi áp dụng
                  </div>
                  <div className="space-y-3">
                    <ScopeTag
                      label="Cửa hàng"
                      active={voucherInfo.template.applyToAllShops}
                    />
                    <ScopeTag
                      label="Sản phẩm"
                      active={voucherInfo.template.applyToAllProducts}
                    />
                    <ScopeTag
                      label="Khách hàng"
                      active={voucherInfo.template.applyToAllCustomers}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PortalModal>
  );
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5 italic">
      {icon} {label}
    </span>
    <span className="text-xs font-bold text-white/90">{value}</span>
  </div>
);

const ScopeTag = ({ label, active }: { label: string; active: boolean }) => (
  <div className="flex items-center justify-between px-5 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-orange-200">
    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
      {label}
    </span>
    <span
      className={cn(
        "text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg italic",
        active
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600",
      )}
    >
      {active ? "Tất cả" : "Giới hạn"}
    </span>
  </div>
);
