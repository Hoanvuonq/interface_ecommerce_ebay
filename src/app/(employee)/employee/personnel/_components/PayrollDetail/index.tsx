"use client";

import React from "react";
import dayjs from "dayjs";
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  DollarSign, 
  ArrowDownToLine,
  Calendar,
  Calculator,
  MinusCircle,
  PlusCircle
} from "lucide-react";
import { PayrollResponse } from "../../_types/payroll.type";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { SectionHeader } from "@/components";

interface PayrollDetailProps {
  open: boolean;
  onClose: () => void;
  payroll: PayrollResponse | null;
}

export default function PayrollDetail({
  open,
  onClose,
  payroll,
}: PayrollDetailProps) {
  if (!payroll) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatMonth = (payMonth: string) => {
    return dayjs(payMonth, "YYYY-MM").format("MM/YYYY");
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title="Chi tiết phiếu lương"
      width="max-w-2xl"
    >
      <div className="space-y-6 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-50/50 rounded-4xl border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm shadow-orange-100">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tighter uppercase italic leading-none">
                Tháng {formatMonth(payroll.payMonth)}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chu kỳ thanh toán nhân sự</p>
            </div>
          </div>
          
          <div className={cn(
            "px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest border flex items-center gap-2",
            payroll.paid 
              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
              : "bg-amber-50 text-amber-600 border-amber-100"
          )}>
            {payroll.paid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
            {payroll.paid ? "Đã tất toán" : "Đang chờ chi"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailSalaryBox 
            label="Lương cơ bản" 
            value={formatCurrency(payroll.baseSalary)} 
            color="text-slate-900"
          />
          <DetailSalaryBox 
            label="Các khoản thưởng" 
            value={payroll.bonus > 0 ? `+${formatCurrency(payroll.bonus)}` : formatCurrency(0)} 
            color="text-emerald-500"
            icon={<PlusCircle size={14} />}
          />
          <DetailSalaryBox 
            label="Các khoản khấu trừ" 
            value={payroll.deduction > 0 ? `-${formatCurrency(payroll.deduction)}` : formatCurrency(0)} 
            color="text-red-500"
            icon={<MinusCircle size={14} />}
          />
          <div className="p-5 rounded-3xl bg-orange-500 shadow-lg shadow-orange-200 flex flex-col justify-center">
            <p className="text-[10px] font-semibold text-orange-100 uppercase tracking-widest mb-1">Thực lĩnh cuối cùng</p>
            <p className="text-2xl font-semibold text-white italic tracking-tighter">{formatCurrency(payroll.total)}</p>
          </div>
        </div>

        <div className="bg-white rounded-4xl border border-slate-100 p-6 space-y-4">
          <SectionHeader icon={<Clock size={16}/>} title="Lịch trình thanh toán" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentStep 
              label="Ngày dự kiến" 
              date={payroll.expectedPayDate ? dayjs(payroll.expectedPayDate).format("DD/MM/YYYY") : "Chưa xác định"} 
            />
            <PaymentStep 
              label="Ngày quyết toán" 
              date={payroll.paidDate ? dayjs(payroll.paidDate).format("DD/MM/YYYY HH:mm") : "Chưa thanh toán"}
              isHighlighted={!!payroll.paidDate}
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-4xl p-6 text-white relative overflow-hidden">
          <Calculator className="absolute -right-4 -top-4 text-white/5 rotate-12" size={120} />
          <div className="relative z-10">
            <SectionHeader icon={<Calculator size={16} className="text-orange-400" />} title="Minh bạch tài chính" isLight />
            <div className="mt-4 font-mono text-sm flex flex-wrap items-center gap-2">
              <span className="bg-white/10 px-2 py-1 rounded-lg">{formatCurrency(payroll.baseSalary)}</span>
              <span className="text-emerald-400 font-bold">+</span>
              <span className="bg-white/10 px-2 py-1 rounded-lg text-emerald-400">{formatCurrency(payroll.bonus)}</span>
              <span className="text-red-400 font-bold">-</span>
              <span className="bg-white/10 px-2 py-1 rounded-lg text-red-400">{formatCurrency(payroll.deduction)}</span>
              <span className="text-orange-400 font-semibold text-lg">=</span>
              <span className="text-orange-400 font-semibold text-lg underline decoration-double">{formatCurrency(payroll.total)}</span>
            </div>
          </div>
        </div>

        {payroll.attachmentUrl && (
          <button 
            onClick={() => window.open(payroll.attachmentUrl, "_blank")}
            className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl group hover:bg-blue-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                <FileText size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">Sao kê chi tiết lương (.PDF)</span>
            </div>
            <ArrowDownToLine size={18} className="text-blue-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}

        <div className="pt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl font-semibold uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </PortalModal>
  );
}

// --- Internal Helper Components ---

const DetailSalaryBox = ({ label, value, color, icon }: any) => (
  <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <p className={cn("text-xl font-semibold italic tracking-tighter", color)}>{value}</p>
  </div>
);



const PaymentStep = ({ label, date, isHighlighted }: any) => (
  <div className="space-y-1">
    <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">{label}</p>
    <div className={cn(
      "px-4 py-3 rounded-xl border font-bold text-sm",
      isHighlighted ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-500"
    )}>
      {date}
    </div>
  </div>
);