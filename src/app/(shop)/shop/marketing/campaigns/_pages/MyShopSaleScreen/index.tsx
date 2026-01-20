"use client";

import React from "react";
import Image from "next/image";
import {
  Tag,
  Plus,
  Calendar,
  Zap,
  PauseCircle,
  PlayCircle,
  BarChart3,
  PackageOpen,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface MyShopSalesTabProps {
  myCampaigns: any[];
  selectedCampaign: any;
  selectedCampaignProducts: any[];
  onSelectCampaign: (campaign: any) => void;
  onToggleStatus: (e: React.MouseEvent, id: string, status: string) => void;
  onAddNew: () => void;
  onAddProducts: (campaignId: string) => void;
  formatPrice: (price: number) => string;
  getDisplayStatus: (campaign: any) => { label: string; color: string };
}

export const MyShopSaleScreen: React.FC<MyShopSalesTabProps> = ({
  myCampaigns,
  selectedCampaign,
  selectedCampaignProducts,
  onSelectCampaign,
  onToggleStatus,
  onAddNew,
  onAddProducts,
  formatPrice,
  getDisplayStatus,
}) => {
  const shopSales = myCampaigns.filter((c) => c.campaignType === "SHOP_SALE");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* LEFT COLUMN: CAMPAIGN LIST */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="font-bold text-2xl text-slate-900 uppercase tracking-tighter flex items-center gap-2 italic">
              Shop Sales
              <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold border border-orange-200 shadow-sm">
                {shopSales.length}
              </span>
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1">
              Store Marketing Protocol
            </p>
          </div>
          <button
            onClick={onAddNew}
            className="p-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 shadow-[0_8px_20px_-6px_rgba(249,115,22,0.5)] transition-all active:scale-90 group border-b-4 border-orange-700"
          >
            <Plus
              className="w-5 h-5 group-hover:rotate-90 transition-transform"
              strokeWidth={3}
            />
          </button>
        </div>

        {shopSales.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100 shadow-inner">
            <Tag className="w-12 h-12 mx-auto mb-4 text-orange-200" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-tighter">
              Mạng lưới khuyến mãi trống
            </p>
            <button
              onClick={onAddNew}
              className="mt-4 text-xs font-bold text-orange-500 hover:text-orange-600 uppercase tracking-widest transition-colors"
            >
              + Khởi tạo ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar p-1">
            {shopSales.map((campaign) => {
              const isSelected = selectedCampaign?.id === campaign.id;
              const status = getDisplayStatus(campaign);
              return (
                <div
                  key={campaign.id}
                  onClick={() => onSelectCampaign(campaign)}
                  className={cn(
                    "group relative bg-white rounded-3xl p-5 cursor-pointer transition-all duration-500 border-2 overflow-hidden",
                    isSelected
                      ? "border-orange-500 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)] scale-[1.02] z-10"
                      : "border-transparent shadow-sm hover:border-orange-200 hover:shadow-lg",
                  )}
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 group-hover:ring-orange-50 transition-all">
                      <Image
                        src={
                          campaign.bannerUrl || "https://picsum.photos/200/200"
                        }
                        alt={campaign.name}
                        fill
                        className="object-cover group-hover:scale-125 transition-transform duration-1000"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase mb-2 border shadow-sm",
                          status.color.includes("green")
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-orange-50 text-orange-600 border-orange-100",
                        )}
                      >
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        {status.label}
                      </div>
                      <h3 className="font-bold text-slate-900 truncate uppercase tracking-tighter text-sm italic">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-orange-500" />
                          {new Date(campaign.startDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(campaign.status === "ACTIVE" ||
                      campaign.status === "PAUSED") && (
                      <button
                        onClick={(e) =>
                          onToggleStatus(e, campaign.id, campaign.status)
                        }
                        className="p-2 bg-slate-900 text-white rounded-xl shadow-xl hover:bg-orange-500 transition-all active:scale-90"
                      >
                        {campaign.status === "PAUSED" ? (
                          <PlayCircle className="w-4 h-4" />
                        ) : (
                          <PauseCircle className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: ANALYTICS & PRODUCTS */}
      <div className="lg:col-span-8">
        {selectedCampaign ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full animate-in zoom-in-95 duration-500">
            {/* Header: Banner Area */}
            <div className="relative h-64 shrink-0 overflow-hidden">
              <Image
                src={
                  (selectedCampaign as any).bannerUrl ||
                  "https://picsum.photos/800/400"
                }
                alt="banner"
                fill
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-8 left-10 right-10 text-white">
                <div className="flex items-end justify-between gap-6">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/40">
                        Active Node
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold uppercase tracking-tighter italic drop-shadow-2xl">
                      {selectedCampaign.name}
                    </h2>
                    <p className="text-sm font-medium text-slate-300 line-clamp-1 opacity-90 max-w-lg">
                      {selectedCampaign.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onAddProducts(selectedCampaign.id)}
                    className="bg-white hover:bg-orange-500 hover:text-white text-slate-900 px-8 py-4 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center gap-3 whitespace-nowrap group"
                  >
                    <Plus className="w-4 h-4 stroke-[4px] group-hover:scale-125 transition-transform" />
                    Bơm sản phẩm
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    Product Performance Hub
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase ml-6">
                    Real-time inventory tracking
                  </p>
                </div>
              </div>

              {selectedCampaignProducts.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <PackageOpen className="w-10 h-10 text-orange-300" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Chưa có tài sản nào được đăng ký
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCampaignProducts.map((prod) => {
                    const sellRatio = (prod.stockSold / prod.stockLimit) * 100;
                    return (
                      <div
                        key={prod.id}
                        className="group flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-4xl hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1"
                      >
                        <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-md group-hover:rotate-3 transition-transform">
                          <Image
                            src={
                              prod.productThumbnail ||
                              "https://picsum.photos/100/100"
                            }
                            alt="thumb"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate uppercase italic tracking-tighter">
                            {prod.productName}
                          </h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-orange-600 font-bold text-lg tracking-tighter">
                              {formatPrice(prod.salePrice)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 line-through">
                              {formatPrice(prod.salePrice * 1.2)}
                            </span>
                          </div>

                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                              <span className="text-slate-400 italic">
                                Sold Intensity
                              </span>
                              <span className="text-orange-500">
                                {Math.round(sellRatio)}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className={cn(
                                  "h-full transition-all duration-1000 ease-out rounded-full",
                                  sellRatio > 80
                                    ? "bg-linear-to-r from-orange-500 to-red-500"
                                    : "bg-linear-to-r from-orange-400 to-orange-600",
                                )}
                                style={{ width: `${sellRatio}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                {prod.stockSold}{" "}
                                <span className="text-slate-300">/</span>{" "}
                                {prod.stockLimit} UNITS
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center group transition-colors hover:bg-orange-50/10">
            <div className="w-32 h-32 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mb-8 ring-8 ring-orange-50/50 group-hover:scale-110 transition-transform duration-700 shadow-xl shadow-orange-500/5">
              <MousePointerClick className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-slate-900 font-bold uppercase tracking-widest text-2xl italic">
              Protocol Offline
            </h3>
            <p className="max-w-sm mt-4 text-slate-400 text-sm font-medium leading-relaxed">
              Chọn một chiến dịch từ bảng điều khiển bên trái để kích hoạt
              module quản lý sản phẩm và theo dõi dòng tiền.
            </p>
            <div className="mt-8 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-orange-200 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
