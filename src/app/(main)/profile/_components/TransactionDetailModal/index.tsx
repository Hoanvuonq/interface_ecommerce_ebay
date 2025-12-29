"use client";

import { WalletTransactionResponse } from "@/types/wallet/wallet.types";

interface TransactionDetailModalProps {
    open: boolean;
    transaction: WalletTransactionResponse | null;
    loading: boolean;
    onClose: () => void;
}

// Get transaction type color classes (Tailwind)
const getTransactionTypeStyles = (type: string) => {
    switch (type) {
        case "DEPOSIT":
        case "REFUND":
        case "TRANSFER_IN":
        case "ADJUSTMENT_INCREASE":
            return "bg-green-100 text-green-800 border-green-200";
        case "WITHDRAW":
        case "PAYMENT":
        case "TRANSFER_OUT":
        case "ADJUSTMENT_DECREASE":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-blue-100 text-blue-800 border-blue-200";
    }
};

// Get transaction status color classes (Tailwind)
const getTransactionStatusStyles = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "FAILED":
            return "bg-red-100 text-red-800 border-red-200";
        case "CANCELLED":
            return "bg-gray-100 text-gray-800 border-gray-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

// Get transaction type label
const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        DEPOSIT: "Nạp tiền",
        WITHDRAW: "Rút tiền",
        PAYMENT: "Thanh toán",
        REFUND: "Hoàn tiền",
        TRANSFER_IN: "Nhận chuyển",
        TRANSFER_OUT: "Chuyển đi",
        ADJUSTMENT_INCREASE: "Điều chỉnh tăng",
        ADJUSTMENT_DECREASE: "Điều chỉnh giảm",
    };
    return labels[type] || type;
};

// Get transaction status label
const getTransactionStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        COMPLETED: "Hoàn thành",
        PENDING: "Đang chờ",
        FAILED: "Thất bại",
        CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
};

export default function TransactionDetailModal({
    open,
    transaction,
    loading,
    onClose,
}: TransactionDetailModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Chi tiết giao dịch
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-500">Đang tải chi tiết giao dịch...</p>
                        </div>
                    ) : transaction ? (
                        <div className="space-y-6">
                            {/* Grid Layout for Key Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Mã giao dịch</div>
                                    <div className="text-sm font-medium text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100">
                                        {transaction.id}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Ngày giờ</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(transaction.createdDate).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Loại giao dịch</div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransactionTypeStyles(transaction.type)}`}>
                                        {getTransactionTypeLabel(transaction.type)}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Trạng thái</div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransactionStatusStyles(transaction.status)}`}>
                                        {getTransactionStatusLabel(transaction.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Statistics Section */}
                            <div className="border-t border-gray-100 pt-6 mt-2">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">Số dư trước</div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {transaction.balanceBefore.toLocaleString('vi-VN')} <span className="text-xs font-normal text-gray-500">VND</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">Số tiền</div>
                                        <div className={`text-base font-bold ${
                                            ["DEPOSIT", "REFUND", "TRANSFER_IN", "ADJUSTMENT_INCREASE"].includes(transaction.type) 
                                                ? 'text-green-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {["DEPOSIT", "REFUND", "TRANSFER_IN", "ADJUSTMENT_INCREASE"].includes(transaction.type) ? '+' : '-'}
                                            {transaction.amount.toLocaleString('vi-VN')} <span className="text-xs font-normal text-gray-500">VND</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">Số dư sau</div>
                                        <div className="text-sm font-semibold text-green-700">
                                            {transaction.balanceAfter.toLocaleString('vi-VN')} <span className="text-xs font-normal text-gray-500">VND</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-4">
                                {transaction.description && (
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Mô tả</div>
                                        <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {transaction.description}
                                        </div>
                                    </div>
                                )}
                                {transaction.note && (
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Ghi chú</div>
                                        <div className="text-sm text-gray-900 italic">
                                            {transaction.note}
                                        </div>
                                    </div>
                                )}
                                {transaction.referenceId && (
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Mã tham chiếu</div>
                                        <div className="text-sm font-mono text-gray-700">
                                            {transaction.referenceId}
                                        </div>
                                    </div>
                                )}
                                {transaction.referenceType && (
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Loại tham chiếu</div>
                                        <div className="text-sm text-gray-700">
                                            {transaction.referenceType}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Wallet ID</div>
                                    <div className="text-xs font-mono text-gray-400 truncate">
                                        {transaction.walletId}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            Không có dữ liệu
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}