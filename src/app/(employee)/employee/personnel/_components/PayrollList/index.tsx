"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { 
  DollarSign, CheckCircle2, Clock, Home, Users, 
  Eye, Edit2, Trash2, ChevronRight,
  FileText
} from "lucide-react";
import _ from "lodash";

import { usePayrollManagement } from "../../_hooks/usePayrollManagement";
import { PayrollResponse } from "../../_types/payroll.type";
import PayrollForm from "../PayrollForm";
import PayrollDetail from "../PayrollDetail";
import { StatCardComponents, DataTable, ActionBtn } from "@/components"; 
import { SelectComponent } from "@/components/selectComponent";
import { cn } from "@/utils/cn";
import { Column } from "@/components/DataTable/type";
import { formatCurrency } from "@/hooks/format";

export default function PayrollList({ employeeId, employeeName }: { employeeId: string; employeeName: string }) {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(0); 
  const [size, setSize] = useState(10);

  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollResponse | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const { 
    payrolls, pagination, stats, isLoading, 
    markPaid, deletePayroll 
  } = usePayrollManagement(employeeId, selectedYear, page + 1, size);

  
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return _.range(current - 5, current + 3).map(y => ({ label: `Năm ${y}`, value: String(y) }));
  }, []);

  const columns: Column<PayrollResponse>[] = [
    {
      header: "Tháng",
      align: "center",
      render: (row) => <span className="font-semibold text-gray-700 italic">{dayjs(row.payMonth).format("MM/YYYY")}</span>
    },
    {
      header: "Lương cơ bản",
      align: "center",
      render: (row) => <span className="font-bold text-gray-600">{formatCurrency(row.baseSalary)}</span>
    },
    {
      header: "Biến động",
      align: "center",
      render: (row) => (
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-emerald-500">+{formatCurrency(row.bonus)}</span>
          <span className="text-[10px] font-bold text-red-400">-{formatCurrency(row.deduction)}</span>
        </div>
      )
    },
    {
      header: "Thực nhận",
      align: "center",
      render: (row) => <span className="text-base font-semibold text-blue-600 italic tracking-tighter">{formatCurrency(row.total)}</span>
    },
    {
      header: "Trạng thái",
      align: "center",
      render: (row) => (
        <span className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-tighter border",
          row.paid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          {row.paid ? "Đã tất toán" : "Chờ chi trả"}
        </span>
      )
    },
    {
      header: "Quản trị",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <ActionBtn onClick={() => { setSelectedPayroll(row); setOpenDetail(true); }} icon={<Eye size={14}/>} color="hover:text-blue-500" />
          <ActionBtn onClick={() => { setSelectedPayroll(row); setFormMode("update"); setOpenForm(true); }} icon={<Edit2 size={14}/>} color="hover:text-orange-500" />
          {!row.paid && (
            <>
              <ActionBtn onClick={() => markPaid(row.id)} icon={<CheckCircle2 size={14}/>} color="hover:text-emerald-500" />
              <ActionBtn onClick={() => deletePayroll(row.id)} icon={<Trash2 size={14}/>} color="hover:text-red-500" />
            </>
          )}
        </div>
      )
    }
  ];

  const tableHeader = (
    <div className="w-full flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-semibold uppercase text-gray-600 tracking-widest">Niên độ:</span>
        <SelectComponent options={yearOptions} value={String(selectedYear)} onChange={(v) => setSelectedYear(Number(v))} className="w-40" />
      </div>
      <div className="flex items-center gap-3">
         <span className="text-[10px] font-semibold uppercase text-gray-600">Hiển thị:</span>
         <SelectComponent options={[{label: '10 dòng', value: '10'}, {label: '20 dòng', value: '20'}]} value={String(size)} onChange={(v) => setSize(Number(v))} className="w-32" />
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
          <button onClick={() => router.push("/")} className="hover:text-orange-500 transition-colors flex items-center gap-1"><Home size={12}/> Dashboard</button>
          <ChevronRight size={10} />
          <button onClick={() => router.push("/employee/personnel")} className="hover:text-orange-500 transition-colors flex items-center gap-1"><Users size={12}/> Nhân sự</button>
          <ChevronRight size={10} />
          <span className="text-gray-900 italic">Bảng lương: {employeeName}</span>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-5xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
              Payroll <span className="text-orange-500 underline decoration-4 underline-offset-8">Account</span>
            </h1>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.3em]">Quản lý thu nhập nhân sự tập trung</p>
          </div>
          <button 
            onClick={() => { setFormMode("create"); setSelectedPayroll(null); setOpenForm(true); }}
            className="bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-semibold uppercase text-xs tracking-widest transition-all duration-500 shadow-2xl shadow-gray-200 flex items-center gap-2 active:scale-95"
          >
            <DollarSign size={18} /> Khởi tạo bảng lương
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardComponents label="Tổng cộng" value={stats.totalMoney || 0} icon={<DollarSign />} color="text-gray-900" />
        <StatCardComponents label="Đã quyết toán" value={stats.totalMoneyPaid || 0} icon={<CheckCircle2 />} color="text-emerald-500" />
        <StatCardComponents label="Chưa chi trả" value={stats.totalMoneyUnpaid || 0} icon={<Clock />} color="text-amber-500" />
        <StatCardComponents label="Số phiếu lương" value={stats.totalPayrolls || 0} icon={<FileText />} color="text-blue-500" />
      </div>

      <DataTable
        data={payrolls}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        page={page}
        size={size}
        totalElements={pagination.total}
        onPageChange={setPage}
        headerContent={tableHeader}
      />

      <PayrollForm open={openForm} onClose={() => setOpenForm(false)} employeeId={employeeId} mode={formMode} payroll={selectedPayroll} onSuccess={() => setOpenForm(false)} />
      <PayrollDetail open={openDetail} onClose={() => setOpenDetail(false)} payroll={selectedPayroll} />
    </div>
  );
}