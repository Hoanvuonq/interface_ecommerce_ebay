"use client";

import { cn } from "@/utils/cn";
import { Gift, Info, Settings, ShieldCheck, Trophy } from "lucide-react";
import React, { useCallback, useState } from "react";
import { ShopLoyaltyStatisticsCard } from "../../loyalty/_components";
import ProductPromotionList from "../../loyalty/_components/ProductPromotionList";
import ShopLoyaltyPolicyCard from "../../loyalty/_components/ShopLoyaltyPolicyCard";
import type { LoyaltyPolicyResponse } from "../../loyalty/_types/loyalty.types";

export const ShopLoyaltyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"policy" | "products">("policy");
  const [hasPolicy, setHasPolicy] = useState(false);
  const [promotionCount, setPromotionCount] = useState(0);

  const handlePolicyChange = useCallback(
    (policy: LoyaltyPolicyResponse | null) => {
      setHasPolicy(!!policy);
    },
    []
  );

  const handlePromotionCountUpdate = useCallback((count: number) => {
    setPromotionCount(count);
  }, []);

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-500 rounded-3xl text-white shadow-lg shadow-orange-200">
              <Trophy size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                Chương trình Điểm thưởng
              </h1>
              <p className="text-sm text-slate-400 font-medium italic mt-1">
                Gia tăng lòng trung thành và thúc đẩy doanh số bằng tích lũy
                điểm
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-5 py-3 bg-blue-50/50 rounded-2xl border border-blue-100">
            <ShieldCheck size={18} className="text-blue-500" />
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
              Hệ thống bảo mật & Tự động
            </span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <ShopLoyaltyStatisticsCard />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-150">
        <div className="flex border-b border-slate-50 px-8 pt-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("policy")}
              className={cn(
                "relative pb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === "policy"
                  ? "text-orange-600"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Settings size={16} />
              Chính sách Shop
              {hasPolicy && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {activeTab === "policy" && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full animate-in slide-in-from-bottom-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={cn(
                "relative pb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === "products"
                  ? "text-orange-600"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Gift size={16} />
              Khuyến mãi Sản phẩm
              {promotionCount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] rounded-full shadow-sm">
                  {promotionCount}
                </span>
              )}
              {activeTab === "products" && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full animate-in slide-in-from-bottom-1" />
              )}
            </button>
          </div>
        </div>

        <div className="p-8">
          <div
            className={cn(
              "mb-8 p-5 rounded-3xl border flex items-start gap-4 transition-colors",
              activeTab === "policy"
                ? "bg-orange-50/40 border-orange-100"
                : "bg-blue-50/40 border-blue-100"
            )}
          >
            <div
              className={cn(
                "mt-1 p-2 rounded-xl",
                activeTab === "policy"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-blue-100 text-blue-600"
              )}
            >
              <Info size={18} />
            </div>
            <div>
              <h4
                className={cn(
                  "text-sm font-bold uppercase tracking-tight",
                  activeTab === "policy" ? "text-orange-900" : "text-blue-900"
                )}
              >
                {activeTab === "policy"
                  ? "Quy tắc tích điểm mặc định"
                  : "Cấu hình riêng theo sản phẩm"}
              </h4>
              <p
                className={cn(
                  "text-xs mt-1 leading-relaxed font-medium",
                  activeTab === "policy"
                    ? "text-orange-800/70"
                    : "text-blue-800/70"
                )}
              >
                {activeTab === "policy"
                  ? "Thiết lập quy tắc tích điểm cho tất cả đơn hàng. Khách hàng sẽ dùng điểm tích lũy để được giảm giá cho lần mua sau."
                  : "Bạn có thể tạo các chương trình tích điểm đặc biệt cho từng sản phẩm. Lưu ý: Khuyến mãi này sẽ ghi đè chính sách chung."}
              </p>
            </div>
          </div>

          <div className="animate-in fade-in zoom-in-95 duration-500">
            {activeTab === "policy" ? (
              <ShopLoyaltyPolicyCard onPolicyChange={handlePolicyChange} />
            ) : (
              <ProductPromotionList
                onCountUpdate={handlePromotionCountUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
