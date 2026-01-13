/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SectionLoading } from "@/components";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { getStoredUserDetail } from "@/utils/jwt";
import { FileText, ShieldCheck, Store, AlertCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import BasicInfo from "../_components/BasicInfo";
import LegalInfo from "../_components/LegalInfo";
import TaxInfo from "../_components/TaxInfo";
import { useGetShopInfo } from "../_hooks/useShop";

type TabKey = "basic" | "tax" | "legal";

export default function ShopProfileScreen() {
  const [shop, setShop] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const { handleGetShopInfo, loading } = useGetShopInfo();
  const users = getStoredUserDetail();
  const { error: toastError } = useToast();

  useEffect(() => {
  const fetchShop = async () => {
    try {
      if (users?.shopId) {
        // TRUYỀN THAM SỐ: Sửa lỗi TS2554
        const res = await handleGetShopInfo(users.shopId); 
        
        // KIỂM TRA LOG: Nếu log này không có taxInfo, hãy báo Backend check lại quyền của Token
        console.log(">>> Full Data check:", res?.data); 

        if (res && res.data) {
          setShop(res.data);
        }
      }
    } catch (err: any) {
      toastError("Lỗi tải profile nội bộ của shop");
    }
  };
  fetchShop();
}, [users?.shopId]);

  // Component hiển thị thông báo lỗi khi thiếu dữ liệu nhạy cảm (Tax/Legal)
  const DataMissingPlaceholder = () => (
    <div className="flex flex-col items-center justify-center p-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200 mt-4">
      <AlertCircle className="text-orange-400 mb-4" size={48} strokeWidth={1.5} />
      <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Dữ liệu không khả dụng</h3>
      <p className="text-sm text-gray-500 text-center max-w-md mt-2 leading-relaxed">
        Hệ thống không tìm thấy thông tin xác thực. <br/> 
        Vui lòng đảm bảo bạn đang dùng <b>API Nội bộ</b> thay vì API Công khai.
      </p>
    </div>
  );

  // Render Content dựa trên Active Tab và Shop Data
  const renderTabContent = useMemo(() => {
    if (!shop) return null;

    switch (activeTab) {
      case "basic":
        return <BasicInfo shop={shop} setShop={setShop} />;
      case "tax":
        // Nếu API không trả về taxInfo, hiện placeholder báo lỗi thay vì crash
        return shop.taxInfo ? <TaxInfo shop={shop} setShop={setShop} /> : <DataMissingPlaceholder />;
      case "legal":
        // Tương tự cho LegalInfo
        return shop.legalInfo ? <LegalInfo shop={shop} setShop={setShop} /> : <DataMissingPlaceholder />;
      default:
        return null;
    }
  }, [activeTab, shop]);

  if (loading || !shop) {
    return <SectionLoading message="Đang kết nối dữ liệu cửa hàng..." />;
  }

  const tabs = [
    { key: "basic", label: "Thông tin cơ bản", icon: Store },
    { key: "tax", label: "Thông tin Thuế", icon: FileText },
    { key: "legal", label: "Thông tin Định Danh", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-8xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Custom Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-[2rem] border border-gray-100 w-fit overflow-x-auto no-scrollbar shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={cn(
                  "flex items-center gap-2.5 px-7 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                  isActive
                    ? "bg-white text-gray-900 shadow-xl shadow-gray-200/50 ring-1 ring-black/5 scale-[1.05]"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                )}
              >
                <Icon size={16} className={isActive ? "text-orange-500" : "text-gray-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px] transition-all">
        {renderTabContent}
      </div>
    </div>
  );
}