"use client";

import { Button } from "@/components/button";
import {
    ArrowRight,
    Home,
    ShoppingBag,
    ShoppingCart,
    Zap
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { CartFeatures } from "../CartFeatures";

export const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center all-center">
      <div className="w-full bg-white rounded-3xl shadow-custom border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="text-center pt-10 md:pt-16 pb-6 md:pb-10 px-6">
          <div className="relative inline-block mb-6 md:mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-full p-8 md:p-10 shadow-lg shadow-blue-200">
              <ShoppingCart
                className="w-12 h-12 md:w-16 md:h-16 text-white"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-2 border-4 border-white shadow-md">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Giỏ hàng của bạn đang trống
          </h2>

          <p className="text-gray-500 text-sm md:text-lg max-w-md mx-auto leading-relaxed">
            Có vẻ như bạn chưa chọn được món đồ ưng ý nào. Đừng bỏ lỡ hàng ngàn
            ưu đãi đang chờ đón bạn!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 md:mb-14 px-6 md:px-10">
          <Link href="/products" className="w-full sm:w-auto group">
            <Button
              variant="dark"
              className="w-full sm:px-10"
              icon={<ShoppingBag />}
              rightIcon={<ArrowRight className="group-hover:translate-x-1" />}
            >
              Mua sắm ngay
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:px-10"
              icon={<Home />}
            >
              Về trang chủ
            </Button>
          </Link>
        </div>

        <CartFeatures />
      </div>
    </div>
  );
};
