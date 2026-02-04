"use client";

import walletService from "@/services/wallet/wallet.service";
import type { WalletResponse, WalletType } from "@/types/wallet/wallet.types";
import React, { useEffect, useState, useMemo } from "react";
import { WalletPageProps } from "../../_types/wallet";

import { Button } from "@/components";
import { useToast } from "@/hooks/useToast";
import {
  ChangePasswordModal,
  DepositHistoryList,
  DepositModal,
  ForgotPasswordModal,
  WithdrawTransactionList,
  WithdrawalNotice,
  WithdrawalRequestList,
  WithdrawalRequestModal,
} from "../../_components";
import { CreateWalletPrompt, WalletStatsCards } from "../../_components/wallet";
import { getStatusInfo } from "@/constants/status";
import { StatusTabs, StatusTabItem } from "@/app/(shop)/shop/_components"; // 🟢 Import StatusTabs
import {
  Clock,
  History,
  DollarSign,
  AlertCircle,
  Lock,
  Shield,
  AlertTriangle,
} from "lucide-react"; // 🟢 Chuyển sang Lucide icons cho đồng bộ
import { cn } from "@/utils/cn";

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

  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);

  const { error: toastError, success: toastSuccess } = useToast();

  // 🟢 Cấu hình các Tabs cho Wallet
  const walletTabs = useMemo(
    (): StatusTabItem<string>[] => [
      {
        key: "deposit-transactions",
        label: "Lịch sử nạp tiền",
        icon: Clock,
      },
      {
        key: "withdraw-transactions",
        label: "Lịch sử rút tiền",
        icon: History,
      },
      {
        key: "withdrawal-requests",
        label: "Lệnh rút tiền",
        icon: DollarSign,
      },
      {
        key: "notice",
        label: "Quy định & Lưu ý",
        icon: AlertCircle,
      },
    ],
    [],
  );

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

      if (!walletData) throw { response: { status: 404 } };

      setWallet(walletData);
      setWalletNotFound(false);

      if (
        walletData?.mustChangePassword === true &&
        walletData?.type === "SHOP"
      ) {
        setTimeout(() => setChangePasswordModalVisible(true), 300);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
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
    confirmPassword: string,
  ) => {
    if (password.length < 6) {
      toastError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    try {
      await walletService.createWallet({ password, confirmPassword, type });
      toastSuccess("Tạo ví thành công!");
      await loadWallet(false);
    } catch (error: any) {
      toastError(error?.message || "Lỗi tạo ví");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !wallet && !walletNotFound) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-orange-500"></div>
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
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-custom border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-orange-50/50 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter">
              {type === "SHOP" ? "Ví Shop" : "Ví Của Tôi"}
              {wallet && (
                <span
                  className={cn(
                    "px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-widest",
                    getStatusInfo(wallet.status).bg,
                    getStatusInfo(wallet.status).color,
                    getStatusInfo(wallet.status).border,
                  )}
                >
                  {getStatusInfo(wallet.status).text}
                </span>
              )}
            </h2>
            <p className="text-gray-400 text-xs font-medium mt-1 uppercase tracking-wider">
              {type === "SHOP"
                ? "Quản lý doanh thu và thanh toán"
                : "Quản lý tài chính cá nhân"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {wallet?.mustChangePassword === true && wallet?.type === "SHOP" ? (
              <button
                onClick={() => setChangePasswordModalVisible(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white rounded-2xl text-xs font-bold uppercase transition-all shadow-sm group"
              >
                <Shield className="w-4 h-4 group-hover:animate-bounce" />
                <span>Kích hoạt bảo mật</span>
              </button>
            ) : (
              <Button
                variant="edit"
                onClick={() => setChangePasswordModalVisible(true)}
                icon={<Lock size={16} />}
                className="rounded-2xl uppercase text-[10px] tracking-widest font-bold h-11!"
              >
                Đổi mật khẩu
              </Button>
            )}
            <Button
              variant="edit"
              onClick={() => setForgotPasswordModalVisible(true)}
              icon={<AlertTriangle size={16} />}
              className="rounded-2xl uppercase text-[10px] tracking-widest font-bold h-11!"
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
      </div>

      {/* 🟢 Tabs & Content Section - Thay đổi ở đây */}
      <div className="space-y-6">
        <StatusTabs
          tabs={walletTabs}
          current={activeTab}
          onChange={setActiveTab}
          layoutId="wallet-management-tabs"
          className="px-0"
        />

        <div className="bg-white rounded-3xl shadow-custom border border-gray-100 overflow-hidden min-h-125">
          <div className="p-6">
            {activeTab === "deposit-transactions" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DepositHistoryList
                  key={`deposit-${refreshKey}`}
                  walletType={type as WalletType}
                />
              </div>
            )}
            {activeTab === "withdraw-transactions" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <WithdrawTransactionList
                  key={`withdraw-tx-${refreshKey}`}
                  walletType={type as WalletType}
                />
              </div>
            )}
            {activeTab === "withdrawal-requests" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <WithdrawalRequestList key={`withdrawal-${refreshKey}`} />
              </div>
            )}
            {activeTab === "notice" && wallet && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto py-4">
                <WithdrawalNotice walletType={wallet.type} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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
