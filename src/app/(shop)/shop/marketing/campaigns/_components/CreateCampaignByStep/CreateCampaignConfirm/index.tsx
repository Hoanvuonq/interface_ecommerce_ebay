"use client";

import React from "react";
import { CheckCircle, Calendar, Package, Layers, Info } from "lucide-react";
import { cn } from "@/utils/cn";

interface ICreateCampaignConfirmProps {
  form: any;
  selectedVariants: any;
}

export const CreateCampaignConfirm: React.FC<ICreateCampaignConfirmProps> = ({
  form,
  selectedVariants,
}) => {
  const selectedCount = Object.values(selectedVariants).filter(
    (v: any) => v.selected,
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white border border-slate-200 rounded-4xl overflow-hidden shadow-xl shadow-slate-100/50">
        <div className="p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl shadow-sm">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                  Xác nhận cấu hình
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Kiểm tra thông tin trước khi kích hoạt
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {form.bannerPreview && (
                <div className="group relative h-32 rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                  <img
                    src={form.bannerPreview}
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30 uppercase">
                      Campaign Visual
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2 text-orange-500">
                    <Info size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Tên chiến dịch
                    </p>
                  </div>
                  <p className="text-base font-bold text-slate-700 leading-tight">
                    {form.name}
                  </p>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2 text-blue-500">
                    <Calendar size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Thời gian áp dụng
                    </p>
                  </div>
                  <div className="text-[13px] font-bold text-slate-600 italic">
                    <p>{new Date(form.startDate).toLocaleString("vi-VN")}</p>
                    <p className="text-slate-300 ml-4 font-normal">đến</p>
                    <p>{new Date(form.endDate).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative flex-1 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] overflow-hidden text-white shadow-2xl shadow-slate-900/20">
                <Package
                  size={180}
                  className="absolute -right-10 -bottom-10 text-white/5 rotate-12"
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">
                      Quy mô Items
                    </p>
                    <div className="h-1 w-12 bg-orange-500 rounded-full mb-6" />
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-bold tracking-tighter text-orange-500">
                      {selectedCount}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase italic leading-none">
                        Biến thể
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Được lựa chọn
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 w-fit">
                    <Layers size={14} className="text-orange-400" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      Sẵn sàng kích hoạt
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
