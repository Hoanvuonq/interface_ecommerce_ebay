"use client";

import React, { useState, useEffect } from "react";
import walletConfigService from "@/services/wallet/walletConfig.service";
import { WalletWithdrawalConfigResponse } from "@/types/wallet/walletConfig.types";
import { WalletType } from "@/types/wallet/wallet.types";
import { motion } from "framer-motion";
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiInfo, 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiCreditCard 
} from "react-icons/fi";

interface WithdrawalNoticeProps {
  walletType: WalletType;
}

export const WithdrawalNotice: React.FC<WithdrawalNoticeProps> = ({
  walletType,
}) => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<WalletWithdrawalConfigResponse | null>(
    null
  );

  useEffect(() => {
    loadConfig();
  }, [walletType]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const typeConfig = await walletConfigService.getConfigByWalletType(
        walletType
      );
      setConfig(typeConfig);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setConfig(null);
      } else {
        console.error("Failed to load withdrawal config:", error);
      }
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const getWalletTypeLabel = (type: WalletType): string => {
    const labels: Record<WalletType, string> = {
      BUYER: "Người mua",
      SHOP: "Người bán",
      PLATFORM: "Sàn",
    };
    return labels[type] || type;
  };

  const getSettlementRuleText = (rule: string): string => {
    const texts: Record<string, string> = {
      ONLY_ON_SETTLEMENT_DAY:
        "Chỉ được rút tiền vào ngày thanh toán (các ngày khác không được rút)",
      NEVER_ON_SETTLEMENT_DAY:
        "Không được rút tiền vào ngày thanh toán (chỉ được rút vào các ngày khác)",
      ANY_DAY:
        "Có thể rút tiền bất kỳ lúc nào (không có giới hạn về ngày thanh toán)",
    };
    return texts[rule] || rule;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-100 rounded-xl w-full"></div>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="h-14 bg-gray-50 border-b border-gray-100"></div>
            <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
        </div>
        <div className="h-32 bg-gray-100 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
    >
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full h-fit shadow-sm">
            <FiCreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-blue-900">
              Yêu cầu bắt buộc trước khi rút tiền
            </h4>
            <div className="text-sm text-blue-800/90 leading-relaxed space-y-1">
              <p>Bạn cần thêm tài khoản ngân hàng trước khi thực hiện giao dịch:</p>
              <ul className="list-disc list-inside ml-1 space-y-1 marker:text-blue-400">
                <li>
                  Truy cập <strong>"Quản lý tài khoản ngân hàng"</strong> để thêm mới.
                </li>
                <li>
                  Thiết lập một tài khoản làm <strong>mặc định</strong> để nhận tiền.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {!config ? (
        <motion.div 
            initial={{ scale: 0.98 }} animate={{ scale: 1 }}
            className="bg-green-50 border border-green-100 rounded-2xl p-6 flex gap-4 items-center shadow-sm"
        >
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
             <FiCheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-green-800 mb-1">
              Không có giới hạn rút tiền
            </h4>
            <p className="text-sm text-green-700">
              Bạn có thể rút tiền không giới hạn số lần và số tiền mỗi ngày.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden ring-1 ring-black/5">
          <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiInfo className="text-blue-500" />
                Cấu hình rút tiền áp dụng
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
              {getWalletTypeLabel(walletType)}
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Daily Count */}
            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-orange-50 rounded-lg text-orange-500 h-fit">
                    <FiClock className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Số lần rút / ngày</p>
                    <p className="font-medium text-gray-900">
                        {(config.dailyWithdrawalCountLimit ?? 0) > 0 ? (
                            <span className="text-orange-600 font-bold text-lg">
                                {config.dailyWithdrawalCountLimit} lần
                            </span>
                        ) : (
                            <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Không giới hạn</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-green-50 rounded-lg text-green-500 h-fit">
                    <FiDollarSign className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hạn mức rút / ngày</p>
                    <p className="font-medium text-gray-900">
                        {(config.dailyWithdrawalAmountLimit ?? 0) > 0 ? (
                            <span className="text-green-700 font-bold text-lg">
                                {config.dailyWithdrawalAmountLimit?.toLocaleString("vi-VN")} <span className="text-sm font-normal text-gray-500">VND</span>
                            </span>
                        ) : (
                            <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Không giới hạn</span>
                        )}
                    </p>
                </div>
            </div>

            {walletType === "SHOP" && (config.settlementDay ?? 0) > 0 && (
              <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex gap-4">
                    <div className="mt-1 p-2 bg-purple-50 rounded-lg text-purple-500 h-fit">
                        <FiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ngày thanh toán định kỳ</p>
                        <p className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-md w-fit">
                            Ngày {config.settlementDay} hàng tháng
                        </p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="mt-1 p-2 bg-red-50 rounded-lg text-red-500 h-fit">
                        <FiAlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Quy tắc rút tiền ngày thanh toán</p>
                        <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                            {getSettlementRuleText(config.settlementWithdrawalRule || "ANY_DAY")}
                        </p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs">?</span>
                Hướng dẫn rút tiền
            </h3>
            <ol className="space-y-3 text-sm text-gray-600 relative border-l-2 border-gray-200 ml-2 pl-4">
                <li className="relative">
                    <span className="absolute -left-5.25 top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                    Nhấn nút <strong className="text-gray-900">"Rút tiền"</strong> ở phía trên cùng.
                </li>
                <li className="relative">
                    <span className="absolute -left-5.25 top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                    Nhập số tiền muốn rút (lưu ý hạn mức khả dụng).
                </li>
                <li className="relative">
                    <span className="absolute -left-5.25 top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                    Nhập mật khẩu ví để xác thực bảo mật.
                </li>
                <li className="relative">
                    <span className="absolute -left-5.25 top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                    Chờ Admin phê duyệt (thường từ 1-3 ngày làm việc).
                </li>
            </ol>
         </div>

         {/* Additional Notes */}
         <div className="bg-orange-50/50 border border-gray-100 rounded-2xl p-6">
            <h3 className="text-base font-bold text-orange-900 mb-4 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-orange-600" />
                Lưu ý quan trọng
            </h3>
            <ul className="space-y-2 text-sm text-orange-800/80 list-disc list-outside ml-4 marker:text-orange-400">
                <li>Hạn mức được tính lại sau <strong>00:00</strong> mỗi ngày.</li>
                <li>Hệ thống sẽ tự động từ chối nếu số dư không đủ.</li>
                {walletType === 'SHOP' && config && (config.settlementDay ?? 0) > 0 && (
                    <li className="font-semibold text-red-600">
                        Vui lòng chú ý quy tắc rút tiền vào ngày thanh toán ({config.settlementDay}) để tránh bị từ chối.
                    </li>
                )}
                <li>
                    Liên hệ CSKH nếu lệnh rút tiền quá 3 ngày chưa được xử lý.
                </li>
            </ul>
         </div>
      </div>
    </motion.div>
  );
};