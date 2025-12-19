"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CustomButton } from "@/components/button"; 
import Link from "next/link";
import { MoveLeft, Search } from "lucide-react";
import { cn } from "@/utils/cn";

export default function NotFoundPage() {
  const theme = useSelector((state: RootState) => state.theme.name);
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center px-4 transition-colors duration-300",
        theme === "dark" ? "bg-[#1f1f1f] text-white" : "bg-gray-50 text-gray-900"
      )}
    >
      <div className="text-center">
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-orange-100">
          <Search className="h-16 w-16 text-orange-600 animate-pulse" />
          <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-lg">
            404
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
          Lạc đường rồi!
        </h1>
        
        <p className="mx-auto mb-8 max-w-md text-base font-medium text-gray-500 md:text-lg">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển sang một địa chỉ khác.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <CustomButton
              variant="dark"
              className="h-12! px-8! rounded-2xl! shadow-xl shadow-orange-200 uppercase tracking-widest font-black"
              icon={<MoveLeft size={18} />}
            >
              Quay về trang chủ
            </CustomButton>
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-tighter"
          >
            Tải lại trang
          </button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -left-10 top-1/4 h-64 w-64 rounded-full bg-orange-400 blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 h-64 w-64 rounded-full bg-pink-400 blur-3xl" />
      </div>
    </div>
  );
}