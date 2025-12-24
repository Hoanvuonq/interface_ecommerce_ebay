"use client";

import React, { useState } from "react";
import { ButtonField, InputField } from "@/components"; // Import InputField của bạn
import { WalletType } from "@/types/wallet/wallet.types";
import { PlusIcon, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { Design } from "../Design";

interface CreateWalletPromptProps {
  type: WalletType;
  onCreate: (password: string, confirmPassword: string) => Promise<void>;
  loading?: boolean;
}

export const CreateWalletPrompt: React.FC<CreateWalletPromptProps> = ({
  type,
  onCreate,
  loading = false,
}) => {
  const isShop = type === "SHOP";

  const [isCreating, setIsCreating] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    await onCreate(password, confirmPassword);
  };

  const handleBack = () => {
    setIsCreating(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="flex items-center justify-center p-4 w-full h-full animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-orange-400 to-red-500"></div>

        {!isCreating ? (
          <div className="text-center animate-fade-in">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
            <Design />
            <div className="relative mx-auto w-20 h-20 mb-6 group">
              <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-full h-full bg-linear-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center ring-4 ring-white shadow-md transform group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-orange-500"
                  >
                    <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                    <path
                      fillRule="evenodd"
                      d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3 tracking-tight uppercase">
              {isShop ? "Kích hoạt Ví Shop" : "Bạn chưa có Ví"}
            </h2>

            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
              {isShop
                ? "Tạo ví shop ngay để nhận doanh thu, quản lý dòng tiền và rút tiền nhanh chóng."
                : "Tạo ví ngay để bắt đầu nạp tiền, thanh toán tiện lợi và nhận nhiều ưu đãi."}
            </p>

            <ButtonField
              type="login"
              onClick={() => setIsCreating(true)}
              className="h-11 px-8 rounded-full text-sm font-semibold w-auto m-auto shadow-orange-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4 text-white" />
                Tạo Ví Ngay
              </span>
            </ButtonField>
          </div>
        ) : (
          <div className="animate-fade-in-up text-left">
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2 text-gray-500 hover:text-gray-800"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-gray-800">
                Thiết lập mật khẩu
              </h3>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-6 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800 font-medium leading-relaxed">
                Mật khẩu này dùng để xác thực khi <strong>rút tiền</strong> và{" "}
                <strong>giao dịch</strong>. Vui lòng ghi nhớ và không chia sẻ
                cho người khác!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-1">
              <InputField
                label="Mật khẩu ví"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                rules={[{ required: true }]}
                inputClassName="bg-gray-50 focus:bg-white"
              />

              <InputField
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                rules={[{ required: true }]}
                inputClassName="bg-gray-50 focus:bg-white"
              />

              {error && (
                <p className="text-sm text-red-500 font-medium animate-shake mb-4">
                  {error}
                </p>
              )}

              <div className="pt-4">
                <ButtonField
                  type="login"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading || !password || !confirmPassword}
                  className="h-12 w-full rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? "Đang tạo ví..." : "Hoàn tất tạo ví"}
                </ButtonField>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
