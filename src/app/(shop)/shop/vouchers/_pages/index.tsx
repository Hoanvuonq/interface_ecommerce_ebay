"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Ticket, 
  ShoppingBag, 
  ShoppingCart, 
  BarChart3, 
  History, 
  Gift, 
  Zap, 
  Loader2,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShopVoucherList from "../_components/ShopVoucherList";
import { PlatformVoucherMarket } from "../_components/PlatformVoucherMarket";
import VoucherStatistics from "../_components/VoucherStatistics";
import VoucherHistory from "../_components/VoucherHistory";
import PurchasedVoucherList from "../_components/PurchasedVoucherList";
import { searchVoucherTemplates } from "@/app/(main)/shop/_service/shop.voucher.service";
import { cn } from "@/utils/cn";
import { StatusTabsVoucher } from "../_components/StatusTabsVoucher";

interface TabCounts {
  myVouchers: number;
  activeVouchers: number;
  platformAvailable: number;
  purchasableByShop: number;
  transactions: number;
}

export const ShopVouchersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("my-vouchers");
  const [counts, setCounts] = useState<TabCounts>({
    myVouchers: 0,
    activeVouchers: 0,
    platformAvailable: 0,
    purchasableByShop: 0,
    transactions: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    try {
      const [shopRes, activeRes, platformRes] = await Promise.all([
        searchVoucherTemplates({ scope: "shop", page: 0, size: 1 }),
        searchVoucherTemplates({ scope: "shop", page: 0, size: 1 }),
        searchVoucherTemplates({ scope: "platform", page: 0, size: 1 }),
      ]);

      setCounts(prev => ({
        ...prev,
        myVouchers: shopRes.data?.totalElements || 0,
        activeVouchers: activeRes.data?.totalElements || 0,
        platformAvailable: platformRes.data?.totalElements || 0,
      }));
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleTransactionCountUpdate = useCallback((count: number) => {
    setCounts((prev) => ({ ...prev, transactions: count }));
  }, []);

  const handlePurchasedCountUpdate = useCallback((count: number) => {
    setCounts((prev) => ({ ...prev, purchasableByShop: count }));
  }, []);

  const voucherTabs = [
    { id: "my-vouchers", label: "Của tôi", icon: <Ticket size={18} />, count: counts.myVouchers, color: "blue" },
    { id: "platform-market", label: "Kho Sàn", icon: <Zap size={18} />, count: counts.platformAvailable, color: "emerald" },
    { id: "purchased", label: "Đã sở hữu", icon: <ShoppingCart size={18} />, count: counts.purchasableByShop, color: "purple" },
    { id: "statistics", label: "Phân tích", icon: <BarChart3 size={18} />, count: null, color: "orange" },
    { id: "history", label: "Lịch sử", icon: <History size={18} />, count: counts.transactions, color: "slate" },
  ];

  return (
    <div className="p-8 space-y-4 min-h-screen animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-[1.25rem] text-white shadow-xl shadow-orange-200">
              <Gift size={28} strokeWidth={2.5} />
            </div>
            Trung tâm Voucher
          </h1>
          <p className="text-sm text-gray-500 font-medium italic ml-1">
            Gia tăng doanh số bằng các chiến dịch khuyến mãi thông minh
          </p>
        </div>

        <div className="flex items-center gap-4">
           <MiniStat label="Đang chạy" value={counts.activeVouchers} icon={<Activity size={14} className="text-emerald-500" />} />
           <div className="h-8 w-[1px] bg-gray-200" />
           <MiniStat label="Từ Platform" value={counts.platformAvailable} icon={<Zap size={14} className="text-orange-500" />} />
        </div>
      </div>

      
     <StatusTabsVoucher 
      tabs={voucherTabs} 
      current={activeTab} 
      onChange={setActiveTab} 
    />

      {/* 3. Dynamic Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "my-vouchers" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SummaryCard label="Tổng Voucher Shop" value={counts.myVouchers} color="blue" icon={<Ticket />} />
                  <SummaryCard label="Voucher Hoạt động" value={counts.activeVouchers} color="emerald" icon={<TrendingUp />} />
                </div>
                <ShopVoucherList />
              </div>
            )}

            {activeTab === "platform-market" && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
                  <div className="p-3 bg-white rounded-2xl text-emerald-500 shadow-sm border border-emerald-50">
                    <Gift size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest">Tiếp cận nguồn lực Sàn</h3>
                    <p className="text-xs font-bold text-emerald-700/70 uppercase tracking-tight mt-1">
                      Tham gia các chương trình khuyến mãi do Platform tài trợ để đẩy mạnh lưu lượng truy cập
                    </p>
                  </div>
                </div>
                <PlatformVoucherMarket />
              </div>
            )}

            {activeTab === "purchased" && (
              <PurchasedVoucherList onCountUpdate={handlePurchasedCountUpdate} />
            )}

            {activeTab === "statistics" && (
              <VoucherStatistics />
            )}

            {activeTab === "history" && (
              <VoucherHistory onCountUpdate={handleTransactionCountUpdate} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const MiniStat = ({ label, value, icon }: any) => (
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-lg font-bold text-gray-900 leading-none mt-0.5">{value}</p>
  </div>
);

const SummaryCard = ({ label, value, icon, color }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-white border-blue-100 text-blue-600",
    emerald: "from-emerald-50 to-white border-emerald-100 text-emerald-600",
  };

  return (
    <div className={cn(
      "p-6 rounded-[2.5rem] border bg-gradient-to-br shadow-sm group hover:shadow-md transition-all duration-300",
      colors[color]
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-white group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { size: 20 })}
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900 tabular-nums">{value.toLocaleString()}</h3>
    </div>
  );
};