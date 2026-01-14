"use client";

import { Sparkles, Globe } from "lucide-react";

export const HeaderContact = () => {
  return (
    <section className="relative bg-white border-b border-gray-50 overflow-hidden pt-12 pb-10">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f97316_1px,transparent_1px)] bg-size-[24px_24px] [radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-gray-100 text-orange-600 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={12} className="fill-orange-600" />
              <span>Kết nối toàn cầu</span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2">
                Liên hệ{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
                  với chúng tôi
                </span>
              </h1>
              <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                Chúng tôi hỗ trợ doanh nghiệp tối ưu hóa quy trình vận chuyển
                quốc tế với sự tận tâm cao nhất.
              </p>
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="relative w-64 h-40 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl shadow-orange-500/20 flex flex-col items-center justify-center text-white border border-gray-700 transform rotate-3 transition-transform hover:rotate-0 duration-500">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

              <Globe
                className="w-10 h-10 text-orange-500 mb-2"
                strokeWidth={1.5}
              />
              <h3 className="font-bold text-lg tracking-wider">EBAY EXPRESS</h3>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
                Global Logistics
              </p>
            </div>

            <div className="absolute inset-0 bg-orange-100 rounded-2xl -z-10 transform -rotate-6 scale-95 opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
};
