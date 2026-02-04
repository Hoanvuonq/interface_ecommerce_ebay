"use client";

import { useEffect } from "react";
import Link from "next/link";
import _ from "lodash";
import {
  Store,
  Clock,
  AlertTriangle,
  ChevronRight,
  Home,
  Edit3,
  FileWarning,
  ArrowLeft,
} from "lucide-react";
import { SectionLoading } from "@/components";
import { useShopCheck } from "../_hooks/useShopCheck";

export default function ShopCheckPage() {
  const { status, verificationInfo, redirectPath, sectionName, router } =
    useShopCheck();

  useEffect(() => {
    if (status === "verified") {
      router.push("/shop");
    }
  }, [status, router]);

  if (status === "checking" || status === "verified") {
    return <SectionLoading size="lg" className="h-screen" message="Đang kiểm tra hồ sơ..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-150 h-150 rounded-full bg-orange-100/40 blur-3xl animate-pulse-slow" />
        <div className="absolute top-[30%] -right-[10%] w-125 h-125 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      <div className="max-w-120 w-full relative z-10">
        {status === "no-shop" && (
          <div className="bg-white rounded-4xl shadow-2xl shadow-orange-100/50 p-8 md:p-10 border border-white/60 backdrop-blur-sm text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-linear-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-100/50 relative group">
              <div className="absolute inset-0 bg-orange-200/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Store
                className="w-12 h-12 text-orange-600 relative z-10"
                strokeWidth={1.5}
              />
            </div>

            <h1 className="text-2xl font-bold  text-gray-900 mb-3 tracking-tight">
              Bắt đầu hành trình kinh doanh
            </h1>
            <p className=" text-gray-500 leading-relaxed mb-8 text-sm md:text-base">
              Bạn chưa có cửa hàng nào. Hãy tạo hồ sơ ngay để bắt đầu đăng bán
              sản phẩm và tiếp cận hàng triệu khách hàng.
            </p>

            <div className="space-y-3">
              <Link href="/shop/onboarding" className="block">
                <button className="w-full py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Tạo cửa hàng mới{" "}
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>
              </Link>

              <Link href="/" className="block">
                <button className="w-full py-4  text-gray-500 hover:text-orange-600 hover:bg-orange-50/50 rounded-2xl font-medium transition-all text-sm flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Quay lại trang chủ
                </button>
              </Link>
            </div>
          </div>
        )}

        {status === "pending" && (
          <div className="bg-white rounded-4xl shadow-2xl shadow-orange-100/50 p-8 md:p-10 border border-white/60 backdrop-blur-sm text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-linear-to-br from-yellow-50 to-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-100/50 relative">
              <div className="absolute inset-0 bg-orange-100/40 rounded-3xl animate-pulse" />
              <Clock
                className="w-12 h-12 text-orange-500 relative z-10"
                strokeWidth={1.5}
              />
            </div>

            <h1 className="text-2xl font-bold  text-gray-900 mb-3 tracking-tight">
              Đang chờ phê duyệt
            </h1>
            <p className=" text-gray-500 leading-relaxed mb-8 text-sm md:text-base bg-orange-50/50 p-4 rounded-2xl border border-gray-100/50">
              {verificationInfo?.message ||
                "Hồ sơ của bạn đang được đội ngũ admin xem xét. Quá trình này thường mất từ 1-2 ngày làm việc. Vui lòng kiểm tra lại sau."}
            </p>

            <Link href="/" className="block">
              <button className="w-full py-4 bg-white border border-slate-200  text-gray-600 hover:text-orange-600 hover:border-gray-200 hover:bg-orange-50/30 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow-md">
                <Home
                  size={18}
                  className=" text-gray-400 group-hover:text-orange-500 transition-colors"
                />
                Về trang chủ
              </button>
            </Link>
          </div>
        )}

        {status === "needs-update" && (
          <div className="bg-white rounded-4xl shadow-2xl shadow-orange-100/50 overflow-hidden border border-white/60 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="p-8 md:p-10 pb-6 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100/50">
                <FileWarning
                  className="w-10 h-10 text-red-500"
                  strokeWidth={1.5}
                />
              </div>

              <h1 className="text-xl md:text-2xl font-bold  text-gray-900 mb-2 tracking-tight">
                Cần bổ sung thông tin
              </h1>
              <p className=" text-gray-500 text-sm">
                {verificationInfo?.message ||
                  "Vui lòng cập nhật lại hồ sơ theo yêu cầu bên dưới để tiếp tục."}
              </p>
            </div>

            {!_.isEmpty(verificationInfo?.rejectedReasons) && (
              <div className="px-6 md:px-8 pb-6">
                <div className="bg-red-50/40 border border-red-100/60 rounded-2xl p-4 md:p-5">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-3">
                    <AlertTriangle size={14} /> Yêu cầu sửa đổi
                  </div>

                  <div className="space-y-2.5 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
                    {_.map(
                      verificationInfo?.rejectedReasons,
                      (reason, section) => (
                        <div
                          key={section}
                          className="bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-red-100/50 shadow-sm flex flex-col gap-1"
                        >
                          <span className="text-xs font-bold text-red-600 uppercase tracking-tight flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                            {section === "BASIC_INFO" && "Thông tin cơ bản"}
                            {section === "LEGAL_INFO" && "Pháp lý"}
                            {section === "TAX_INFO" && "Thuế"}
                            {section === "SHOP" && "Thông tin chung"}
                          </span>
                          <span className="text-sm  text-gray-700 leading-snug pl-3 border-l-2 border-red-100">
                            {reason}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 pt-0 bg-white border-t border-slate-50 flex flex-col gap-3">
              <Link href={redirectPath} className="block">
                <button className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-200">
                  <Edit3 size={18} /> Cập nhật {sectionName}
                </button>
              </Link>
              <Link href="/" className="block">
                <button className="w-full py-3.5  text-gray-500 hover:text-orange-600 hover:bg-orange-50/30 rounded-xl font-medium transition-colors text-sm">
                  Để sau, về trang chủ
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
