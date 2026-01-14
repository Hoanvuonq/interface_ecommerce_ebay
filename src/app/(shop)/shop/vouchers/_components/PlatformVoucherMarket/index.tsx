/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Flame, 
  Info, 
  ShoppingCart, 
  Calendar, 
  Ticket as TicketIcon, 
  CreditCard,
  CheckCircle,
  X,
  Loader2,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { VoucherTemplate, DiscountMethod } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { usePurchaseVoucher, useGetRecommendedPlatformVouchers } from "../../_hooks/useShopVoucher";
import { cn } from "@/utils/cn";
import { PortalModal } from "@/features/PortalModal"; // Giả sử bạn có component PortalModal đã dùng ở trước

interface PlatformVoucherMarketProps {
  onPurchaseSuccess?: () => void;
}

export const PlatformVoucherMarket: React.FC<PlatformVoucherMarketProps> = ({
  onPurchaseSuccess,
}) => {
  // Disable auto-fetch, manually control when to fetch
  const { data: recommendedVouchers, loading, refetch } = useGetRecommendedPlatformVouchers();
  const { handlePurchase, loading: purchasing, error: purchaseError } = usePurchaseVoucher();
  
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherTemplate | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("recommended");

  // Fetch only when component mounts OR tab changes to "platform-market"
  React.useEffect(() => {
    if (recommendedVouchers.length === 0) {
      refetch();
    }
  }, []);

  const filteredVouchers = useMemo(() => {
    if (!recommendedVouchers) return [];
    return recommendedVouchers.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          v.code.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesFilter = filterType === "all" || v.discountMethod === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [recommendedVouchers, searchKeyword, filterType]);

  const handleBuyClick = (voucher: VoucherTemplate) => {
    setSelectedVoucher(voucher);
    setConfirmModalVisible(true);
  };

  const onConfirmPurchase = async () => {
    if (!selectedVoucher) return;
    const res = await handlePurchase({ templateId: selectedVoucher.id });
    if (res?.code === 1000) {
      setConfirmModalVisible(false);
      setSelectedVoucher(null);
      onPurchaseSuccess?.();
      refetch();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 uppercase tracking-tight">
            <Flame className="text-orange-500 animate-pulse" />
            Kho Voucher Platform
          </h2>
          <p className="text-sm text-gray-500 font-medium italic">Ưu đãi độc quyền giúp shop bùng nổ doanh số</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Tìm tên hoặc mã voucher..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 w-64 transition-all outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setFilterType("all")}
              className={cn("px-4 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-all", filterType === 'all' ? "bg-white text-orange-600 shadow-sm" : "text-gray-400")}
            >Tất cả</button>
            <button 
              onClick={() => setFilterType(DiscountMethod.PERCENTAGE)}
              className={cn("px-4 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-all", filterType === DiscountMethod.PERCENTAGE ? "bg-white text-orange-600 shadow-sm" : "text-gray-400")}
            >Giảm %</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 px-4">
        {["recommended", "hot", "premium"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab === "recommended" ? "Đề xuất" : tab === "hot" ? "Ưu đãi Hot" : "Cao cấp"}
            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Voucher Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Đang quét kho ưu đãi...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredVouchers.map((v) => (
              <VoucherCard key={v.id} voucher={v} onBuy={() => handleBuyClick(v)} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation Modal */}
      <PortalModal 
        isOpen={confirmModalVisible} 
        onClose={() => setConfirmModalVisible(false)}
        width="max-w-xl"
        className="rounded-[3rem] p-8"
      >
        {selectedVoucher && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-900 uppercase">Xác nhận mua Voucher</h3>
              <p className="text-sm text-gray-500 font-medium">Voucher sẽ được kích hoạt ngay sau khi thanh toán thành công</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-slate-800 p-6 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-orange-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">Platform Exclusive</div>
                  <TicketIcon size={24} className="opacity-40" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{selectedVoucher.name}</h4>
                  <p className="text-orange-400 font-mono font-bold tracking-widest">{selectedVoucher.code}</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                   <div>
                     <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Giá mua</p>
                     <p className="text-2xl font-bold">{selectedVoucher.purchasable ? `${selectedVoucher.price?.toLocaleString()}đ` : "MIỄN PHÍ"}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Số lượng</p>
                     <p className="font-bold">{selectedVoucher.maxUsage} lượt</p>
                   </div>
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setConfirmModalVisible(false)}
                className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
              >Hủy bỏ</button>
              <button 
                onClick={onConfirmPurchase}
                disabled={purchasing}
                className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {purchasing ? <Loader2 className="animate-spin" size={16} /> : "Xác nhận thanh toán"}
              </button>
            </div>
          </div>
        )}
      </PortalModal>
    </div>
  );
};

// Sub-component Voucher Card
const VoucherCard = ({ voucher, onBuy }: { voucher: VoucherTemplate; onBuy: () => void }) => {
  const daysLeft = dayjs(voucher.endDate).diff(dayjs(), "day");
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Discount Badge */}
        <div className={cn(
          "w-full p-6 rounded-[2rem] text-center relative overflow-hidden",
          voucher.discountMethod === DiscountMethod.PERCENTAGE 
            ? "bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/20" 
            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
        )}>
          <div className="relative z-10">
            <span className="text-3xl font-bold tracking-tighter">
              {voucher.discountMethod === DiscountMethod.PERCENTAGE ? `${voucher.discountValue}%` : `${(voucher.discountValue/1000)}K`}
            </span>
            <span className="text-[10px] block font-bold uppercase tracking-[0.2em] opacity-80">Giảm giá</span>
          </div>
          <TicketIcon className="absolute -bottom-4 -right-4 w-20 h-20 opacity-10 rotate-12" />
        </div>

        <div className="space-y-2 px-1">
          <h3 className="font-bold text-gray-900 uppercase text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{voucher.name}</h3>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-orange-50 rounded-lg border border-orange-100">
               <span className="text-[10px] font-mono font-bold text-orange-600 tracking-widest">{voucher.code}</span>
            </div>
            {daysLeft <= 7 && <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg uppercase">Hot</span>}
          </div>
        </div>

        <div className="space-y-2 px-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <div className="flex items-center gap-1.5"><ShoppingCart size={12} /> Đơn tối thiểu:</div>
            <span className="text-gray-900">{voucher.minOrderAmount ? `${voucher.minOrderAmount.toLocaleString()}đ` : "0đ"}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <div className="flex items-center gap-1.5"><Calendar size={12} /> Thời hạn:</div>
            <span className={cn(daysLeft <= 3 ? "text-rose-500" : "text-gray-900")}>Còn {daysLeft} ngày</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 px-1">
        <div className="h-[1px] bg-gray-50 w-full" />
        <div className="flex items-center justify-between">
           <div>
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Giá mua</p>
             <p className="text-sm font-bold text-orange-600 tracking-tight">{voucher.price ? `${voucher.price.toLocaleString()}đ` : "MIỄN PHÍ"}</p>
           </div>
           <button 
             onClick={onBuy}
             className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-orange-500 transition-all active:scale-90 shadow-lg shadow-gray-200"
           >
             <ShoppingCart size={18} strokeWidth={2.5} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};