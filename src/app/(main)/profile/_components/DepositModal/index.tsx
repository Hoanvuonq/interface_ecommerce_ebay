"use client";

import walletService from "@/services/wallet/wallet.service";
import {
  WalletDepositRequest,
  WalletDepositResponse,
  WalletType,
} from "@/types/wallet/wallet.types";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import QRCode from "react-qr-code";
import { FiX, FiCheck, FiInfo, FiCopy, FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  walletType: WalletType;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  visible,
  onClose,
  onSuccess,
  walletType,
}) => {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{
    amount?: string;
    description?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [depositResponse, setDepositResponse] =
    useState<WalletDepositResponse | null>(null);

  // --- Effects ---
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      if (!depositResponse) {
        setDescription(getDefaultDescription());
        setAmount("");
        setErrors({});
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible, depositResponse]);

  // --- Helpers ---
  const getDefaultDescription = () => {
    const now = new Date();
    const date = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
    return `Nap ${date}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setErrors({});
    setDepositResponse(null);
    onClose();
  };

  const validateForm = () => {
    const newErrors: { amount?: string; description?: string } = {};
    let isValid = true;
    const numAmount = parseInt(amount.replace(/,/g, ""), 10);

    if (!amount) {
      newErrors.amount = "Vui lòng nhập số tiền";
      isValid = false;
    } else if (isNaN(numAmount) || numAmount < 1000) {
      newErrors.amount = "Số tiền tối thiểu 1,000 VND";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
      isValid = false;
    } else if (description.length > 25) {
      newErrors.description = "Mô tả tối đa 25 ký tự";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const numAmount = parseInt(amount.replace(/,/g, ""), 10);
      const request: WalletDepositRequest = {
        amount: numAmount,
        description,
        walletType,
      };
      const response = await walletService.deposit(request);
      setDepositResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Tạo yêu cầu nạp tiền thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    toast.success("Đã xác nhận thanh toán! Vui lòng chờ hệ thống xử lý.");
    onSuccess?.();
    handleClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(value))) {
      const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setAmount(formatted);
      if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  if (!visible || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div
        className={`relative w-full bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col overflow-hidden border border-gray-100 z-10 ${
          depositResponse ? "max-w-xl" : "max-w-md"
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-orange-400 to-red-500"/>

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <h3 className="text-xl font-bold text-gray-800">
            {depositResponse ? "Thanh toán đơn nạp" : "Nạp tiền vào ví"}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {!depositResponse ? (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-gray-100 rounded-xl p-4 flex gap-3 shadow-sm">
                <div className="p-2 bg-white rounded-full text-orange-500 shadow-sm shrink-0 h-fit">
                  <FiInfo size={18} />
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-bold text-orange-800 mb-1">
                    Lưu ý khi nạp tiền
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-1 opacity-90 text-xs sm:text-sm">
                    <li>
                      Số tiền nạp tối thiểu: <strong>1,000 VND</strong>.
                    </li>
                    <li>
                      Nội dung chuyển khoản phải <strong>chính xác</strong>.
                    </li>
                    <li>Số tiền sẽ được cộng tự động sau 1-3 phút.</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Số tiền cần nạp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className={`w-full pl-4 pr-12 py-3 bg-gray-50 border rounded-xl text-lg font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.amount
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-gray-500 focus:ring-orange-100 group-hover:border-gray-300"
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm">
                      VND
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.amount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nội dung nạp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description)
                          setErrors((prev) => ({
                            ...prev,
                            description: undefined,
                          }));
                      }}
                      maxLength={25}
                      placeholder="Nhập nội dung"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.description
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-gray-500 focus:ring-orange-100 hover:border-gray-300"
                      }`}
                    />
                    <span className="absolute right-3 bottom-3 text-[10px] text-gray-600 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                      {description.length}/25
                    </span>
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="edit"
                    onClick={handleClose}
                    className="rounded-2xl"
                  >
                    Hủy bỏ
                  </Button>
                  <ButtonField
                    form="address-form"
                    htmlType="submit"
                    type="login"
                    disabled={loading}
                    className="flex w-40 items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
                  >
                    <span className="flex items-center gap-2">
                      {loading ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        "Tạo mã QR"
                      )}
                    </span>
                  </ButtonField>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-right">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full mb-2">
                  <FiCheck size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Yêu cầu đã được tạo!
                </h4>
                <p className="text-sm text-gray-500">
                  Quét mã bên dưới để thanh toán ngay
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                  {depositResponse.qrCode ? (
                    <>
                      <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-inner">
                        <QRCode
                          value={depositResponse.qrCode}
                          size={160}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                      <p className="mt-3 text-xs font-medium text-gray-600 text-center">
                        Hết hạn lúc:{" "}
                        {new Date(depositResponse.expiresAt).toLocaleTimeString(
                          "vi-VN",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    </>
                  ) : (
                    <div className="w-full h-40 bg-gray-50 rounded-xl flex items-center justify-center text-center p-4 text-xs text-gray-600 border border-dashed border-gray-300">
                      Không tải được QR Code
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Ngân hàng</span>
                      <span className="font-bold text-gray-800">MB Bank</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Số tài khoản</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900 tracking-wide">
                          {depositResponse.accountNumber}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              depositResponse.accountNumber || "",
                              "Số tài khoản"
                            )
                          }
                          className="text-orange-500 hover:bg-orange-50 p-1 rounded transition-colors"
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Chủ tài khoản</span>
                      <span className="font-bold text-gray-900 uppercase">
                        {depositResponse.accountName}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Số tiền</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {depositResponse.amount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-sm">
                      <span className="text-gray-500 mt-1">Nội dung</span>
                      <div className="flex items-center gap-2 max-w-35 justify-end">
                        <span className="font-mono font-bold text-gray-900 text-right wrap-break-words">
                          {(depositResponse as any).description || description}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              (depositResponse as any).description ||
                                description,
                              "Nội dung chuyển khoản"
                            )
                          }
                          className="text-orange-500 hover:bg-orange-50 p-1 rounded transition-colors shrink-0"
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 italic text-center px-2">
                    *Lưu ý: Nhập chính xác nội dung chuyển khoản để được cộng
                    tiền tự động.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Để sau
                </button>
                <button
                  onClick={handlePaymentComplete}
                  className="flex-2 py-3 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                >
                  Đã chuyển khoản
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
