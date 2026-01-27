/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  History, 
  ShoppingCart, 
  Gift, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  DollarSign,
  Calendar,
  Filter,
  ChevronRight,
  ArrowRight,
  X
} from "lucide-react";
import dayjs from "dayjs";
import { 
  TransactionType, 
  PaymentStatus 
} from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { getShopTransactions } from "@/app/(main)/shop/_service/shop.voucher.service";
import { DataTable } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";

interface VoucherHistoryProps {
  onCountUpdate?: (count: number) => void;
}

const VoucherHistory: React.FC<VoucherHistoryProps> = ({ onCountUpdate }) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await getShopTransactions({ page: 0, size: 100 });
        const data = res.data?.content || [];
        setTransactions(data);
        if (onCountUpdate) onCountUpdate(data.length);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [onCountUpdate]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filterType === "all" || t.type === filterType;
      const statusMatch = filterStatus === "all" || t.paymentStatus === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [transactions, filterType, filterStatus]);

  // Column Definitions for your DataTable
  const columns = useMemo(() => [
    {
      header: "Mã giao dịch",
      render: (item: any) => (
        <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase">
          #{item.id.slice(-8)}
        </span>
      ),
    },
    {
      header: "Voucher",
      className: "min-w-[200px]",
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none bg-orange-50 w-fit px-1.5 py-0.5 rounded">
            {item.voucherCode}
          </span>
          <span className="text-sm font-bold text-gray-800 line-clamp-1">{item.voucherName}</span>
        </div>
      ),
    },
    {
      header: "Loại",
      render: (item: any) => {
        const configs: any = {
          [TransactionType.PURCHASE]: { label: "Mua từ sàn", color: "bg-blue-50 text-blue-700", icon: <ShoppingCart size={12}/> },
          [TransactionType.GRANT]: { label: "Được tặng", color: "bg-emerald-50 text-emerald-700", icon: <Gift size={12}/> },
          [TransactionType.SELF_CREATE]: { label: "Tự tạo", color: "bg-purple-50 text-purple-700", icon: <CheckCircle2 size={12}/> },
        };
        const config = configs[item.type] || configs[TransactionType.PURCHASE];
        return (
          <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight", config.color)}>
            {config.icon} {config.label}
          </span>
        );
      }
    },
    {
      header: "Số tiền",
      align: "right" as const,
      render: (item: any) => (
        <span className={cn("text-sm font-bold tabular-nums", item.totalAmount > 0 ? "text-rose-500" : "text-emerald-500")}>
          {item.totalAmount > 0 ? `${item.totalAmount.toLocaleString()}₫` : "Miễn phí"}
        </span>
      )
    },
    {
      header: "Trạng thái",
      render: (item: any) => {
        const statusConfigs: any = {
          [PaymentStatus.PAID]: { label: "Thành công", color: "bg-emerald-500 text-white", icon: <CheckCircle2 size={12}/> },
          [PaymentStatus.PENDING]: { label: "Xử lý", color: "bg-blue-400 text-white", icon: <Clock size={12}/> },
          [PaymentStatus.AWAITING_PAYMENT]: { label: "Chờ trả tiền", color: "bg-amber-400 text-white", icon: <Clock size={12}/> },
          [PaymentStatus.FAILED]: { label: "Thất bại", color: "bg-rose-500 text-white", icon: <XCircle size={12}/> },
        };
        const config = statusConfigs[item.paymentStatus];
        return (
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm", config.color)}>
            {config.label}
          </span>
        );
      }
    },
    {
      header: "Thời gian",
      render: (item: any) => (
        <div className="flex flex-col text-[11px] font-medium text-gray-500">
          <span>{dayjs(item.transactionDate).format("DD/MM/YYYY")}</span>
          <span className="opacity-50">{dayjs(item.transactionDate).format("HH:mm")}</span>
        </div>
      )
    },
    {
      header: "",
      align: "right" as const,
      render: (item: any) => (
        <button 
          onClick={() => { setSelectedTransaction(item); setDetailModalVisible(true); }}
          className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white rounded-xl transition-all shadow-sm"
        >
          <Eye size={16} />
        </button>
      )
    }
  ], [setSelectedTransaction, setDetailModalVisible]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-900 rounded-2xl text-white shadow-lg">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight leading-none">Lịch sử giao dịch</h2>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Quản lý dòng tiền Voucher</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
             <Filter size={14} className="ml-2 text-gray-500" />
             <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none text-gray-600 pr-2"
             >
                <option value="all">Tất cả loại</option>
                <option value={TransactionType.PURCHASE}>Mua từ sàn</option>
                <option value={TransactionType.GRANT}>Sàn tặng</option>
                <option value={TransactionType.SELF_CREATE}>Tự tạo</option>
             </select>
           </div>

           <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
             <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none text-gray-600 px-2"
             >
                <option value="all">Tất cả trạng thái</option>
                <option value={PaymentStatus.PAID}>Thành công</option>
                <option value={PaymentStatus.AWAITING_PAYMENT}>Chờ thanh toán</option>
                <option value={PaymentStatus.FAILED}>Thất bại</option>
             </select>
           </div>
        </div>
      </div>

      {/* Main Content using your DataTable */}
      <DataTable 
        data={filteredData}
        columns={columns}
        loading={loading}
        page={0}
        size={100}
        totalElements={filteredData.length}
        onPageChange={() => {}}
        emptyMessage="Hiện tại chưa có giao dịch nào được thực hiện."
      />

      {/* Detail Modal */}
      <PortalModal 
        isOpen={detailModalVisible} 
        onClose={() => setDetailModalVisible(false)}
        width="max-w-2xl"
        className="rounded-[3rem] p-0 overflow-hidden"
      >
        {selectedTransaction && (
          <div className="space-y-0">
            {/* Header Modal */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl text-white shadow-md">
                   <DollarSign size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Chi tiết giao dịch</h3>
              </div>
              <button onClick={() => setDetailModalVisible(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Transaction Highlight */}
              <div className="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                 <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Mã tham chiếu</p>
                   <p className="font-mono text-lg font-bold text-gray-900 tabular-nums uppercase">{selectedTransaction.id}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tổng cộng</p>
                    <p className="text-2xl font-bold text-orange-600 tracking-tighter">
                      {selectedTransaction.totalAmount.toLocaleString()}₫
                    </p>
                 </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Tên Voucher</p>
                       <p className="text-sm font-bold text-gray-800 leading-tight">{selectedTransaction.voucherName}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Phương thức</p>
                       <p className="text-sm font-bold text-gray-700">{selectedTransaction.paymentMethod || "N/A"}</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-1 text-right">
                       <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Mã Code</p>
                       <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">
                          {selectedTransaction.voucherCode}
                       </span>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Số lượng mua</p>
                       <p className="text-sm font-bold text-gray-800">{selectedTransaction.quantity} lượt</p>
                    </div>
                 </div>
              </div>

              {/* Status Timeline Section */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase  mb-6 flex items-center gap-2">
                   <Clock size={14} className="text-blue-500" /> Tiến trình xử lý
                </h4>
                
                <div className="space-y-8 relative before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                   <TimelineStep 
                    active={true} 
                    title="Tạo giao dịch" 
                    time={dayjs(selectedTransaction.transactionDate).format("DD/MM/YYYY HH:mm")} 
                    desc="Hệ thống khởi tạo đơn hàng voucher thành công"
                   />
                   
                   {selectedTransaction.paymentStatus === PaymentStatus.PAID ? (
                     <TimelineStep 
                      active={true} 
                      success={true}
                      title="Thanh toán thành công" 
                      time={dayjs(selectedTransaction.paymentCompletedAt).format("DD/MM/YYYY HH:mm")} 
                      desc="Tiền đã được cấn trừ và voucher đã được kích hoạt"
                     />
                   ) : selectedTransaction.paymentStatus === PaymentStatus.FAILED ? (
                     <TimelineStep 
                      active={true} 
                      error={true}
                      title="Giao dịch thất bại" 
                      time={dayjs().format("DD/MM/YYYY HH:mm")} 
                      desc={selectedTransaction.failureMessage || "Lỗi xử lý hệ thống thanh toán"}
                     />
                   ) : (
                     <TimelineStep 
                      active={true} 
                      pending={true}
                      title="Chờ xác nhận" 
                      desc="Đang chờ phản hồi từ cổng thanh toán"
                     />
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
      </PortalModal>
    </div>
  );
};

// Internal Helper Components
const TimelineStep = ({ active, title, time, desc, success, error, pending }: any) => (
  <div className="relative pl-10">
    <div className={cn(
      "absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm transition-colors flex items-center justify-center",
      active ? (success ? "bg-emerald-500" : error ? "bg-rose-500" : pending ? "bg-amber-400" : "bg-blue-500") : "bg-gray-200"
    )}>
      {success && <CheckCircle2 size={10} className="text-white" />}
      {error && <XCircle size={10} className="text-white" />}
    </div>
    <div className="space-y-0.5">
      <p className={cn("text-[11px] font-bold uppercase tracking-tight", active ? "text-gray-900" : "text-gray-500")}>{title}</p>
      {time && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter leading-none mb-1">{time}</p>}
      <p className="text-xs font-medium text-gray-500 leading-tight">{desc}</p>
    </div>
  </div>
);

export default VoucherHistory;