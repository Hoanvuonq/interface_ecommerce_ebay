import React from "react";
import { User, Mail, Phone } from "lucide-react";

interface BuyerInfoCardProps {
    name: string;
    email: string;
    phone: string;
}

export const BuyerInfoCard: React.FC<BuyerInfoCardProps> = ({ name, email, phone }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Thông tin người mua
            </h3>

            <div className="space-y-3">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Tên khách hàng</p>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                        <p className="text-sm text-gray-700 break-all">{email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Số điện thoại</p>
                        <p className="text-sm font-medium text-gray-900">{phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

