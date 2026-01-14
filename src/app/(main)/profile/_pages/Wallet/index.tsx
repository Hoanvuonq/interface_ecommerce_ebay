"use client";

import walletService from "@/services/wallet/wallet.service";
import type { WalletResponse, WalletType } from "@/types/wallet/wallet.types";
import React, { useEffect, useState } from "react";
import { WalletPageProps } from "../../_types/wallet";

import { Button } from "@/components/button/button";
import {
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiList,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { toast } from "sonner";
import { ChangePasswordModal } from "../../_components/ChangePasswordModal";
import { DepositHistoryList } from "../../_components/DepositHistoryList";
import { DepositModal } from "../../_components/DepositModal";
import { ForgotPasswordModal } from "../../_components/ForgotPasswordModal";
import { WithdrawTransactionList } from "../../_components/WithdrawTransactionList";
import { WithdrawalNotice } from "../../_components/WithdrawalNotice";
import { WithdrawalRequestList } from "../../_components/WithdrawalRequestList";
import { WithdrawalRequestModal } from "../../_components/WithdrawalRequestModal";
import { CreateWalletPrompt, WalletStatsCards } from "../../_components/wallet";
import { getStatusInfo } from "@/constants/status";
const WalletPage: React.FC<WalletPageProps> = ({
  userId,
  autoCreate = false,
  type,
}) => {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletNotFound, setWalletNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit-transactions");
  const [refreshKey, setRefreshKey] = useState(0);

  const [createWalletModalVisible, setCreateWalletModalVisible] =
    useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);


  const loadWallet = async (showModal: boolean = true) => {
    setLoading(true);
    try {
      let data: any;
      if (userId) {
        data = await walletService.getWalletByUserId(userId);
      } else {
        data = await walletService.getMyWallet(type);
      }

      let walletData: WalletResponse | null = null;
      if (Array.isArray(data)) {
        walletData = data[0];
      } else if (data && Array.isArray(data.data)) {
        walletData = data.data[0];
      } else {
        walletData = data;
      }

      if (!walletData) {
        throw { response: { status: 404 } };
      }

      setWallet(walletData);
      setWalletNotFound(false);

      if (
        walletData?.mustChangePassword === true &&
        walletData?.type === "SHOP"
      ) {
        setTimeout(() => {
          setChangePasswordModalVisible(true);
        }, 300);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setWalletNotFound(true);
        if (autoCreate && !userId) {
          setCreateWalletModalVisible(true);
        } else if (showModal && !userId) {
        }
      } else {
        setWalletNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet(true);
  }, [userId, type]);

  const handleCreateWallet = async (
    password: string,
    confirmPassword: string
  ) => {
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await walletService.createWallet({
        password,
        confirmPassword,
        type,
      });
      toast.success("Tạo ví thành công!");
      await loadWallet(false);
    } catch (error: any) {
      toast.error(error?.message || "Lỗi tạo ví");
    } finally {
      setLoading(false);
    }
  };

 

  const getWalletTitle = () => (type === "SHOP" ? "Ví Shop" : "Ví Của Tôi");
  const getWalletDescription = () =>
    type === "SHOP"
      ? "Quản lý doanh thu và thanh toán"
      : "Quản lý tài chính cá nhân - Nạp tiền và thanh toán";

  if (loading && !wallet && !walletNotFound) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-orange-500"></div>
        </div>
      </div>
    );
  }

  if (walletNotFound && !userId) {
    return (
      <CreateWalletPrompt
        type={type}
        onCreate={handleCreateWallet}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-orange-50/50 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {getWalletTitle()}
              {wallet && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    getStatusInfo(wallet.status).bg
                  } ${getStatusInfo(wallet.status).color} ${
                    getStatusInfo(wallet.status).border
                  }`}
                >
                  {getStatusInfo(wallet.status).text}
                </span>
              )}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {getWalletDescription()}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {wallet?.mustChangePassword === true && wallet?.type === "SHOP" ? (
              <button
                onClick={() => setChangePasswordModalVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <FiShield className="w-4 h-4" />
                <span className="relative">
                  Kích hoạt bảo mật
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </span>
              </button>
            ) : (
              <Button
                variant="edit"
                onClick={() => setChangePasswordModalVisible(true)}
                icon={<FiLock />}
              >
                Đổi mật khẩu
              </Button>
            )}
            <Button
              variant="edit"
              onClick={() => setForgotPasswordModalVisible(true)}
              icon={<FiShield />}
            >
              Quên mật khẩu?
            </Button>
          </div>
        </div>

        {wallet && (
          <WalletStatsCards
            wallet={wallet}
            type={type}
            onDeposit={() => setDepositModalVisible(true)}
            onWithdraw={() => setWithdrawalModalVisible(true)}
          />
        )}

        <div className="mt-6 bg-orange-50/50 border border-gray-100 rounded-xl p-4 flex gap-3 items-start text-sm text-orange-800">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-(--color-mainColor)" />
          <div className="space-y-1">
            <p className="font-semibold text-orange-700">Thông tin quan trọng:</p>
            <ul className="list-disc list-inside opacity-90 space-y-0.5">
              <li>
                <strong>Số dư khả dụng:</strong> Số tiền bạn có thể sử dụng ngay
                lập tức.
              </li>
              <li>
                <strong>Mật khẩu ví:</strong> Bảo mật tuyệt đối, dùng để xác
                thực mọi giao dịch.
              </li>
              {type === "SHOP" && (
                <li>
                  <strong>Số dư tạm giữ:</strong> Doanh thu từ đơn hàng đang xử
                  lý, sẽ được cộng vào khả dụng sau khi hoàn tất.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-125">
        <div className="border-b border-gray-100 px-6 bg-gray-50/30">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {[
              {
                id: "deposit-transactions",
                label: "Lịch sử nạp tiền",
                icon: FiClock,
              },
              {
                id: "withdraw-transactions",
                label: "Lịch sử rút tiền",
                icon: FiList,
              },
              {
                id: "withdrawal-requests",
                label: "Lệnh rút tiền",
                icon: FiDollarSign,
              },
              { id: "notice", label: "Quy định & Lưu ý", icon: FiAlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all relative ${
                  activeTab === tab.id
                    ? "border-(--color-mainColor) text-(--color-mainColor)"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
                }`}
              >
                <tab.icon
                  className={`w-4 h-4 transition-colors ${
                    activeTab === tab.id
                      ? "text-(--color-mainColor)"
                      : "text-gray-600 group-hover:text-gray-600"
                  }`}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "deposit-transactions" && (
            <div className="animate-fade-in">
              <DepositHistoryList
                key={`deposit-${refreshKey}`}
                walletType={type as WalletType}
              />
            </div>
          )}
          {activeTab === "withdraw-transactions" && (
            <div className="animate-fade-in">
              <WithdrawTransactionList
                key={`withdraw-tx-${refreshKey}`}
                walletType={type as WalletType}
              />
            </div>
          )}
          {activeTab === "withdrawal-requests" && (
            <div className="animate-fade-in">
              <WithdrawalRequestList key={`withdrawal-${refreshKey}`} />
            </div>
          )}
          {activeTab === "notice" && wallet && (
            <div className="animate-fade-in max-w-4xl mx-auto py-4">
              <WithdrawalNotice walletType={wallet.type} />
            </div>
          )}
        </div>
      </div>

      <DepositModal
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        onSuccess={() => {
          loadWallet(false);
          setRefreshKey((prev) => prev + 1);
        }}
        walletType={type}
      />

      {wallet && (
        <>
          <WithdrawalRequestModal
            visible={withdrawalModalVisible}
            onClose={() => setWithdrawalModalVisible(false)}
            onSuccess={() => {
              loadWallet(false);
              setRefreshKey((prev) => prev + 1);
            }}
            availableBalance={wallet.balance}
            walletType={type}
          />

          <ChangePasswordModal
            visible={changePasswordModalVisible}
            onClose={() => setChangePasswordModalVisible(false)}
            onSuccess={() => {
              loadWallet(false);
              setRefreshKey((prev) => prev + 1);
            }}
            wallet={wallet}
          />

          <ForgotPasswordModal
            visible={forgotPasswordModalVisible}
            onClose={() => setForgotPasswordModalVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export default WalletPage;
