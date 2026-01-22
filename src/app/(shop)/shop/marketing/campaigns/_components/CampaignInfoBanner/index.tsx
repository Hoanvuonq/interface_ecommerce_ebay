"use client";

import React from "react";
import { Info } from "lucide-react";

export const CampaignInfoBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-2xl relative overflow-hidden group border border-slate-800">
      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-700">
        <Info className="w-32 h-32 text-white" />
      </div>

      <div className="shrink-0 w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/10">
        <Info className="w-7 h-7 text-white" />
      </div>

      <div className="relative z-10 flex-1">
        <h4 className="text-white font-bold text-xl tracking-tight">
          Chế độ vận hành chiến dịch
        </h4>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          Chương trình Flash Sale yêu cầu sự chính xác về kho hàng. Sản phẩm sau
          khi được <span className="text-orange-400 font-bold">APPROVED</span>
          sẽ được khóa số lượng tồn kho để đảm bảo quyền lợi người mua.
        </p>
        <div className="flex flex-wrap gap-4 mt-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Chờ duyệt: Có thể hủy
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Đã duyệt:
            Khóa dữ liệu
          </div>
        </div>
      </div>
    </div>
  );
};
