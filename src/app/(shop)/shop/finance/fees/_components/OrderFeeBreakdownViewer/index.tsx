'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Info, 
  ArrowUpRight, 
  CreditCard, 
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { feeReportApi } from '@/api/fee-report/feeReportApi';
import type { OrderFeeBreakdownResponse, OrderFeeEntry, ItemFeeEntry } from '@/api/_types/fee-report.types';
import { cn } from '@/utils/cn';

export const OrderFeeBreakdownViewer: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderFeeBreakdownResponse | null>(null);

  const formatCurrency = (value?: number | null) =>
    value != null ? value.toLocaleString('vi-VN') + ' ₫' : '-';

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = orderId.trim();
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await feeReportApi.getOrderBreakdown(id);
      setData(res);
    } catch (e: any) {
      setError(e?.message || 'Không thể tải chi tiết phí cho đơn hàng này');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-custom">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Tra cứu chi tiết phí đơn hàng
          </h2>
          <p className="text-sm text-gray-500">
            Xem breakdown: tổng phí, phần sàn nhận, phần shop nhận thực tế.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Nhập Order ID..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kiểm tra'}
          </button>
          <button
            type="button"
            onClick={() => { setData(null); setOrderId(''); }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Result Area */}
      {data && !loading && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard 
              icon={<ShoppingBag className="text-sky-600" />}
              label="Tổng giá trị đơn"
              value={formatCurrency(data.orderTotal)}
              subtext={`Mã: ${data.orderCode}`}
              color="sky"
            />
            <SummaryCard 
              icon={<TrendingUp className="text-blue-600" />}
              label="Doanh thu sàn"
              value={formatCurrency(data.platformRevenue)}
              subtext={`Phí tổng: ${formatCurrency(data.totalFees)}`}
              color="blue"
            />
            <SummaryCard 
              icon={<CreditCard className="text-emerald-600" />}
              label="Shop thực nhận"
              value={formatCurrency(data.shopNetRevenue)}
              subtext={`Khấu trừ: ${formatCurrency(data.shopDeduction)}`}
              color="emerald"
            />
          </div>

          {/* Tables Container */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Table Order Fees */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">Phí cấp ORDER (Thanh toán, COD, Dịch vụ...)</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">% dựa trên tổng phí</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">Loại phí</th>
                      <th className="px-6 py-3">Mã</th>
                      <th className="px-6 py-3 text-center">Bên chịu</th>
                      <th className="px-6 py-3 text-right">Số tiền</th>
                      <th className="px-6 py-3 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.orderFees?.map((fee, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-700">{fee.displayName}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded">{fee.feeType}</span></td>
                        <td className="px-6 py-4 text-center">
                           <ChargedBadge type={fee.chargedTo} />
                        </td>
                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(fee.amount)}</td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs">
                          {data.totalFees ? `${((fee.amount / data.totalFees) * 100).toFixed(1)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Item Fees */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">Phí cấp ITEM (Hoa hồng sản phẩm)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">Sản phẩm</th>
                      <th className="px-6 py-3">Loại phí</th>
                      <th className="px-6 py-3 text-center">Bên chịu</th>
                      <th className="px-6 py-3 text-right">Số tiền</th>
                      <th className="px-6 py-3 text-right">Tỷ lệ gốc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.itemFees?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 max-w-xs truncate font-medium text-gray-700">{item.productName}</td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{item.feeType}</td>
                        <td className="px-6 py-4 text-center"><ChargedBadge type={item.chargedTo} /></td>
                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(item.amount)}</td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs">
                          {item.percentage ? `${(item.percentage * 100).toFixed(2)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const SummaryCard = ({ icon, label, value, subtext, color }: any) => (
  <div className={cn(
    "p-5 rounded-4xl border transition-all duration-300 hover:shadow-xl",
    color === 'sky' && "bg-sky-50/30 border-sky-100 hover:bg-sky-50",
    color === 'blue' && "bg-blue-50/30 border-blue-100 hover:bg-blue-50",
    color === 'emerald' && "bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50"
  )}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-white/50">{icon}</div>
      <ArrowUpRight className="w-4 h-4 text-gray-300" />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{value}</h3>
    <p className="text-[11px] font-bold text-gray-500 mt-2 flex items-center gap-1 opacity-70">
      <span className="w-1 h-1 rounded-full bg-current" /> {subtext}
    </p>
  </div>
);

const ChargedBadge = ({ type }: { type: string }) => (
  <span className={cn(
    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
    type === 'SHOP' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
  )}>
    {type === 'SHOP' ? 'Shop chịu' : 'Sàn chịu'}
  </span>
);