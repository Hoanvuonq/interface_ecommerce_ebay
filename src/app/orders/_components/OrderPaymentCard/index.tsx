'use client';

import React, { useState } from 'react';
import { CreditCard, X, ExternalLink, AlertTriangle } from 'lucide-react';
import { paymentService } from '@/services/payment/payment.service';
import { SimpleModal } from '@/components';

interface OrderPaymentCardProps {
    orderId?: string;
    paymentUrl?: string;
    paymentMethod?: string;
    expiresAt?: string;
    onCancelPayment?: () => void;
    onRefresh?: () => void;
}

export const OrderPaymentCard: React.FC<OrderPaymentCardProps> = ({
    orderId,
    paymentUrl,
    paymentMethod,
    expiresAt,
    onCancelPayment,
    onRefresh,
}) => {
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCancelPayment = async () => {
        if (!orderId) return;

        setCancelling(true);
        try {
            await paymentService.cancelPaymentByOrder(orderId);
            setShowCancelModal(false);
            onCancelPayment?.();
            onRefresh?.();
        } catch (error: any) {
            console.error('Failed to cancel payment:', error);
            alert(error?.response?.data?.message || 'Không thể hủy thanh toán');
        } finally {
            setCancelling(false);
        }
    };

    if (!paymentUrl && !orderId) return null;

    return (
        <>
            <div className="rounded-2xl border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <div className="space-y-4 w-full">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <CreditCard size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Thanh toán
                        </h3>
                    </div>
                    
                    <p className="text-gray-700 text-sm">
                        Vui lòng hoàn tất thanh toán để đơn hàng được xử lý
                    </p>

                    {/* Payment Button */}
                    {paymentUrl && (
                        <a
                            href={paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                        >
                            Thanh toán ngay <ExternalLink size={18} />
                        </a>
                    )}

                    {expiresAt && (
                        <p className="text-gray-500 text-xs text-center block">
                            Hết hạn: {new Date(expiresAt).toLocaleString('vi-VN')}
                        </p>
                    )}

                    {/* Cancel Payment Button */}
                    {orderId && paymentMethod && paymentMethod !== 'COD' && (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors border border-transparent hover:border-red-100"
                        >
                            <X size={18} /> Hủy thanh toán
                        </button>
                    )}
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
                            {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
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
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <span>Lưu ý: Đơn hàng vẫn ở trạng thái "Chờ thanh toán" sau khi hủy giao dịch này.</span>
                    </div>
                </div>
            </SimpleModal>
        </>
    );
};