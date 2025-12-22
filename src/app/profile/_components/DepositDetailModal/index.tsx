"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import walletService from "@/services/wallet/wallet.service";
import {
  WalletDepositResponse,
  WalletTransactionResponse,
} from "@/types/wallet/wallet.types";
import QRCode from "react-qr-code";
import {
  FiX,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast } from "sonner";
import { getStatusStyle, getTransactionLabel } from "@/constants/status";
import { Button } from "@/components/button/button";
import { X } from "lucide-react";

interface DepositDetailModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: WalletTransactionResponse | null;
}

export const DepositDetailModal: React.FC<DepositDetailModalProps> = ({
  visible,
  onClose,
  transaction,
}) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositDetail, setDepositDetail] =
    useState<WalletDepositResponse | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      if (transaction?.id) {
        loadDepositDetail(transaction.id);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible, transaction]);

  const loadDepositDetail = async (transactionId: string) => {
    try {
      setLoading(true);
      const response = await walletService.getTransactionById(transactionId);
      if (response.walletDepositPayment) {
        setDepositDetail(response.walletDepositPayment);
      } else {
        setDepositDetail(null);
      }
    } catch (error: any) {
      console.error("Cannot load deposit detail:", error);
      setDepositDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const isPaymentExpired = () => {
    if (!depositDetail?.expiresAt) return true;
    return new Date(depositDetail.expiresAt) < new Date();
  };

  const canRetryPayment = () => {
    return (
      transaction?.status === "PENDING" &&
      depositDetail?.qrCode &&
      !isPaymentExpired()
    );
  };

  if (!visible || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col overflow-hidden border border-gray-100 z-10 max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-orange-400 to-red-500"></div>

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <h3 className="text-xl font-bold text-gray-800">
            Chi tiết giao dịch
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-400 font-medium">
                Đang tải thông tin...
              </span>
            </div>
          ) : (
            transaction && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-2">
                      Thông tin chung
                    </h4>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mã giao dịch</p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-mono font-medium text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 truncate max-w-45"
                          title={transaction.id}
                        >
                          {transaction.id}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(transaction.id, "Mã giao dịch")
                          }
                          className="text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số tiền</p>
                        <span className="text-base font-bold text-green-600">
                          +{transaction.amount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(
                            transaction.status
                          )}`}
                        >
                          {getTransactionLabel(transaction.status)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Thời gian tạo
                      </p>
                      <span className="text-sm text-gray-800">
                        {new Date(transaction.createdDate).toLocaleString(
                          "vi-VN"
                        )}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nội dung</p>
                      <p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-100">
                        {transaction.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm h-full flex flex-col justify-center items-center text-center">
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Biến động số dư
                        </p>
                        <div className="flex items-center justify-center gap-3 text-sm">
                          <div className="text-gray-400 line-through decoration-gray-300">
                            {transaction.balanceBefore.toLocaleString("vi-VN")}
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {transaction.balanceAfter.toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>

                      {canRetryPayment() && depositDetail ? (
                        <div className="w-full mt-2">
                          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3 text-left">
                            <div className="flex items-start gap-2">
                              <FiAlertTriangle className="text-orange-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-orange-800">
                                  Thanh toán chưa hoàn tất
                                </p>
                                <p className="text-[11px] text-orange-700 leading-tight mt-1">
                                  Giao dịch này đang chờ thanh toán. Quét mã bên
                                  dưới để hoàn tất.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-inner inline-block">
                            <QRCode
                              value={depositDetail.qrCode || ""}
                              size={120}
                              style={{
                                height: "auto",
                                maxWidth: "100%",
                                width: "100%",
                              }}
                              viewBox={`0 0 256 256`}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2">
                            Hết hạn:{" "}
                            {new Date(
                              depositDetail.expiresAt
                            ).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      ) : isPaymentExpired() &&
                        transaction.status === "PENDING" ? (
                        <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg w-full border border-gray-100 text-gray-400">
                          <FiClock size={32} className="mb-2 opacity-50" />
                          <span className="text-xs">
                            Link thanh toán đã hết hạn
                          </span>
                        </div>
                      ) : transaction.status === "COMPLETED" ? (
                        <div className="flex flex-col items-center justify-center h-32 bg-green-50 rounded-lg w-full border border-green-100 text-green-600">
                          <FiCheckCircle size={40} className="mb-2" />
                          <span className="text-sm font-bold">
                            Giao dịch thành công
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg w-full border border-gray-100 text-gray-400">
                          <span className="text-xs">
                            Không có thông tin thanh toán
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {depositDetail && (
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      Thông tin chuyển khoản
                      <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        Mã: {depositDetail.depositPaymentId}
                      </span>
                    </h4>
                    <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ngân hàng</p>
                        <p className="text-sm font-bold text-gray-800">
                          MB Bank
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Số tài khoản
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono font-bold text-gray-800 tracking-wide">
                            {depositDetail.accountNumber}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                depositDetail.accountNumber || "",
                                "Số tài khoản"
                              )
                            }
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FiCopy size={12} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Chủ tài khoản
                        </p>
                        <p className="text-sm font-bold text-gray-800 uppercase">
                          {depositDetail.accountName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <Button variant="edit" onClick={onClose} icon={<X />}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
