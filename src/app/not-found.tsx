"use client";
import { CustomButton } from "@/components/button";
import { cn } from "@/utils/cn";
import { MoveLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center px-4 transition-colors duration-300 cherry-bomb-one-regular bg-gray-50 text-gray-900",
      )}
    >
      <div className="text-center">
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-orange-100">
          <Search className="h-16 w-16 text-(--color-mainColor) animate-pulse" />
          <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-lg">
            404
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">
          Trang không tìm thấy
        </h1>
        
        <p className="mx-auto mb-8 max-w-md text-base font-medium text-gray-500 md:text-lg">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển sang một địa chỉ khác.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <CustomButton
              variant="dark"
              className="h-12! px-8! hover:text-(--color-mainColor)! rounded-2xl! shadow-xl shadow-orange-200 uppercase tracking-widest font-semibold"
              icon={<MoveLeft size={18} />}
            >
              Quay về trang chủ
            </CustomButton>
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="text-sm  font-bold text-black cursor-pointer hover:text-(--color-mainColor) transition-colors uppercase tracking-tighter"
          >
            Tải lại trang
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -left-10 top-1/4 h-64 w-64 rounded-full bg-orange-400 blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 h-64 w-64 rounded-full bg-pink-400 blur-3xl" />
      </div>
    </div>
  );
}