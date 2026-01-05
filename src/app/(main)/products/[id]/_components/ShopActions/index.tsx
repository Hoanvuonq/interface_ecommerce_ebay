"use client"; 

import { CustomButton } from "@/components";
import { MessageSquare, Store } from "lucide-react";
import { useRouter } from "next/navigation"; 

export const ShopActions = ({ shopId, onChat, chatLoading }: any) => {
  const router = useRouter(); 

  return (
    <div className="flex gap-2 w-full mt-2">
      <CustomButton
        type="primary"
        className="flex-1 bg-orange-600! hover:bg-orange-700! border-none! rounded-md! h-9! text-sm font-medium"
        loading={chatLoading}
        onClick={onChat}
        icon={<MessageSquare className="w-4 h-4" />}
      >
        Chat ngay
      </CustomButton>

      <CustomButton
        type="default"
        className="flex-1 rounded-md! h-9! border border-orange-600 text-orange-600! hover:bg-orange-50! text-sm transition-all shadow-none"
        onClick={() => router.push(`/shop/${shopId}`)} 
        icon={<Store className="w-4 h-4" />}
      >
        Xem Shop
      </CustomButton>
    </div>
  );
};