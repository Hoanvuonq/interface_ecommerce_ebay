import React from "react";
import { DollarSign } from "lucide-react";

interface FinancialInfoCardProps {
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
}

export const FinancialInfoCard: React.FC<FinancialInfoCardProps> = ({
    subtotal,
    discount,
    shippingFee,
    total,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-blue-600" />
                Tổng quan tài chính
            </h3>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tạm tính</span>
                    <span className="text-sm font-medium text-gray-900">
                        {(subtotal || 0).toLocaleString("vi-VN")}₫
                    </span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Giảm giá</span>
                        <span className="text-sm font-medium text-green-600">
                            -{(discount || 0).toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phí vận chuyển</span>
                    <span className="text-sm font-medium text-gray-900">
                        {(shippingFee || 0).toLocaleString("vi-VN")}₫
                    </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">
                            Tổng cộng
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                            {(total || 0).toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

