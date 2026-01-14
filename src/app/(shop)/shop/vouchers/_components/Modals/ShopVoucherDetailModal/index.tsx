"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  X, 
  Tag as TagIcon, 
  DollarSign, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Info,
  Layers,
  Target,
  Loader2
} from "lucide-react";
import { VoucherInfo, VoucherInstance } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { useGetVoucherInfo } from "../../../_hooks/useShopVoucher";
import { formatCurrency, formatDateTime } from "@/hooks/format";
import { DataTable } from "@/components"; // Sử dụng DataTable tùy chỉnh của bạn
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";

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
  const [voucherInfo, setVoucherInfo] = useState<VoucherInfo | null>(null);
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

  // Định nghĩa các cột cho DataTable của bạn
  const columns = useMemo(() => [
    {
      header: "Loại sở hữu",
      render: (item: VoucherInstance) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
          item.ownerType === "SHOP" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700"
        )}>
          {item.ownerType === "SHOP" ? "Shop" : "Platform"}
        </span>
      ),
    },
    {
      header: "Số lượng",
      align: "center" as const,
      render: (item: VoucherInstance) => (
        <span className="font-bold text-blue-600">{item.totalQuantity.toLocaleString()}</span>
      ),
    },
    {
      header: "Đã dùng",
      align: "center" as const,
      render: (item: VoucherInstance) => (
        <span className="font-bold text-orange-500">{item.usedQuantity.toLocaleString()}</span>
      ),
    },
    {
      header: "Còn lại",
      align: "center" as const,
      render: (item: VoucherInstance) => {
        const remaining = item.totalQuantity - item.usedQuantity;
        return <span className="font-bold text-emerald-500">{remaining.toLocaleString()}</span>;
      },
    },
    {
      header: "Hạn dùng",
      render: (item: VoucherInstance) => (
        <span className="text-xs font-medium text-gray-500">{formatDateTime(item.expiryDate)}</span>
      ),
    },
    {
      header: "Trạng thái",
      render: (item: VoucherInstance) => {
        const statusConfig: any = {
          ACTIVE: { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700" },
          EXPIRED: { label: "Hết hạn", color: "bg-gray-100 text-gray-500" },
          EXHAUSTED: { label: "Hết lượt", color: "bg-amber-100 text-amber-700" },
        };
        const config = statusConfig[item.status] || statusConfig.ACTIVE;
        return (
          <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase", config.color)}>
            {config.label}
          </span>
        );
      },
    },
  ], []);

  if (!open) return null;

  return (
    <PortalModal 
      isOpen={open} 
      onClose={onClose} 
      width="max-w-5xl"
      className="rounded-[3rem] p-0 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Layers size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Chi tiết Voucher</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={20} />
        </button>
      </div>

      <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar space-y-8">
        {loading || !voucherInfo ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {/* Status Alert */}
            <div className={cn(
              "p-4 rounded-3xl border flex items-start gap-4 animate-in fade-in slide-in-from-top-2",
              voucherInfo.isUsable ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
            )}>
              {voucherInfo.isUsable ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">
                  {voucherInfo.isUsable ? "Voucher khả dụng" : "Voucher tạm ngưng"}
                </p>
                <p className="text-xs font-medium opacity-80">
                  {voucherInfo.reason || (voucherInfo.isUsable ? "Voucher này đang hoạt động và có thể sử dụng bình thường." : "Hiện tại không thể áp dụng voucher này.")}
                </p>
              </div>
            </div>

            {/* Template Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <Info size={14} /> Thông tin Template
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-xl font-mono font-bold text-lg tracking-widest leading-none">
                         {voucherInfo.template.code}
                       </span>
                       <h3 className="text-xl font-bold text-gray-800 leading-tight">{voucherInfo.template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                      {voucherInfo.template.description || "Không có mô tả chi tiết cho voucher này."}
                    </p>
                  </div>
                </div>

                {/* Instance List using your custom DataTable */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
                    <Layers size={14} /> Kho Voucher (Instances)
                  </div>
                  <DataTable 
                    data={voucherInfo.instances || []}
                    columns={columns}
                    loading={false}
                    page={0}
                    size={100}
                    totalElements={voucherInfo.instances?.length || 0}
                    onPageChange={() => {}}
                  />
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-gray-200">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <DollarSign size={12} /> Giá trị ưu đãi
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-400 tabular-nums">
                          {voucherInfo.template.discountMethod === "FIXED_AMOUNT" 
                            ? formatCurrency(voucherInfo.template.discountValue)
                            : `${voucherInfo.template.discountValue}%`}
                        </span>
                        {voucherInfo.template.maxDiscount && (
                          <span className="text-xs text-white/50 font-bold tracking-tighter">
                            (Tối đa {formatCurrency(voucherInfo.template.maxDiscount)})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-[1px] bg-white/10 w-full" />

                    <div className="grid grid-cols-1 gap-4">
                       <InfoItem icon={<Target size={14}/>} label="Đơn tối thiểu" value={voucherInfo.template.minOrderAmount ? formatCurrency(voucherInfo.template.minOrderAmount) : "Không yêu cầu"} />
                       <InfoItem icon={<Trophy size={14}/>} label="Lượt dùng tối đa" value={`${voucherInfo.template.maxUsage} lượt`} />
                       <InfoItem icon={<Calendar size={14}/>} label="Bắt đầu" value={formatDateTime(voucherInfo.template.startDate)} />
                       <InfoItem icon={<Clock size={14}/>} label="Kết thúc" value={formatDateTime(voucherInfo.template.endDate)} />
                    </div>
                  </div>
                </div>

                {/* Scope Info */}
                <div className="bg-orange-50/50 rounded-4xl border border-gray-100 p-6 space-y-4">
                   <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">
                     <CheckCircle2 size={14} /> Phạm vi áp dụng
                   </div>
                   <div className="space-y-2">
                      <ScopeTag label="Shop" active={voucherInfo.template.applyToAllShops} />
                      <ScopeTag label="Sản phẩm" active={voucherInfo.template.applyToAllProducts} />
                      <ScopeTag label="Khách hàng" active={voucherInfo.template.applyToAllCustomers} />
                   </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end">
        <button 
          onClick={onClose}
          className="px-8 py-2.5 bg-gray-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          Đóng cửa sổ
        </button>
      </div>
    </PortalModal>
  );
}

// Small helper components
const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
      {icon} {label}
    </span>
    <span className="text-xs font-bold text-white/90">{value}</span>
  </div>
);

const ScopeTag = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl border border-gray-100/50 shadow-sm">
    <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
    <span className={cn(
      "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md",
      active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
    )}>
      {active ? "Tất cả" : "Giới hạn"}
    </span>
  </div>
);