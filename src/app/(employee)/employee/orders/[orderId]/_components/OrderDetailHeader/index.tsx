"use client";

import React, { useState } from "react";
import { Copy, Printer, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";
import { PortalModal } from "@/features/PortalModal";
import { CustomButtonActions, FormInput } from "@/components";
import { UpdateStatusModal } from "../UpdateStatusModal";
import { cn } from "@/utils/cn";

interface OrderDetailHeaderProps {
  orderId: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  onCancelOrder?: (reason: string) => Promise<void>;
  onUpdateStatus?: (newStatus: string, note?: string) => Promise<void>;
}

export const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({
  orderId,
  orderNumber,
  status,
  createdAt,
  onCancelOrder,
  onUpdateStatus,
}) => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState({
    print: false,
    cancel: false,
    update: false,
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    success("Đã copy Order ID!");
  };

  const handlePrint = async () => {
    setLoading({ ...loading, print: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.print();
      success("Đã chuẩn bị bản in!");
    } catch (error) {
      toastError("Không thể in đơn hàng");
    } finally {
      setLoading({ ...loading, print: false });
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      toastError("Vui lòng nhập lý do hủy đơn");
      return;
    }

    setLoading({ ...loading, cancel: true });
    try {
      if (onCancelOrder) {
        await onCancelOrder(cancelReason);
        success("Đã hủy đơn hàng thành công!");
        setShowCancelModal(false);
        setCancelReason("");
      }
    } catch (error: any) {
      toastError(error.message || "Không thể hủy đơn hàng");
    } finally {
      setLoading({ ...loading, cancel: false });
    }
  };

  const handleUpdateStatusConfirm = async (
    newStatus: string,
    note?: string,
  ) => {
    setLoading({ ...loading, update: true });
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(newStatus, note);
      }
    } catch (error: any) {
      throw error;
    } finally {
      setLoading({ ...loading, update: false });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "PROCESSING":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-slate-50  text-gray-600 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Chờ xử lý",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold  text-gray-900 tracking-tighter uppercase italic leading-none">
              Đơn hàng <span className="text-orange-500">#{orderNumber}</span>
            </h1>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-90 shadow-sm border border-gray-100"
            >
              <Copy size={16} className=" text-gray-500" />
            </button>
            <span
              className={cn(
                "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm",
                getStatusColor(status),
              )}
            >
              {getStatusText(status)}
            </span>
          </div>
          <p className="text-[11px] font-bold  text-gray-400 uppercase tracking-widest ml-1">
            Giao thức khởi tạo:{" "}
            {format(new Date(createdAt), "dd/MM/yyyy • HH:mm")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            disabled={loading.print}
            className="h-11 px-5 rounded-2xl bg-slate-50 hover:bg-slate-100  text-gray-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-100 shadow-sm disabled:opacity-50 active:scale-95"
          >
            {loading.print ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Printer size={16} />
            )}
            <span>In hóa đơn</span>
          </button>

          <button
            onClick={() => setShowCancelModal(true)}
            disabled={
              loading.cancel || status === "CANCELLED" || status === "COMPLETED"
            }
            className="h-11 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-rose-100 shadow-sm disabled:opacity-30 active:scale-95"
          >
            <XCircle size={16} />
            <span>Hủy đơn</span>
          </button>

          <button
            onClick={() => setShowUpdateModal(true)}
            disabled={loading.update || status === "CANCELLED"}
            className="h-11 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-50 active:scale-95"
          >
            <RefreshCw
              size={16}
              className={cn(loading.update && "animate-spin")}
            />
            <span>Cập nhật trạng thái</span>
          </button>
        </div>
      </div>

      <PortalModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle size={20} strokeWidth={2.5} />
            <span className="uppercase font-bold text-sm tracking-tight">
              Xác nhận hủy giao dịch
            </span>
          </div>
        }
        footer={
          <CustomButtonActions
            onCancel={() => setShowCancelModal(false)}
            onSubmit={handleConfirmCancel}
            isLoading={loading.cancel}
            submitText="Xác nhận hủy đơn"
            cancelText="Quay lại"
            className="bg-rose-600 hover:bg-rose-700 shadow-rose-200"
          />
        }
      >
        <div className="space-y-5 py-2">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <p className="text-sm text-rose-700 leading-relaxed font-medium">
              Cảnh báo: Bạn đang thực hiện hủy đơn hàng{" "}
              <strong className="font-bold">#{orderNumber}</strong>. Hành động
              này sẽ giải phóng kho và hoàn lại voucher (nếu có).
            </p>
          </div>

          <FormInput
            label="Lý do hủy đơn hàng"
            isTextArea
            required
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Ví dụ: Khách hàng đổi ý, hết hàng trong kho, sai thông tin thanh toán..."
            className="min-h-30 focus:bg-white transition-all"
          />
        </div>
      </PortalModal>

      <UpdateStatusModal
        visible={showUpdateModal}
        currentStatus={status}
        orderNumber={orderNumber}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleUpdateStatusConfirm}
      />
    </div>
  );
};
