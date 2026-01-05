"use client";

import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export const ChatLoginAlert = () => {
  const router = useRouter();

  return (
    <div className="mx-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
        <Lock size={20} />
      </div>
      
      <div className="flex-1">
        <h5 className="text-sm font-bold text-amber-900">Yêu cầu đăng nhập</h5>
        <p className="text-xs text-amber-700 mt-1 mb-3">
          Bạn cần đăng nhập để sử dụng tính năng chat và nhận hỗ trợ từ Shop.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 active:scale-95 transition-all"
        >
          <LogIn size={14} />
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};