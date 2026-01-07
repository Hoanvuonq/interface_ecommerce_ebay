"use client";
import { Phone, RefreshCw, Users } from "lucide-react";
import { ContactItem } from "../ContactItem";

export const QuickContact = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-orange-50 rounded-2xl">
          <Phone className="text-orange-500" size={20} />
        </div>
        <span className="font-semibold text-gray-800 tracking-tight text-sm uppercase">
          LIÊN HỆ NHANH
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ContactItem
          title="Quản lý trực tiếp"
          value={{ phone: "0123-456-789", email: "manager@company.com" }}
          colorClass="bg-orange-50/30 border-orange-100/50"
          icon={Users}
        />
        <ContactItem
          title="IT Support"
          value={{ phone: "0987-654-321", email: "it@company.com" }}
          colorClass="bg-blue-50/30 border-blue-100/50"
          icon={RefreshCw}
        />
      </div>
    </div>
  );
};
