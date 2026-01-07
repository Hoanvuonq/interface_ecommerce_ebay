"use client";
import React, { useCallback, useEffect, useState } from "react";
import { SectionLoading, SimpleModal } from "@/components";
import { formatPrice } from "@/hooks/useFormatPrice";
import { paymentService } from "@/services/payment/payment.service";
import { PayOSPaymentResponse, PayOSPaymentStatusResponse} from "@/types/payment/payment.types";
import { isAuthenticated } from "@/utils/local.storage";
import { PayOSQRPaymentProps } from "./type";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  RotateCw,
  X,
} from "lucide-react";

export const PayOSQRPayment: React.FC<PayOSQRPaymentProps> = ({
  orderId,
  orderNumber,
  amount,
  onCancelPayment,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(true);
  const [payOSData, setPayOSData] = useState<PayOSPaymentResponse | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "failed" | "checking">("pending");
  const [verifying, setVerifying] = useState(false);

  const loadPayOSData = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getPayOSPaymentInfo(orderId);
      setPayOSData(data);
    } catch (error: any) {
      alert("Không thể tải thông tin thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayOSData();
  }, [orderId]);

  const verifyPayment = useCallback(async () => {
    if (verifying) return;

    setVerifying(true);
    try {
      if (!isAuthenticated()) {
        alert("Vui lòng đăng nhập để kiểm tra thanh toán");
        setVerifying(false);
        return;
      }

      const result = await paymentService.verifyPaymentStatus(orderId);

      if (result.status === "SUCCEEDED" || result.status === "SUCCESS") {
        setPaymentStatus("paid");
        onRefresh?.();
      } else {
        setPaymentStatus("pending");
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        alert(error?.response?.data?.message || "Không thể xác nhận thanh toán. Vui lòng thử lại sau.");
      }
      setPaymentStatus("pending");
    } finally {
      setVerifying(false);
    }
  }, [orderId, verifying, onRefresh]);

  const checkPaymentStatus = useCallback(async () => {
    if (!payOSData?.orderCode) return;

    try {
      const statusData: PayOSPaymentStatusResponse =
        await paymentService.checkPayOSPaymentStatus(payOSData.orderCode);

      if (statusData.status === "PAID") {
        setPaymentStatus("checking");
        await verifyPayment();
      } else if (
        statusData.status === "CANCELLED" ||
        statusData.status === "FAILED"
      ) {
        setPaymentStatus("failed");
      } else {
        setPaymentStatus("pending");
      }
    } catch (error: any) {
      console.error("Failed to check PayOS payment status:", error);
    }
  }, [payOSData?.orderCode, verifyPayment]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCancelPayment = async () => {
    setCancelling(true);
    try {
      await paymentService.cancelPaymentByOrder(orderId);
      setShowCancelModal(false);
      onCancelPayment?.();
      onRefresh?.();
    } catch (error: any) {
      console.error("Failed to cancel payment:", error);
      alert(error?.response?.data?.message || "Không thể hủy thanh toán");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) { return <SectionLoading message="Đang tải thông tin thanh toán..." />}

  if (paymentStatus === "paid") {
    return (
      <div className="rounded-2xl border-0 shadow-sm bg-linear-to-r from-green-50 to-emerald-50 p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-green-700">
              Thanh toán thành công!
            </h3>
            <div className="text-gray-700">
              Đơn hàng{" "}
              <span className="font-bold text-blue-600">#{orderNumber}</span> đã
              được thanh toán thành công.
            </div>
            <div className="text-gray-600 text-sm">
              Số tiền:{" "}
              <span className="font-bold text-red-600 text-base">
                {formatPrice(amount)}
              </span>
            </div>
            <p className="text-gray-500 text-xs pt-2">
              Đơn hàng của bạn đang được xử lý và sẽ được giao đến bạn sớm nhất.
            </p>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={onRefresh}
              className="w-full py-3 px-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              Xem chi tiết đơn hàng
            </button>
            <button
              onClick={onCancelPayment}
              className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "checking" || verifying) {
    return (
      <div className="rounded-2xl border-0 shadow-sm bg-linear-to-r from-yellow-50 to-orange-50 p-8">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <RotateCw size={40} className="text-orange-500 mb-6 animate-spin" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Đang xác nhận thanh toán...
          </h4>
          <span className="text-gray-500 text-sm">
            Vui lòng đợi trong giây lát
          </span>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="rounded-2xl border-0 shadow-sm bg-linear-to-r from-red-50 to-orange-50 p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <X size={40} className="text-red-500" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-red-700 mb-2">
              Thanh toán thất bại hoặc đã hủy
            </h3>
            <p className="text-gray-600 text-sm">
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={loadPayOSData}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Thử lại
            </button>
            <button
              onClick={onCancelPayment}
              className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy thanh toán
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payOSData) {
    return (
      <div className="rounded-2xl border-0 shadow-sm bg-linear-to-r from-red-50 to-orange-50 p-8">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <AlertCircle size={40} className="text-red-600 mb-4" />
          <span className="text-gray-700 font-medium mb-6">
            Không thể tải thông tin thanh toán
          </span>
          <button
            onClick={loadPayOSData}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RotateCw size={16} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-blue-100 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50 p-6 sm:p-8">
        <div className="space-y-8 w-full">
          <div className="flex items-center gap-3 border-b border-blue-200/50 pb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <QrCode size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Thanh toán qua PayOS
            </h3>
          </div>

          <div className="bg-white rounded-xl p-6 text-center border border-blue-100 shadow-sm">
            <span className="text-gray-500 text-sm uppercase tracking-wide font-medium block mb-2">
              Số tiền cần thanh toán
            </span>
            <div className="text-3xl font-extrabold text-red-600">
              {formatPrice(payOSData.amount)}
            </div>
          </div>

          {payOSData.qrCode && (
            <div className="bg-white rounded-xl p-6 text-center border border-blue-100 shadow-sm flex flex-col items-center">
              <span className="text-gray-700 font-medium block mb-4">
                Quét mã QR để thanh toán
              </span>
              <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-inner mb-4">
                {/* <QRCode
                                    value={payOSData.qrCode}
                                    size={200}
                                    errorLevel="M"
                                    iconSize={40}
                                    bordered={false}
                                /> */}
                QR
              </div>
              <button
                onClick={() => copyToClipboard(payOSData.qrCode, "mã QR")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium py-1 px-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Copy size={14} /> Copy mã QR
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl overflow-hidden border border-blue-100 shadow-sm">
            <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-800">
                Thông tin tài khoản nhận tiền
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-sm text-gray-500">Số tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-bold text-gray-900 tracking-wide">
                    {payOSData.accountNumber}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(payOSData.accountNumber, "số tài khoản")
                    }
                    className="text-gray-600 hover:text-blue-600 p-1 transition-colors"
                    title="Copy số tài khoản"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-sm text-gray-500">Tên tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 uppercase">
                    {payOSData.accountName}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(payOSData.accountName, "tên tài khoản")
                    }
                    className="text-gray-600 hover:text-blue-600 p-1 transition-colors"
                    title="Copy tên tài khoản"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                <span className="text-sm text-gray-500">Mã đơn hàng</span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {payOSData.orderCode}
                </span>
              </div>
            </div>
          </div>

          {payOSData.paymentLink && (
            <a
              href={payOSData.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Mở trang thanh toán PayOS <ExternalLink size={18} />
            </a>
          )}

          <div className="space-y-3">
            <button
              onClick={checkPaymentStatus}
              disabled={verifying}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm disabled:opacity-70"
            >
              <RotateCw size={18} className={verifying ? "animate-spin" : ""} />
              Kiểm tra trạng thái thanh toán
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={18} /> Hủy thanh toán
            </button>
          </div>

          {/* Note */}
          <p className="text-gray-500 text-xs text-center italic">
            *Sau khi chuyển khoản, vui lòng nhấn nút "Kiểm tra trạng thái thanh
            toán" để xác nhận.
          </p>
        </div>
      </div>

      {/* Cancel Payment Modal */}
      <SimpleModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Xác nhận hủy thanh toán"
        footer={
          <>
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleCancelPayment}
              disabled={cancelling}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              {cancelling && <RotateCw size={14} className="animate-spin" />}
              Xác nhận hủy
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-gray-700 text-sm">
            Bạn có chắc chắn muốn hủy thanh toán này? Sau khi hủy, bạn có thể:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>Thử lại thanh toán với phương thức khác</li>
            <li>Hủy đơn hàng nếu không muốn tiếp tục</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-2 text-xs text-yellow-800">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>
              Lưu ý: Đơn hàng vẫn ở trạng thái "Chờ thanh toán" sau khi hủy giao
              dịch này.
            </span>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};