"use client";

import { StatCardComponents, TooltipComponents } from "@/components";
import { ChartBox } from "@/components/chart";
import { AlertCircle, BarChart3, Building2, PieChart as PieIcon, RotateCw, TrendingUp, UserCircle2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  XAxis, YAxis,
} from "recharts";
import { useGetDepartmentStatistics } from "../../_hooks/useDepartment";
import { MetricCard } from "../MetricCard";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316"];

export default function DepartmentStatistics() {
  const { handleGetDepartmentStatistics, loading } = useGetDepartmentStatistics();
  const [statistics, setStatistics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await handleGetDepartmentStatistics();
      if (res?.data) {
        const data = res.data;
        const positionsArray = Object.entries(data.positions || {}).map(([name, count]) => ({
          name, value: count as number,
        })).sort((a, b) => b.value - a.value);

        const employeesArray = Object.entries(data.employees || {}).map(([name, count]) => ({
          name, value: count as number,
        })).sort((a, b) => b.value - a.value);

        setStatistics({ ...data, positionsArray, employeesArray });
      } else {
        setError("Không thể tải dữ liệu thống kê");
      }
    } catch (e: any) {
      setError(e?.message || "Lỗi khi tải thống kê");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <RotateCw className="animate-spin text-orange-500" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Đang phân tích dữ liệu...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-rose-50 rounded-4xl border border-rose-100 flex items-center gap-4 text-rose-600">
      <AlertCircle /> <span className="font-bold uppercase text-xs tracking-widest">{error}</span>
    </div>
  );

  if (!statistics) return null;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
          Phân tích <span className="text-orange-500 underline decoration-4 underline-offset-8">Phòng Ban</span>
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Báo cáo cấu trúc nhân sự và định biên chức vụ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCardComponents label="Tổng phòng ban" value={statistics.totalDepartments} icon={<Building2 />} color="text-slate-900" />
        <StatCardComponents label="Định biên chức vụ" value={statistics.totalPositions} icon={<Users />} color="text-blue-500" />
        <StatCardComponents label="Tổng số nhân sự" value={statistics.totalEmployees} icon={<UserCircle2 />} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartBox title="Phân bổ nhân sự" sub="Tỷ trọng nhân viên theo phòng ban" icon={<PieIcon className="text-orange-500" />}>
          <div className="h-87.5 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={statistics.employeesArray} 
                    innerRadius={80} outerRadius={110} 
                    paddingAngle={8} dataKey="value"
                >
                  {statistics.employeesArray.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip content={<TooltipComponents unit="Nhân sự" />} />
                <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>

        <ChartBox title="Định biên vị trí" sub="Số lượng chức vụ theo từng đơn vị" icon={<BarChart3 className="text-blue-500" />}>
          <div className="h-87.5 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics.positionsArray}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<TooltipComponents unit="Chức vụ" />} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {statistics.positionsArray.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
      </div>

      <ChartBox title="Chỉ số hiệu quả" sub="Phân tích tỷ lệ trung bình toàn hệ thống" icon={<TrendingUp className="text-emerald-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <MetricCard label="Nhân viên/Phòng" value={(statistics.totalEmployees / statistics.totalDepartments).toFixed(1)} color="bg-blue-50 text-blue-600" />
            <MetricCard label="Chức vụ/Phòng" value={(statistics.totalPositions / statistics.totalDepartments).toFixed(1)} color="bg-purple-50 text-purple-600" />
            <MetricCard label="Nhân viên/Chức vụ" value={(statistics.totalEmployees / statistics.totalPositions).toFixed(1)} color="bg-emerald-50 text-emerald-600" />
            <MetricCard label="Tỷ lệ lấp đầy" value="100%" color="bg-orange-50 text-orange-600" />
        </div>
      </ChartBox>
    </div>
  );
}
