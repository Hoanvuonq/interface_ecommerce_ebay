"use client";
import { SectionHeader } from "@/components";
import { Headset, LifeBuoy, ShieldCheck } from "lucide-react";
import { ContactItem } from "../ContactItem";

export const QuickContact = () => {
  return (
    <div className="bg-white rounded-4xl p-8 shadow-custom border border-gray-50 relative overflow-hidden">
      <SectionHeader
        title="Liên hệ nhanh"
        icon={Headset}
        description="Hỗ trợ kỹ thuật & vận hành 24/7"
      />

      <div className="grid grid-cols-1 gap-5 pt-2">
        <ContactItem
          title="Quản lý trực tiếp"
          value={{ phone: "0123-456-789", email: "manager@company.com" }}
          icon={ShieldCheck}
          iconColor="text-indigo-500"
          colorClass="border-gray-100/80 hover:border-indigo-100 hover:shadow-indigo-500/5"
        />

        <ContactItem
          title="IT Support"
          value={{ phone: "0987-654-321", email: "support@it-hub.tech" }}
          icon={LifeBuoy}
          iconColor="text-orange-500"
          colorClass="border-gray-100/80 hover:border-orange-100 hover:shadow-orange-500/5"
        />
      </div>
    </div>
  );
};
