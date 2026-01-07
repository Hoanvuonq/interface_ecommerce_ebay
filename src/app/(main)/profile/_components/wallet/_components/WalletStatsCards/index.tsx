"use client";

import React from "react";
import {
  FiPlus,
  FiMinus,
  FiCreditCard,
  FiActivity,
  FiArrowUpRight,
  FiArrowDownLeft,
} from "react-icons/fi";
import { WalletResponse, WalletType } from "@/types/wallet/wallet.types";
import { CircleDollarSignIcon } from "lucide-react";

interface WalletStatsCardsProps {
  wallet: WalletResponse;
  type: WalletType | string;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export const WalletStatsCards: React.FC<WalletStatsCardsProps> = ({
  wallet,
  type,
  onDeposit,
  onWithdraw,
}) => {
  const isShop = type === "SHOP";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="lg:col-span-2 bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 relative overflow-hidden group">
        <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
          <CircleDollarSignIcon size={140} />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full min-h-40">
          <div>
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <div className="p-1 bg-white/20 rounded-md backdrop-blur-sm">
                <FiCreditCard size={14} />
              </div>
              <span className="text-sm font-medium">Số dư khả dụng</span>
            </div>
            <div className="text-4xl font-bold tracking-tight mt-1">
              {wallet.balance.toLocaleString("vi-VN")}
              <span className="text-xl font-normal ml-1.5 opacity-80">VND</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onDeposit}
              disabled={wallet.status !== "ACTIVE"}
              className="bg-white text-orange-600 hover:bg-orange-50 py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FiPlus className="w-4 h-4" /> Nạp tiền
            </button>
            <button
              onClick={onWithdraw}
              disabled={wallet.status !== "ACTIVE" || wallet.balance < 1000}
              className="bg-orange-700/40 hover:bg-orange-700/60 text-white backdrop-blur-md py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm font-medium transition-all border border-white/20 hover:border-white/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMinus className="w-4 h-4" /> Rút tiền
            </button>
          </div>
        </div>
      </div>

      {/* 2. Total Deposited (Clean White Style) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
              <FiArrowDownLeft size={20} />
            </div>
            <span className="text-gray-500 text-sm font-medium">
              Tổng đã nạp
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {wallet.totalDeposited.toLocaleString("vi-VN")}
            <span className="text-sm text-gray-600 font-normal ml-1">VND</span>
          </div>
          <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Total Withdrawn / Temp Balance (Logic Swapping) */}
      {isShop ? (
        // Shop View: Show Temporary Balance
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm">
                <FiActivity size={20} />
              </div>
              <span className="text-gray-500 text-sm font-medium">
                Số dư tạm giữ
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {wallet.temporaryBalance.toLocaleString("vi-VN")}
              <span className="text-sm text-gray-600 font-normal ml-1">
                VND
              </span>
            </div>
            <p className="text-xs text-orange-500 mt-2 font-medium bg-orange-50 py-1 px-2 rounded-md inline-block">
              Đang xử lý từ đơn hàng
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-sm">
                <FiArrowUpRight size={20} />
              </div>
              <span className="text-gray-500 text-sm font-medium">
                Tổng đã rút
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {wallet.totalWithdrawn.toLocaleString("vi-VN")}
              <span className="text-sm text-gray-600 font-normal ml-1">
                VND
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-pink-500 h-full rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
