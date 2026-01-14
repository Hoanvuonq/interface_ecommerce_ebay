import {
  TransactionStatus,
  WithdrawalStatus,
} from "@/types/wallet/wallet.types";

export const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",

  APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  PROCESSING: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

export const WITHDRAWAL_STATUS_LABELS: Record<WithdrawalStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

export const getStatusStyle = (status: string): string => {
  return STATUS_STYLES[status] || "bg-gray-100 text-gray-800";
};

export const getTransactionLabel = (status: TransactionStatus): string => {
  return TRANSACTION_STATUS_LABELS[status] || status;
};

export const getWithdrawalLabel = (status: WithdrawalStatus): string => {
  return WITHDRAWAL_STATUS_LABELS[status] || status;
};

export const getStatusInfo = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          text: "Hoạt động",
          color: "text-green-600",
          bg: "bg-green-100",
          border: "border-green-200",
          icon: "bg-green-500",
        };
      case "FROZEN":
        return {
          text: "Đã đóng băng",
          color: "text-orange-600",
          bg: "bg-orange-100",
          border: "border-gray-200",
          icon: "bg-orange-500",
        };
      case "CLOSED":
        return {
          text: "Đã đóng",
          color: "text-red-600",
          bg: "bg-red-100",
          border: "border-red-200",
          icon: "bg-red-500",
        };
      default:
        return {
          text: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
          border: "border-gray-200",
          icon: "bg-gray-400",
        };
    }
  };

